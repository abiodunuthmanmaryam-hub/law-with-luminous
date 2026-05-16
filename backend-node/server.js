require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'luminous_secret_key_2024';

app.use(cors());
app.use(express.json());

// ─── DATABASE SETUP ────────────────────────────────────────────────────────────
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) { console.error('DB Error:', err.message); return; }
  console.log('✅ Connected to SQLite database.');
  initializeDB();
});

function initializeDB() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      preferred_language TEXT DEFAULT 'en',
      role TEXT DEFAULT 'user',
      is_banned INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      auth_method TEXT DEFAULT 'password',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      slug TEXT UNIQUE,
      is_published INTEGER DEFAULT 1,
      view_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS article_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER,
      language_code TEXT,
      title TEXT,
      what_is_this TEXT,
      why_you_need_to_know TEXT,
      simple_version TEXT,
      formal_explanation TEXT,
      common_scenarios TEXT,
      your_rights TEXT,
      your_responsibilities TEXT,
      what_to_do TEXT,
      where_to_get_help TEXT,
      faq TEXT,
      FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER,
      user_id INTEGER,
      comment_text TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved INTEGER DEFAULT 0,
      FOREIGN KEY (article_id) REFERENCES articles (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS saved_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      article_id INTEGER,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, article_id),
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (article_id) REFERENCES articles (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      article_id INTEGER,
      action TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      headline TEXT,
      quick_summary TEXT,
      world_version TEXT,
      nigerian_impact TEXT,
      simple_explanation TEXT,
      nigerian_example TEXT,
      what_you_can_do TEXT,
      category TEXT,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed default admin
    const adminPass = bcrypt.hashSync('Admin@Luminous2024', 10);
    db.run(`INSERT OR IGNORE INTO admin (username, password_hash) VALUES ('admin', ?)`, [adminPass]);
    console.log('✅ DB schema ready. Default admin: admin / Admin@Luminous2024');
  });
}

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    req.admin = decoded;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

// ─── PUBLIC ROUTES ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '🌟 Law With Luminous Node API is running!' }));

// GET all published articles (with language filter)
app.get('/api/articles', (req, res) => {
  const lang = req.query.lang || 'en';
  const category = req.query.category;
  let query = `
    SELECT a.id, a.category, a.slug, a.view_count, a.created_at,
           t.title, t.what_is_this, t.simple_version, t.language_code
    FROM articles a
    JOIN article_translations t ON a.id = t.article_id
    WHERE a.is_published = 1 AND t.language_code = ?
  `;
  const params = [lang];
  if (category) { query += ' AND a.category = ?'; params.push(category); }
  query += ' ORDER BY a.created_at DESC';
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ articles: rows, count: rows.length });
  });
});

// GET single article by slug + language
app.get('/api/articles/:slug', (req, res) => {
  const lang = req.query.lang || 'en';
  const { slug } = req.params;
  db.run('UPDATE articles SET view_count = view_count + 1 WHERE slug = ?', [slug]);
  db.get(`
    SELECT a.id, a.category, a.slug, a.view_count,
           t.title, t.what_is_this, t.why_you_need_to_know, t.simple_version,
           t.formal_explanation, t.common_scenarios, t.your_rights,
           t.your_responsibilities, t.what_to_do, t.where_to_get_help, t.faq
    FROM articles a
    JOIN article_translations t ON a.id = t.article_id
    WHERE a.slug = ? AND t.language_code = ? AND a.is_published = 1
  `, [slug, lang], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Article not found' });
    // Get approved comments
    db.all(`
      SELECT c.id, c.comment_text, c.timestamp, u.name as user_name
      FROM comments c JOIN users u ON c.user_id = u.id
      WHERE c.article_id = ? AND c.approved = 1
      ORDER BY c.timestamp DESC
    `, [row.id], (err2, comments) => {
      res.json({ article: row, comments: comments || [] });
    });
  });
});

// GET categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM articles WHERE is_published = 1', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ categories: rows.map(r => r.category) });
  });
});

