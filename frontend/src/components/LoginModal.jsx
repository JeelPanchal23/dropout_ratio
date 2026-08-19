import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Sparkles, User, Lock, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, setDemoRole, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('faculty@edushield.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (onClose) onClose();
      if (res.user.role === 'Student') {
        navigate('/student-portal');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message || 'Invalid login credentials.');
    }
  };

  const handleQuickDemo = (role) => {
    setDemoRole(role);
    if (onClose) onClose();
    if (role === 'Student') {
      navigate('/student-portal');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden relative space-y-5 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Optional Close Button if user is already logged in */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-ai-600 p-0.5 shadow-xl shadow-brand-500/20 mb-1">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative">
              <Shield className="w-7 h-7 text-brand-400" />
              <GraduationCap className="w-5 h-5 text-ai-300 absolute -top-1 -right-1" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Continue</h2>
          <p className="text-xs text-slate-500 font-medium">Welcome to EduShield AI — Select a demo role or sign in</p>
        </div>

        {/* 1-Click Quick Demo Login Buttons */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 via-indigo-50/60 to-purple-50/40 border border-brand-100/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-brand-700 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
              <span>1-Click Hackathon Login</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Instant Access</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('Faculty')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-brand-600 hover:text-white text-slate-800 text-xs font-bold border border-slate-200/80 shadow-2xs transition-all text-center hover:scale-[1.02]"
            >
              Faculty
            </button>
            <button
              onClick={() => handleQuickDemo('Admin')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-indigo-600 hover:text-white text-slate-800 text-xs font-bold border border-slate-200/80 shadow-2xs transition-all text-center hover:scale-[1.02]"
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickDemo('Student')}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold border border-slate-200/80 shadow-2xs transition-all text-center hover:scale-[1.02]"
            >
              Student
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-extrabold tracking-wider absolute">or login with credentials</span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In & Enter Website'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginModal;
