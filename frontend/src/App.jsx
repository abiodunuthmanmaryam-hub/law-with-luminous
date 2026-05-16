import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import NewsSection from './components/NewsSection';
import Auth from './components/Auth';
import ArticleView from './components/ArticleView';
import UserDashboard from './components/UserDashboard';
import TopicsDirectory from './components/TopicsDirectory';
import GlossaryAndFAQ from './components/GlossaryAndFAQ';
import {
  Search, ArrowRight, Globe, Scale, Home, Briefcase,
  Heart, ShoppingBag, BookOpen, HelpCircle, Newspaper
} from 'lucide-react';

const VIEWS = {
  HOME: 'home',
  ARTICLE: 'article',
  TOPICS: 'topics',
  GLOSSARY: 'glossary',
  NEWS: 'news',
  USER: 'user',
  ADMIN: 'admin',
};

function HomePage({ onNavigate, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleHeroSearch = async () => {
    if (searchQuery.trim() === '') return;
    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, language: 'en' })
      });
      const data = await response.json();
      onSearch(data);
      
      if (data.results && data.results.length > 0) {
        // Navigate to the most relevant article
        onNavigate(VIEWS.ARTICLE, data.results[0].slug);
      } else {
        alert("Luminous: " + (data.ai_summary || "I couldn't find specific laws for that, but I'm still learning!"));
      }
    } catch (error) {
      console.error("Search Error:", error);
      alert("AI Brain is offline. Please start the Python backend!");
    }
    setIsSearching(false);
  };

  const quickLinks = [
    { label: 'Landlord & Tenant Rights', slug: 'landlord-tenant-rights', icon: <Home className="w-5 h-5" /> },
    { label: 'Police Arrest & Your Rights', slug: 'what-happens-when-police-arrest-you', icon: <Scale className="w-5 h-5" /> },
    { label: 'Employment & Dismissal', slug: 'employment-rights', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Marriage & Family Law', slug: 'marriage-family-law', icon: <Heart className="w-5 h-5" /> },
    { label: 'Consumer Protection', slug: 'consumer-rights', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Know Your Constitutional Rights', slug: 'know-your-constitutional-rights', icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="bg-brand-navy-dark text-white py-24 px-4 text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-yellow rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
          <div className="inline-flex items-center bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30 px-4 py-2 rounded-full text-xs font-bold mb-8 uppercase tracking-widest animate-pulse-slow">
            🌟 Lighting the path for 200 Million Nigerians
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
            Nigerian Law, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-yellow">Simply Explained.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Understand your rights in plain English, Pidgin, Yoruba, Igbo, or Hausa. 
            No jargon. No confusion. Just clarity.
          </p>

          {/* Big Search Bar - Glassmorphism */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-yellow to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-2xl p-1 shadow-2xl">
              <div className="pl-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
                placeholder="Ask any legal question... (e.g. 'police arrest without warrant')"
                className="w-full pl-4 pr-36 py-4 rounded-xl text-gray-900 text-lg focus:outline-none"
              />
              <button 
                onClick={handleHeroSearch}
                disabled={isSearching}
                className="absolute right-1 top-1 bottom-1 bg-brand-navy text-white px-8 rounded-xl font-bold hover:bg-brand-navy-light transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-6 font-medium">
            Join 5,000+ Nigerians learning their rights today
          </p>
        </div>
      </section>

      {/* Quick Topic Cards */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-brand-navy mb-2">Essential Legal Guides</h2>
              <p className="text-gray-500">Pick a topic to start understanding your rights.</p>
            </div>
            <button
              onClick={() => onNavigate(VIEWS.TOPICS)}
              className="bg-brand-navy/5 text-brand-navy px-6 py-3 rounded-xl font-bold text-sm flex items-center hover:bg-brand-navy hover:text-white transition-all group"
            >
              Explore All Topics <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(VIEWS.ARTICLE, link.slug)}
                className="flex flex-col p-8 bg-white border border-gray-100 rounded-3xl hover:border-brand-yellow hover:shadow-[0_20px_50px_rgba(253,185,19,0.15)] transition-all text-left group relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-brand-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-yellow/10 transition-colors text-brand-navy group-hover:text-brand-yellow">
                  {link.icon}
                </div>
                <h3 className="font-bold text-xl text-brand-dark mb-2 group-hover:text-brand-navy transition-colors">{link.label}</h3>
                <p className="text-gray-500 text-sm mb-6">Learn exactly what the law says about this in Nigeria.</p>
                <div className="mt-auto flex items-center text-brand-navy font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Guide <ArrowRight className="w-4 h-4 ml-2" />
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Feature Highlights */}
      <section className="py-20 px-4 bg-brand-light border-y border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <button
            onClick={() => onNavigate(VIEWS.GLOSSARY)}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">Legal Dictionary</h3>
            <p className="text-gray-500 text-sm">Complex legal terms explained in simple English & Pidgin.</p>
          </button>
          <button
            onClick={() => onNavigate(VIEWS.GLOSSARY)}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">Common Questions</h3>
            <p className="text-gray-500 text-sm">Quick answers to everyday legal problems in Nigeria.</p>
          </button>
          <button
            onClick={() => onNavigate(VIEWS.NEWS)}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-left"
          >
            <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center mb-6">
              <Newspaper className="w-6 h-6 text-brand-yellow" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">Legal News</h3>
            <p className="text-gray-500 text-sm">Stay updated with changes in Nigerian laws and court rulings.</p>
          </button>
        </div>
      </section>

      {/* News Section */}
      <NewsSection />
    </div>
  );
}

function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState(null);
  const [searchData, setSearchData] = useState(null);

  const navigate = (v, slug = null) => {
    if (slug) setSelectedArticleSlug(slug);
    setView(v);
    window.scrollTo(0, 0);
  };

  const handleSearchResult = (data) => {
    setSearchData(data);
    // If we have results, maybe we show a search view or just highlight them
    if (data.results && data.results.length > 0) {
      // For now, let's just go to the first result if it's a direct match or similar
      // Or we could have a SEARCH view. Let's stick to navigating to the article for now.
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col font-sans relative">
      <Navbar
        onSignInClick={() => setShowAuth(true)}
        onNavigate={navigate}
        currentView={view}
        VIEWS={VIEWS}
        onSearch={handleSearchResult}
      />

      {showAuth && <Auth onClose={() => setShowAuth(false)} />}

      {/* Dev Nav Bar - Optional: hide in production */}
      <div className="bg-gray-900 py-1 px-4 flex justify-center space-x-4 flex-wrap text-xs">
        {Object.entries(VIEWS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => navigate(val)}
            className={`px-2 py-1 rounded transition ${view === val ? 'text-brand-yellow font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* View Router */}
      <main className="flex-1 flex flex-col">
        {view === VIEWS.HOME && <HomePage onNavigate={navigate} onSearch={handleSearchResult} />}
        {view === VIEWS.TOPICS && <TopicsDirectory onSelectTopic={(slug) => navigate(VIEWS.ARTICLE, slug)} />}
        {view === VIEWS.GLOSSARY && <GlossaryAndFAQ />}
        {view === VIEWS.NEWS && <div className="flex-1"><NewsSection /></div>}
        {view === VIEWS.ARTICLE && <ArticleView slug={selectedArticleSlug} onBack={() => navigate(VIEWS.TOPICS)} />}
        {view === VIEWS.USER && <UserDashboard />}
        {view === VIEWS.ADMIN && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;
