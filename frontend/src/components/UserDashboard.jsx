import React, { useState } from 'react';
import { User, Bookmark, MessageSquare, Clock, Settings, Bell, ChevronRight, BookOpen } from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('saved');

  // Mock user data
  const user = {
    name: 'Chinedu Okafor',
    email: 'chinedu@example.com',
    joinDate: 'Joined May 2024',
    language: 'English (Simple)'
  };

  const savedArticles = [
    { id: 1, title: 'Landlord & Tenant Rights', category: 'Property Law', dateSaved: '2 days ago' },
    { id: 2, title: 'What Happens If Police Arrest You', category: 'Criminal Law', dateSaved: '1 week ago' }
  ];

  const recentComments = [
    { id: 1, article: 'Landlord & Tenant Rights', text: 'My landlord disconnected my light, what can I do?', status: 'Pending Approval', date: 'Yesterday' }
  ];

  const readingHistory = [
    { id: 1, title: 'Know Your Constitutional Rights', date: 'Just now' },
    { id: 2, title: 'Employment Rights & Wrongful Dismissal', date: '3 days ago' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Profile Header */}
        <div className="bg-brand-navy p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center text-3xl font-bold text-brand-navy">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-brand-yellow mt-1">{user.email}</p>
              <div className="flex space-x-4 mt-3 text-sm text-gray-300">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {user.joinDate}</span>
                <span className="flex items-center"><User className="w-4 h-4 mr-1" /> Profile: Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 space-y-2">
            <button 
              onClick={() => setActiveTab('saved')}
              className={`w-full flex items-center p-3 rounded-lg font-medium transition-colors ${activeTab === 'saved' ? 'bg-brand-yellow/20 text-brand-navy' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Bookmark className="w-5 h-5 mr-3" /> Saved Articles
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`w-full flex items-center p-3 rounded-lg font-medium transition-colors ${activeTab === 'comments' ? 'bg-brand-yellow/20 text-brand-navy' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <MessageSquare className="w-5 h-5 mr-3" /> My Comments
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center p-3 rounded-lg font-medium transition-colors ${activeTab === 'history' ? 'bg-brand-yellow/20 text-brand-navy' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Clock className="w-5 h-5 mr-3" /> Reading History
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center p-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-brand-yellow/20 text-brand-navy' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Settings className="w-5 h-5 mr-3" /> Settings
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            
            {/* Saved Articles Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-brand-navy">Saved Articles</h2>
                  <span className="text-gray-500">{savedArticles.length} items</span>
                </div>
                
                {savedArticles.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>You haven't saved any articles yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {savedArticles.map(article => (
                      <div key={article.id} className="border border-gray-200 p-5 rounded-xl hover:border-brand-yellow transition flex justify-between items-center cursor-pointer group">
                        <div>
                          <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider">{article.category}</span>
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand-navy">{article.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Saved {article.dateSaved}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-navy" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">My Discussions</h2>
                <div className="space-y-4">
                  {recentComments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-brand-navy">{comment.article}</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-medium">
                          {comment.status}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">"{comment.text}"</p>
                      <p className="text-xs text-gray-500 mt-2">{comment.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Recently Viewed</h2>
                <div className="space-y-3">
                  {readingHistory.map(item => (
                    <div key={item.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                      </div>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Account Settings</h2>
                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-yellow focus:border-brand-yellow outline-none">
                      <option>English (Simple)</option>
                      <option>Nigerian Pidgin</option>
                      <option>Yoruba</option>
                      <option>Igbo</option>
                      <option>Hausa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-brand-yellow focus:ring-brand-navy mr-2" defaultChecked />
                        <span className="text-sm text-gray-700">When someone replies to my comment</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-brand-yellow focus:ring-brand-navy mr-2" defaultChecked />
                        <span className="text-sm text-gray-700">Major Nigerian legal updates</span>
                      </label>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button className="text-red-600 font-medium hover:underline text-sm">Sign Out</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
