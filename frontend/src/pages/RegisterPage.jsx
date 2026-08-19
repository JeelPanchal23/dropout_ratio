import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, GraduationCap, User, Lock, Mail, Phone, Building, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    phone: '',
    department: 'Computer Engineering',
    semester: 1,
    college: '',
    dateOfBirth: '',
    profilePhoto: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.studentId || !formData.email || !formData.password) {
      setError('Please fill in all required fields (Name, Student ID, Email, Password).');
      return;
    }

    const payload = {
      ...formData,
      role: 'Student',
      semester: Number(formData.semester)
    };

    const res = await register(payload);
    if (res.success) {
      navigate('/student/dashboard');
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 p-0.5 shadow-xl shadow-brand-500/20 mb-1">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center relative">
              <Shield className="w-7 h-7 text-brand-400" />
              <GraduationCap className="w-4 h-4 text-indigo-300 absolute -top-1 -right-1" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Create Student Account</h2>
          <p className="text-xs text-slate-400">Register to unlock personalized AI academic support & insights</p>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Student ID / Roll No *</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="studentId"
                    placeholder="e.g. STU2026-001"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI & Robotics">AI & Robotics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Current Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-brand-500"
                >
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">College / Institution Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  name="college"
                  placeholder="e.g. National Institute of Technology"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Privacy Notice Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Privacy & Data Protection Notice</span>
              </div>
              <p className="leading-relaxed">
                Your academic data is protected with JWT authorization. Sensitive traits like religion or caste are never requested or used. AI predictions serve as decision-support tools to recommend personalized support.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Student Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-brand-400 hover:text-brand-300 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
