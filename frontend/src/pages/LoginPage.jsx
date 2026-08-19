import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, GraduationCap, Sparkles, User, Lock, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [activeRoleTab, setActiveRoleTab] = useState('student'); // 'student' or 'faculty'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'Student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      
      {/* 3D Modern Background Animation & Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"
        />
        
        {/* Floating 3D AI/Education Particles */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/6 left-1/12 text-brand-400/20"
        >
          <GraduationCap className="w-24 h-24" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/6 right-1/12 text-indigo-400/20"
        >
          <Shield className="w-28 h-28" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 text-emerald-400/20"
        >
          <Sparkles className="w-16 h-16" />
        </motion.div>
      </div>

      {/* Main Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 via-indigo-500 to-purple-500 p-0.5 shadow-2xl shadow-brand-500/30 mb-1">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative">
              <Shield className="w-8 h-8 text-brand-400" />
              <GraduationCap className="w-5 h-5 text-indigo-300 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            EduShield AI
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Predict Early. Support Personally. Empower Every Student.
          </p>
        </div>

        {/* Role Tabs Selection */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/80 grid grid-cols-2 gap-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => { setActiveRoleTab('student'); setError(''); }}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeRoleTab === 'student'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student Login</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveRoleTab('faculty'); setError(''); }}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeRoleTab === 'faculty'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin / Faculty Login</span>
          </button>
        </div>

        {/* Glassmorphism Form Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative group hover:border-slate-700/80 transition-all duration-300">
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {activeRoleTab === 'student' ? 'Student Email Address' : 'Faculty / Admin Email'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder={activeRoleTab === 'student' ? 'student@university.edu' : 'admin@university.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
                activeRoleTab === 'student'
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              <span>{loading ? 'Authenticating...' : `Sign in as ${activeRoleTab === 'student' ? 'Student' : 'Faculty / Admin'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration Redirect Link */}
          {activeRoleTab === 'student' && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                New student?{' '}
                <Link to="/register" className="font-bold text-brand-400 hover:text-brand-300 hover:underline">
                  Create Student Account
                </Link>
              </p>
            </div>
          )}

          {activeRoleTab === 'faculty' && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
              <p className="text-[11px] text-slate-400 text-center font-semibold uppercase tracking-wider">
                Default Access Credentials
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@edushield.ai');
                    setPassword('password123');
                  }}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 text-slate-300 text-left transition-all"
                >
                  <p className="font-bold text-white">Admin Access</p>
                  <p className="text-[10px] text-slate-500 truncate">admin@edushield.ai</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('faculty@edushield.ai');
                    setPassword('password123');
                  }}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 text-left transition-all"
                >
                  <p className="font-bold text-white">Faculty Access</p>
                  <p className="text-[10px] text-slate-500 truncate">faculty@edushield.ai</p>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Responsible AI Notice Footer */}
        <p className="text-[11px] text-center text-slate-500 px-4 leading-relaxed">
          EduShield AI is an institutional decision-support system ensuring data privacy, zero demographic bias, and personal support.
        </p>

      </motion.div>
    </div>
  );
};

export default LoginPage;
