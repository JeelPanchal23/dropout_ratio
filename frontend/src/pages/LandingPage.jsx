import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  GraduationCap, 
  BrainCircuit, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight, 
  HeartHandshake, 
  BookOpen, 
  Layers, 
  Target
} from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Animated Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-brand-300/30 via-indigo-300/20 to-ai-300/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
                <span>SDG 4 Aligned — AI for Education & Human Development</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                AI-Powered <br className="hidden sm:inline" />
                <span className="gradient-text">Student Success Platform</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Identify academic risk early, understand why students need support through explainable AI, and deliver personalized interventions before challenges become dropouts.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <span>Explore Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm border border-slate-200 shadow-2xs flex items-center justify-center transition-all"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/60 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Explainable AI Risk Factors</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Human-in-the-Loop Governance</span>
                </span>
              </div>
            </div>

            {/* Right Hero Illustration Preview */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 shadow-2xl space-y-4"
              >
                {/* Header Mock Card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      78%
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Student Risk Assessment</h4>
                      <p className="text-[11px] text-rose-600 font-bold">HIGH RISK DETECTED</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">STU2024042</span>
                </div>

                {/* XAI Factor Preview */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                    <span className="font-semibold text-rose-900">Attendance dropped to 62%</span>
                    <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-extrabold uppercase">High Impact</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                    <span className="font-semibold text-amber-900">GPA decreased from 7.4 to 6.1</span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-800 text-[10px] font-extrabold uppercase">High Impact</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">LMS engagement down by 38%</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">Medium Impact</span>
                  </div>
                </div>

                {/* Suggested Action */}
                <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <BrainCircuit className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="font-bold text-brand-900">Recommended Action: Faculty Mentorship</span>
                  </div>
                  <span className="text-brand-600 font-extrabold text-[11px]">Assigned</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-white border-y border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-brand-600 font-mono">5</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Students Monitored</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-mono">94%</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Prediction Accuracy</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">2</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Active Interventions</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-ai-600 font-mono">78%</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Improved Engagement</p>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-400 mt-4 italic">* Demonstrating real-time aggregate student performance metrics.</p>
        </div>
      </section>

      {/* How It Works (4-Step Flow) */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600">Proactive Student Support</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">How EduShield AI Works</h3>
            <p className="text-sm font-medium text-slate-600">
              A 4-step explainable intelligence loop designed to connect educators with students who need personalized support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 font-extrabold text-lg flex items-center justify-center font-mono">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900">Collect Data</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gather attendance, GPA trends, assignment completion, LMS activity, and support indicators seamlessly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-lg flex items-center justify-center font-mono">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900">Analyze Patterns</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Machine Learning models analyze non-linear interactions across behavioral and academic performance vectors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-ai-50 text-ai-600 font-extrabold text-lg flex items-center justify-center font-mono">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900">Predict & Explain</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate interpretable risk scores paired with quantified Explainable AI (XAI) root cause risk drivers.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-lg flex items-center justify-center font-mono">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900">Personalized Support</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recommend tailored interventions, assign faculty mentors, and track student outcomes to completion.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SDG 4 Section */}
      <section id="sdg4" className="py-20 bg-gradient-to-br from-indigo-900 via-slate-900 to-brand-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-extrabold text-xs uppercase tracking-wider border border-brand-400/30">
                SDG 4 – Quality Education
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Supporting Inclusive, Equitable Quality Education for Every Student
              </h2>
              <p className="text-sm sm:text-base text-indigo-150 leading-relaxed">
                EduShield AI is built on the principle that academic challenges can be anticipated and overcome when educators are empowered with early, actionable decision support.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-2">
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Target className="w-5 h-5 text-brand-400 shrink-0" />
                  <span>Early Academic Support</span>
                </div>
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>Personalized Tutoring Plans</span>
                </div>
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Faculty Mentor Engagement</span>
                </div>
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <HeartHandshake className="w-5 h-5 text-ai-400 shrink-0" />
                  <span>Human-Centered Action</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 space-y-6">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <div>
                    <h4 className="text-lg font-bold">Ethical & Decision Support Principles</h4>
                    <p className="text-xs text-indigo-200">AI is a mentor recommendation tool, never an automated penalty.</p>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-indigo-100">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>No sensitive demographic features (caste, religion, gender) used in predictive models.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>All AI scores require educator human review prior to initiating contact or support.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Support indicators connect students with scholarships and aid without exposure.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 font-bold text-slate-900">
            <span>EduShield AI</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-normal">Predict Early. Support Personally. Empower Every Student.</span>
          </div>
          <div>
            <p>© 2026 EduShield AI. College Hackathon Showcase Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