// Search articles
app.get('/api/search', (req, res) => {
  const { q, lang = 'en' } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });
  const term = `%${q}%`;
  db.all(`
    SELECT a.id, a.slug, a.category, t.title, t.what_is_this, t.simple_version
    FROM articles a
    JOIN article_translations t ON a.id = t.article_id
    WHERE a.is_published = 1 AND t.language_code = ?
    AND (t.title LIKE ? OR t.what_is_this LIKE ? OR t.simple_version LIKE ? OR t.faq LIKE ?)
    LIMIT 10
  `, [lang, term, term, term, term], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ results: rows, count: rows.length });
  });
});

// GET news
app.get('/api/news', (req, res) => {
  db.all('SELECT * FROM news WHERE is_published = 1 ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ news: rows });
  });
});

// ─── USER AUTH ROUTES ─────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, preferred_language } = req.body;
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (!email && !phone) return res.status(400).json({ error: 'Email or phone required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, phone, password_hash, preferred_language) VALUES (?, ?, ?, ?, ?)',
      [name, email || null, phone || null, hash, preferred_language || 'en'],
      function(err) {
        if (err) return res.status(400).json({ error: 'Email or phone already registered' });
        const token = jwt.sign({ id: this.lastID, name, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Account created!', token, user: { id: this.lastID, name, email, phone } });
      }
    );
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', (req, res) => {
  const { email, phone, password } = req.body;
  const identifier = email || phone;
  const field = email ? 'email' : 'phone';
  db.get(`SELECT * FROM users WHERE ${field} = ?`, [identifier], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.is_banned) return res.status(403).json({ error: 'Account banned' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, name: user.name, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, preferred_language: user.preferred_language } });
  });
});

// ─── USER AUTHENTICATED ROUTES ────────────────────────────────────────────────
app.get('/api/user/profile', authMiddleware, (req, res) => {
  db.get('SELECT id, name, email, phone, preferred_language, created_at FROM users WHERE id = ?',
    [req.user.id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });
      res.json({ user });
    });
});

app.post('/api/user/save-article', authMiddleware, (req, res) => {
  const { article_id } = req.body;
  db.run('INSERT OR IGNORE INTO saved_articles (user_id, article_id) VALUES (?, ?)',
    [req.user.id, article_id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Article saved!' });
    });
});

app.delete('/api/user/save-article/:article_id', authMiddleware, (req, res) => {
  db.run('DELETE FROM saved_articles WHERE user_id = ? AND article_id = ?',
    [req.user.id, req.params.article_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Article removed from saved.' });
    });
});

app.get('/api/user/saved-articles', authMiddleware, (req, res) => {
  const lang = req.query.lang || 'en';
  db.all(`
    SELECT a.id, a.slug, a.category, t.title, t.what_is_this, sa.saved_at
    FROM saved_articles sa
    JOIN articles a ON sa.article_id = a.id
    JOIN article_translations t ON a.id = t.article_id
    WHERE sa.user_id = ? AND t.language_code = ?
    ORDER BY sa.saved_at DESC
  `, [req.user.id, lang], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ saved_articles: rows });
  });
});

// Post comment (requires login, pending approval)
app.post('/api/comments', authMiddleware, (req, res) => {
  const { article_id, comment_text } = req.body;
  if (!comment_text || comment_text.trim() === '') return res.status(400).json({ error: 'Comment cannot be empty' });
  db.run('INSERT INTO comments (article_id, user_id, comment_text, approved) VALUES (?, ?, ?, 0)',
    [article_id, req.user.id, comment_text.trim()], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Comment submitted! It will appear after moderation.' });
    });
});

// ─── ADMIN AUTH ROUTES ─────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admin WHERE username = ?', [username], async (err, admin) => {
    if (err || !admin) return res.status(401).json({ error: 'Invalid admin credentials' });
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid admin credentials' });
    const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ message: 'Admin login successful', token });
  });
});

