import React, { useState, useEffect } from 'react';
import { Share2, Bookmark, AlertCircle, MessageCircle, ThumbsUp, Send, ArrowLeft, BookOpen, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';

export default function ArticleView({ slug, onBack, currentLang = 'en' }) {
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [articleData, setArticleData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/articles/${slug}?lang=${currentLang}`)
      .then(res => res.json())
      .then(data => {
        if (data.article) {
          // Process string lists into arrays if needed
          const processed = { ...data.article };
          ['common_scenarios', 'your_rights', 'your_responsibilities', 'what_to_do'].forEach(key => {
            if (typeof processed[key] === 'string') {
              processed[key] = processed[key].split('|').map(s => s.trim());
            } else if (!processed[key]) {
              processed[key] = [];
            }
          });
          setArticleData(processed);
          setComments(data.comments || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching article:", err);
        setLoading(false);
      });
  }, [slug, currentLang]);

  const handlePostComment = () => {
    if (newComment.trim() === '') return;
    
    // In a real app, we'd need the user ID and token from auth state
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please sign in to post a comment.");
      return;
    }

    fetch('http://localhost:5000/api/comments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        article_id: articleData.id,
        comment_text: newComment
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Comment submitted for moderation!");
      setNewComment('');
    })
    .catch(err => alert("Failed to post comment."));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-light">
        <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
      </div>
    );
  }

  if (!articleData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-brand-light p-4 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-brand-navy">Article Not Found</h2>
        <p className="text-gray-600 mt-2">The legal guide you are looking for does not exist or has been moved.</p>
        <button onClick={onBack} className="mt-6 bg-brand-navy text-white px-6 py-2 rounded-lg font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-20 animate-fade-in">
      {/* Article Navigation Header */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center text-brand-navy font-bold text-sm hover:text-brand-yellow transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Topics
          </button>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSaved(!isSaved)} className="flex items-center text-gray-400 hover:text-brand-yellow transition">
              <Bookmark className={`w-5 h-5 mr-1 ${isSaved ? 'fill-brand-yellow text-brand-yellow' : ''}`} />
              <span className="text-xs font-bold hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="flex items-center text-gray-400 hover:text-brand-navy transition">
              <Share2 className="w-5 h-5 mr-1" />
              <span className="text-xs font-bold hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Main Content Card */}
        <article className="bg-white rounded-3xl shadow-xl shadow-brand-navy/5 overflow-hidden border border-gray-100">
          {/* Cover / Category */}
          <div className="bg-brand-navy p-8 sm:p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <span className="inline-block bg-brand-yellow text-brand-navy px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest mb-6">
                {articleData.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
                {articleData.title}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                {articleData.what_is_this}
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-12">
            {/* The "Naija" Plain English Version */}
            <div className="bg-brand-yellow/5 rounded-3xl p-8 border-2 border-brand-yellow/20 relative">
              <div className="absolute -top-4 left-8 bg-brand-yellow text-brand-navy px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter shadow-lg">
                ✨ Plain English Version
              </div>
              <p className="text-xl sm:text-2xl font-bold text-brand-navy leading-relaxed italic">
                "{articleData.simple_version}"
              </p>
            </div>

            {/* Why it matters */}
            <section className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h2 className="text-xl font-black text-brand-navy flex items-center mb-4 uppercase tracking-wider text-sm">
                  <AlertCircle className="w-5 h-5 mr-2 text-brand-yellow" />
                  Why you need to know this
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {articleData.why_you_need_to_know}
                </p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-black text-brand-navy flex items-center mb-4 uppercase tracking-wider text-sm">
                  <BookOpen className="w-5 h-5 mr-2 text-brand-navy" />
                  Legal Background
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {articleData.formal_explanation}
                </p>
              </div>
            </section>

            {/* Scenarios */}
            {articleData.common_scenarios.length > 0 && (
              <section>
                <h2 className="text-xl font-black text-brand-navy mb-6 uppercase tracking-wider text-sm">Common Situations in Nigeria</h2>
                <div className="grid grid-cols-1 gap-4">
                  {articleData.common_scenarios.map((scenario, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-white border border-gray-100 rounded-xl hover:border-brand-yellow transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-4 group-hover:bg-brand-yellow/10 transition-colors">
                        <span className="text-brand-navy font-bold text-sm">{idx + 1}</span>
                      </div>
                      <p className="text-gray-700 flex-1">{scenario}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rights & Responsibilities Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100">
                <h3 className="text-emerald-800 font-black mb-6 flex items-center uppercase tracking-widest text-xs">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Your Legal Rights
                </h3>
                <ul className="space-y-4">
                  {articleData.your_rights.map((right, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">✓</span>
                      </div>
                      <span className="text-emerald-900 font-medium text-sm leading-snug">{right}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-navy rounded-3xl p-8 text-white">
                <h3 className="text-brand-yellow font-black mb-6 flex items-center uppercase tracking-widest text-xs">
                  <ShieldAlert className="w-5 h-5 mr-2" /> Your Duties
                </h3>
                <ul className="space-y-4">
                  {articleData.your_responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">•</span>
                      </div>
                      <span className="text-gray-200 font-medium text-sm leading-snug">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Action Steps */}
            <section className="bg-gray-900 rounded-3xl p-8 sm:p-12 text-white">
              <h2 className="text-2xl font-black mb-8 text-brand-yellow">What To Do Now</h2>
              <div className="space-y-6">
                {articleData.what_to_do.map((step, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="text-3xl font-black text-white/10">{idx + 1}</div>
                    <p className="text-lg font-medium text-gray-200">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="text-brand-yellow font-bold text-sm uppercase mb-2">Free Legal Help</h4>
                <p className="text-gray-300">{articleData.where_to_get_help}</p>
              </div>
            </section>

            {/* FAQ Box */}
            <section className="border-t border-gray-100 pt-12">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex items-start">
                <div className="bg-brand-navy text-brand-yellow w-10 h-10 rounded-full flex items-center justify-center font-black flex-shrink-0 mr-4">?</div>
                <div>
                  <h4 className="font-bold text-brand-navy mb-2 text-lg">Common Question</h4>
                  <p className="text-gray-700 leading-relaxed italic">{articleData.faq}</p>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-brand-navy flex items-center">
              <MessageCircle className="w-6 h-6 mr-3 text-brand-yellow" />
              Community Discussion
            </h2>
            <span className="text-gray-400 font-bold text-sm">{comments.length} Comments</span>
          </div>

          {/* Comment Box */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-8">
            <textarea 
              className="w-full bg-gray-50 border-0 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-brand-yellow/50 resize-none transition-all"
              rows="3"
              placeholder="Have a question? Share it with the community..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <div className="flex justify-between items-center mt-4">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Safe Community Moderation Active</p>
              <button 
                onClick={handlePostComment}
                className="bg-brand-navy text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-navy-light transition-all shadow-lg active:scale-95 flex items-center"
              >
                Post Comment <Send className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No comments yet. Be the first to start the discussion!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="bg-white rounded-2xl p-6 border border-gray-100 flex gap-4 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-brand-navy/5 rounded-2xl flex items-center justify-center font-black text-brand-navy flex-shrink-0">
                    {comment.user_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-brand-navy text-sm">{comment.user_name}</span>
                      <span className="text-gray-400 text-[10px] font-bold uppercase">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{comment.comment_text}</p>
                    <div className="flex items-center gap-6">
                      <button className="flex items-center text-gray-400 hover:text-brand-navy transition group">
                        <ThumbsUp className="w-4 h-4 mr-1.5 group-hover:fill-brand-navy" /> 
                        <span className="text-[10px] font-black uppercase tracking-widest">0</span>
                      </button>
                      <button className="text-gray-400 hover:text-brand-navy text-[10px] font-black uppercase tracking-widest transition">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
