import React, { useState, useEffect } from 'react';
import {
  Home, Scale, Briefcase, Heart, Building2, ShoppingBag,
  Landmark, Plane, FileText, Users, ArrowRight, Search, Loader2
} from 'lucide-react';

const categoryMetadata = {
  'Constitutional Law': {
    icon: <Landmark className="w-8 h-8" />,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconBg: 'bg-blue-100',
    subtitle: 'Your fundamental rights as a Nigerian citizen'
  },
  'Criminal Law': {
    icon: <Scale className="w-8 h-8" />,
    color: 'bg-red-50 border-red-200 text-red-700',
    iconBg: 'bg-red-100',
    subtitle: 'Police, arrests, bail, and your rights in the justice system'
  },
  'Property Law': {
    icon: <Home className="w-8 h-8" />,
    color: 'bg-green-50 border-green-200 text-green-700',
    iconBg: 'bg-green-100',
    subtitle: 'Landlord rights, tenancy, land ownership & Omo-Onile'
  },
  'Employment Law': {
    icon: <Briefcase className="w-8 h-8" />,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconBg: 'bg-purple-100',
    subtitle: 'Workplace rights, dismissal, wages & contracts'
  },
  'Family Law': {
    icon: <Heart className="w-8 h-8" />,
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    iconBg: 'bg-pink-100',
    subtitle: 'Marriage, divorce, bride price & child custody'
  },
  'Consumer Protection': {
    icon: <ShoppingBag className="w-8 h-8" />,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconBg: 'bg-orange-100',
    subtitle: 'Bad products, scams, fraud & your consumer rights'
  },
  'Commercial Law': {
    icon: <Building2 className="w-8 h-8" />,
    color: 'bg-teal-50 border-teal-200 text-teal-700',
    iconBg: 'bg-teal-100',
    subtitle: 'Business contracts, debts, loans & partnerships'
  }
};

const defaultMeta = {
  icon: <FileText className="w-8 h-8" />,
  color: 'bg-gray-50 border-gray-200 text-gray-700',
  iconBg: 'bg-gray-100',
  subtitle: 'Legal guides and public service information'
};

export default function TopicsDirectory({ onSelectTopic }) {
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, []);

  // Group articles by category
  const grouped = articles.reduce((acc, article) => {
    const cat = article.category || 'General Law';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(article);
    return acc;
  }, {});

  const filteredCategories = Object.keys(grouped).filter(cat => 
    cat.toLowerCase().includes(search.toLowerCase()) ||
    grouped[cat].some(a => a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-brand-light min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-brand-navy mb-3">All Legal Topics</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse every area of Nigerian law, explained in plain language. Click any topic to read more.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics (e.g. 'landlord', 'police', 'divorce')..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none shadow-sm text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((catName) => {
              const meta = categoryMetadata[catName] || defaultMeta;
              const catArticles = grouped[catName];
              
              return (
                <div
                  key={catName}
                  className={`border-2 rounded-2xl p-6 hover:shadow-lg transition-all ${meta.color}`}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`p-3 rounded-xl ${meta.iconBg} flex-shrink-0`}>
                      {meta.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold leading-tight">{catName}</h2>
                      <p className="text-sm opacity-75 mt-1">{meta.subtitle}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {catArticles.slice(0, 3).map((article) => (
                      <li 
                        key={article.id} 
                        className="flex items-center text-sm opacity-90 hover:opacity-100 hover:text-brand-navy cursor-pointer"
                        onClick={() => onSelectTopic(article.slug)}
                      >
                        <ArrowRight className="w-4 h-4 mr-2 flex-shrink-0" />
                        {article.title}
                      </li>
                    ))}
                  </ul>

                  <div 
                    className="flex items-center font-bold text-sm hover:underline cursor-pointer"
                    onClick={() => onSelectTopic(catArticles[0].slug)}
                  >
                    Browse {catName} <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Scale className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No topics found for "<span className="font-semibold">{search}</span>"</p>
            <p className="text-sm mt-1">Try a different keyword like "landlord" or "arrest".</p>
          </div>
        )}
      </div>
    </div>
  );
}