// ─── ADMIN MANAGEMENT ROUTES ──────────────────────────────────────────────────
// Get analytics dashboard data
app.get('/api/admin/analytics', adminMiddleware, (req, res) => {
  const data = {};
  db.get('SELECT COUNT(*) as total FROM users', [], (_, r) => { data.total_users = r?.total || 0; });
  db.get('SELECT COUNT(*) as total FROM articles', [], (_, r) => { data.total_articles = r?.total || 0; });
  db.get('SELECT COUNT(*) as total FROM comments WHERE approved = 0', [], (_, r) => { data.pending_comments = r?.total || 0; });
  db.all('SELECT id, slug, category, view_count FROM articles ORDER BY view_count DESC LIMIT 5', [], (_, r) => {
    data.top_articles = r || [];
    res.json(data);
  });
});

// Get all pending comments
app.get('/api/admin/comments/pending', adminMiddleware, (req, res) => {
  db.all(`
    SELECT c.id, c.comment_text, c.timestamp, c.article_id,
           u.name as user_name, u.id as user_id,
           t.title as article_title
    FROM comments c
    JOIN users u ON c.user_id = u.id
    JOIN article_translations t ON c.article_id = t.article_id AND t.language_code = 'en'
    WHERE c.approved = 0
    ORDER BY c.timestamp ASC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ pending: rows });
  });
});

// Approve or reject comment
app.put('/api/admin/comments/:id', adminMiddleware, (req, res) => {
  const { action } = req.body; // 'approve' or 'reject'
  if (action === 'approve') {
    db.run('UPDATE comments SET approved = 1 WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Comment approved.' });
    });
  } else {
    db.run('DELETE FROM comments WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Comment rejected and deleted.' });
    });
  }
});

// Get all users
app.get('/api/admin/users', adminMiddleware, (req, res) => {
  db.all('SELECT id, name, email, phone, preferred_language, role, is_banned, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ users: rows });
  });
});

// Ban/unban user
app.put('/api/admin/users/:id/ban', adminMiddleware, (req, res) => {
  const { is_banned } = req.body;
  db.run('UPDATE users SET is_banned = ? WHERE id = ?', [is_banned ? 1 : 0, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: is_banned ? 'User banned.' : 'User unbanned.' });
  });
});

// CRUD: Create article
app.post('/api/admin/articles', adminMiddleware, (req, res) => {
  const { category, slug, translations } = req.body;
  db.run('INSERT INTO articles (category, slug) VALUES (?, ?)', [category, slug], function(err) {
    if (err) return res.status(400).json({ error: 'Slug already exists or DB error.' });
    const articleId = this.lastID;
    const stmt = db.prepare(`INSERT INTO article_translations
      (article_id, language_code, title, what_is_this, why_you_need_to_know, simple_version,
       formal_explanation, common_scenarios, your_rights, your_responsibilities, what_to_do, where_to_get_help, faq)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    translations.forEach(t => {
      stmt.run([articleId, t.language_code, t.title, t.what_is_this, t.why_you_need_to_know,
        t.simple_version, t.formal_explanation, t.common_scenarios, t.your_rights,
        t.your_responsibilities, t.what_to_do, t.where_to_get_help, t.faq]);
    });
    stmt.finalize(() => res.json({ message: 'Article created!', article_id: articleId }));
  });
});

// CRUD: Update article
app.put('/api/admin/articles/:id', adminMiddleware, (req, res) => {
  const { category, is_published } = req.body;
  db.run('UPDATE articles SET category = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [category, is_published, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Article updated.' });
    });
});

// CRUD: Delete article
app.delete('/api/admin/articles/:id', adminMiddleware, (req, res) => {
  db.run('DELETE FROM articles WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Article deleted.' });
  });
});

// Admin: Create/manage news articles
app.post('/api/admin/news', adminMiddleware, (req, res) => {
  const { headline, quick_summary, world_version, nigerian_impact, simple_explanation, nigerian_example, what_you_can_do, category } = req.body;
  db.run(`INSERT INTO news (headline, quick_summary, world_version, nigerian_impact, simple_explanation, nigerian_example, what_you_can_do, category) VALUES (?,?,?,?,?,?,?,?)`,
    [headline, quick_summary, world_version, nigerian_impact, simple_explanation, nigerian_example, what_you_can_do, category],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'News article created!', id: this.lastID });
    });
});

app.listen(PORT, () => console.log(`🚀 Law With Luminous Node Server running on port ${PORT}`));
