import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ShieldCheck, Lock, EyeOff, Scale, UserCheck, FileCheck } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Governance & Protection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Privacy & Ethical AI Principles</h1>
            <p className="text-xs text-slate-400">EduShield AI Security, Confidentiality & Anti-Discrimination Policy</p>
          </div>

          <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Lock className="w-4 h-4 text-brand-400" />
                <h3>1. Student Data Privacy & Authorization</h3>
              </div>
              <p>
                Student educational records, attendance statistics, academic SPI/CPI, and uploaded documents are strictly private. All API endpoints enforce Json Web Token (JWT) verification and role-based access control (RBAC). Students can ONLY access their own records.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <EyeOff className="w-4 h-4 text-indigo-400" />
                <h3>2. File & Document Storage Security</h3>
              </div>
              <p>
                Uploaded resumes, CVs, and certificates are stored in protected institutional server directories. Direct public URL access is blocked. Files can only be downloaded via authenticated endpoints after verifying user ownership or authorized faculty role.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h3>3. Non-Discriminatory Ethical AI</h3>
              </div>
              <p>
                EduShield AI models rely exclusively on objective academic indicators (attendance, SPI/CPI, assignment submission, LMS activity, backlogs). Sensitive traits such as religion, caste, race, sexual orientation, or political beliefs are never requested, stored, or used as prediction features.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <h3>4. Responsible AI Decision Support</h3>
              </div>
              <p className="italic text-slate-400">
                "AI-generated risk assessments are intended to support educators in identifying students who may benefit from additional support. They are not definitive predictions of a student's future and should not be used as the sole basis for academic decisions."
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPage;
