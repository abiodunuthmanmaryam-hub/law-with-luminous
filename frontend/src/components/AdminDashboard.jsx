import React, { useState, useEffect } from 'react';
import { ShieldCheck, Fingerprint, ScanFace, Check, X, Trash2, Loader2, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('moderation');
  const [isBiometricActive, setIsBiometricActive] = useState(false);
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/admin/comments/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.pending) {
        setPendingComments(data.pending);
      } else {
        setError("You are not authorized or session expired.");
      }
    } catch (err) {
      setError("Failed to connect to admin API.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleModeration = async (id, action) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/comments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ action }) // 'approve' or 'reject'
      });
      const data = await response.json();
      if (data.message) {
        setPendingComments(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Action failed.");
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-16 h-16 text-brand-yellow mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-brand-navy">Admin Access Denied</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <p className="text-sm text-gray-500 mt-4">Please log in with an administrator account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-navy p-6 flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ShieldCheck className="mr-2" /> Admin Headquarters
            </h1>
            <p className="text-gray-300 text-sm mt-1">Law With Luminous Management</p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsBiometricActive(!isBiometricActive)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded flex items-center transition"
            >
              <Fingerprint className="w-5 h-5 mr-2" /> Security Settings
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button 
            onClick={() => setActiveTab('moderation')}
            className={`px-6 py-4 font-medium ${activeTab === 'moderation' ? 'border-b-2 border-brand-yellow text-brand-navy' : 'text-gray-500'}`}
          >
            Comment Moderation (Safety Guard)
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-4 font-medium ${activeTab === 'content' ? 'border-b-2 border-brand-yellow text-brand-navy' : 'text-gray-500'}`}
          >
            Content & Translations
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          
          {/* Biometric Security Modal Placeholder */}
          {isBiometricActive && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-xl font-bold text-brand-navy mb-4">Biometric Authentication Setup</h2>
              <p className="text-gray-600 mb-6">Connect WebAuthn / Face API to secure the admin panel once SSL is deployed.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow flex flex-col items-center border hover:border-brand-yellow cursor-pointer">
                  <ScanFace className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="font-bold text-lg">Face Recognition</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">Requires camera access. Scans geometry points.</p>
                </div>
                <div className="bg-white p-6 rounded shadow flex flex-col items-center border hover:border-brand-yellow cursor-pointer">
                  <Fingerprint className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="font-bold text-lg">Fingerprint Scanner</h3>
                  <p className="text-sm text-gray-500 text-center mt-2">Uses device hardware via WebAuthn.</p>
                </div>
              </div>
            </div>
          )}

          {/* Moderation Queue */}
          {activeTab === 'moderation' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Pending Approvals</h2>
                <span className="bg-brand-yellow/20 text-brand-navy px-3 py-1 rounded-full text-sm font-bold">
                  {pendingComments.length} Pending
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
                </div>
              ) : pendingComments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Check className="w-12 h-12 mx-auto text-green-400 mb-3" />
                  <p>All clear! No pending comments to moderate.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingComments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm hover:shadow transition">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold text-gray-800">{comment.user_name}</span>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-brand-navy text-sm font-medium">{comment.article_title}</span>
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">"{comment.comment_text}"</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleModeration(comment.id, 'approve')}
                          className="flex items-center bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded font-medium transition"
                        >
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </button>
                        <button 
                          onClick={() => handleModeration(comment.id, 'reject')}
                          className="flex items-center bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded font-medium transition"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="py-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p className="text-lg mb-2">Content Translation Engine</p>
              <p className="text-sm">Admin UI for adding articles is coming in the next update.</p>
              <div className="mt-6 flex justify-center">
                 <button className="bg-brand-navy text-white px-6 py-2 rounded-lg opacity-50 cursor-not-allowed">
                   Add New Legal Article
                 </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
