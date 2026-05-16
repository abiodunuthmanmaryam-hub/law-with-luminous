import React, { useState } from 'react';
import { Mail, Lock, Phone, User, ArrowRight, ShieldCheck, Fingerprint, ScanFace, Loader2 } from 'lucide-react';

export default function Auth({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: ''
  });

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setPasswordStrength(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isEmail = formData.emailOrPhone.includes('@');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { [isEmail ? 'email' : 'phone']: formData.emailOrPhone, password: formData.password }
      : { name: formData.name, [isEmail ? 'email' : 'phone']: formData.emailOrPhone, password: formData.password };

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(isLogin ? "Welcome back!" : "Account created successfully!");
        onClose();
        window.location.reload(); // Quick way to update UI state
      } else {
        alert(data.error || "Authentication failed");
      }
    } catch (err) {
      alert("Backend server is offline!");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-brand-navy transition"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-brand-light p-8 text-center border-b border-gray-100">
          <div className="w-12 h-12 bg-brand-yellow rounded-full mx-auto flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-brand-navy" />
          </div>
          <h2 className="text-2xl font-bold text-brand-navy">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isLogin 
              ? 'Sign in to save articles and join discussions.' 
              : 'Join Law With Luminous to empower yourself.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition" 
                    placeholder="Chinedu Okafor" 
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition" 
                  placeholder="name@example.com or 080..." 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {isLogin && <a href="#" className="text-xs font-semibold text-brand-navy hover:underline">Forgot password?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (!isLogin) calculateStrength(e.target.value);
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition" 
                  placeholder="••••••••" 
                />
              </div>
              
              {!isLogin && (
                <div className="mt-2 flex space-x-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`h-1.5 w-full rounded-full ${passwordStrength >= level ? (passwordStrength > 2 ? 'bg-green-500' : 'bg-brand-yellow') : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="password" 
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-brand-navy bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow transition-all duration-200 mt-6 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </button>
          </form>

          {/* Biometric Placeholder Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Or Quick Sign In With</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => alert("Biometric FaceID will be active after SSL deployment.")}
                className="flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600 font-bold text-xs"
              >
                <ScanFace className="w-4 h-4 mr-2 text-brand-navy" /> FaceID
              </button>
              <button 
                onClick={() => alert("Fingerprint authentication will be active after SSL deployment.")}
                className="flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600 font-bold text-xs"
              >
                <Fingerprint className="w-4 h-4 mr-2 text-brand-navy" /> Fingerprint
              </button>
            </div>
          </div>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPasswordStrength(0);
                }}
                className="font-bold text-brand-navy hover:underline focus:outline-none"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
