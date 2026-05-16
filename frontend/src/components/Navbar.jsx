import React, { useState } from 'react';
import { Globe, Menu, Search, X, Scale } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', label: 'Simple English' },
  { code: 'pcm', name: 'Pidgin', label: 'Nigerian Pidgin' },
  { code: 'yo', name: 'Yoruba', label: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', label: 'Ígbò' },
  { code: 'ha', name: 'Hausa', label: 'Hausa' }
];

export default function Navbar({ onSignInClick, onNavigate, onSearch, currentView, VIEWS }) {
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      setIsSearching(true);
      try {
        const response = await fetch('http://localhost:8000/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery, language: currentLang.code })
        });
        const data = await response.json();
        
        if (onSearch) onSearch(data);
        
        if (data.results && data.results.length > 0) {
          onNavigate(VIEWS.ARTICLE, data.results[0].slug);
        } else {
          alert("Luminous: " + (data.ai_summary || "I couldn't find a specific law for that."));
        }
      } catch (error) {
        console.error("Search Error:", error);
        alert("Make sure the Python AI Brain is running on port 8000!");
      }
      setIsSearching(false);
    }
  };

  return (
    <nav className="bg-brand-navy-dark text-white shadow-2xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div 
            onClick={() => onNavigate(VIEWS.HOME)}
            className="flex-shrink-0 flex items-center cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_20px_rgba(253,185,19,0.3)]">
              <Scale className="text-brand-navy w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none">
                LUMINOUS
              </span>
              <span className="text-[10px] text-brand-yellow font-bold tracking-[0.2em] uppercase leading-none mt-1">
                Law For Nigeria
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-12">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-yellow transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="block w-full pl-12 pr-4 py-3 border-0 rounded-2xl leading-5 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-brand-yellow/50 sm:text-sm transition-all duration-300"
                placeholder={isSearching ? "Consulting AI Legal Brain..." : `Search law in ${currentLang.name}...`}
              />
            </div>
          </div>

          {/* Desktop Right Side Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <button 
                onClick={() => onNavigate(VIEWS.TOPICS)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors ${currentView === VIEWS.TOPICS ? 'text-brand-yellow' : 'text-gray-300 hover:text-white'}`}
              >
                Topics
              </button>
              <button 
                onClick={() => onNavigate(VIEWS.NEWS)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors ${currentView === VIEWS.NEWS ? 'text-brand-yellow' : 'text-gray-300 hover:text-white'}`}
              >
                Legal News
              </button>
            </nav>
            
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-2 text-gray-200 hover:text-white bg-white/5 px-4 py-2 rounded-xl transition-all border border-white/10 hover:border-brand-yellow/30"
              >
                <Globe className="h-4 w-4 text-brand-yellow" />
                <span className="text-sm font-bold">{currentLang.name}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 py-2 overflow-hidden animate-fade-in">
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                    Select Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                        currentLang.code === lang.code 
                          ? 'bg-brand-navy text-white font-bold' 
                          : 'text-gray-700 hover:bg-brand-yellow/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{lang.name}</span>
                        <span className="text-[10px] opacity-60 font-medium">{lang.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={onSignInClick}
              className="bg-brand-yellow text-brand-navy px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-tight hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              Sign In
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="text-gray-200 hover:text-white bg-white/5 p-2 rounded-lg"
            >
              <Globe className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-200 hover:text-white bg-white/5 p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Language Menu */}
      <div className={`${isLangMenuOpen ? 'block' : 'hidden'} md:hidden bg-brand-navy-dark border-t border-white/5 animate-fade-in`}>
        <div className="px-4 pt-4 pb-6 grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang);
                setIsLangMenuOpen(false);
              }}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                currentLang.code === lang.code
                  ? 'bg-brand-yellow text-brand-navy shadow-lg'
                  : 'bg-white/5 text-gray-300 border border-white/5'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-brand-navy-dark border-t border-white/5 animate-slide-up`}>
        <div className="px-4 pt-4 pb-8 space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border-0 rounded-2xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
              placeholder={`Search in ${currentLang.name}...`}
            />
          </div>
          <button 
            onClick={() => { onNavigate(VIEWS.TOPICS); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-4 py-4 rounded-2xl text-lg font-bold text-white hover:bg-white/5 border border-white/5"
          >
            Topics Directory
          </button>
          <button 
            onClick={() => { onNavigate(VIEWS.NEWS); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-4 py-4 rounded-2xl text-lg font-bold text-white hover:bg-white/5 border border-white/5"
          >
            Legal News
          </button>
          <button 
            onClick={() => { onSignInClick(); setIsMobileMenuOpen(false); }}
            className="w-full bg-brand-yellow text-brand-navy py-4 rounded-2xl font-black text-lg uppercase shadow-xl"
          >
            Sign In to Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
}
