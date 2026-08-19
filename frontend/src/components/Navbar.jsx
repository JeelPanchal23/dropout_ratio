import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <Link to={user?.role === 'Student' ? '/student/dashboard' : '/admin/dashboard'} className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Shield className="w-5 h-5 text-brand-400 absolute" />
                <GraduationCap className="w-4 h-4 text-indigo-300 absolute -top-0.5 right-0.5" />
                <Sparkles className="w-3 h-3 text-amber-300 absolute bottom-1 left-1 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">EduShield</span>
                <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 uppercase tracking-wider border border-brand-500/30">AI</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Academic Success & Intervention</span>
            </div>
          </Link>

          {/* User Status & Controls */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <User className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-slate-300 font-bold">{user.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                  {user.role === 'Admin' ? 'Faculty Admin' : user.role}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 border border-slate-800 transition-all flex items-center space-x-1.5 text-xs font-bold"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
