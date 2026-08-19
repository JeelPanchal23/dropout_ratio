import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ShieldCheck, HeartHandshake, Lock, Eye, CheckCircle2 } from 'lucide-react';

const EthicalAIPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="pb-2 border-b border-slate-200/80">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Responsible & Ethical AI Governance</h1>
            <p className="text-xs text-slate-500 font-medium">Human-in-the-loop decision support framework aligned with SDG 4 (Quality Education)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Core Principle 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Decision Support, Never Penalty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                EduShield AI predictions are explicitly classified as mentor recommendation insights. The system never makes automated punitive decisions regarding grading, enrollment, or financial status.
              </p>
            </div>

            {/* Core Principle 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Exclusion of Sensitive Attributes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sensitive demographic markers (caste, religion, race, gender, disability status) are strictly excluded from predictive models to ensure bias mitigation and fair institutional assessment.
              </p>
            </div>

            {/* Core Principle 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Support-Oriented Indicators</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Socio-economic indicators are evaluated strictly to connect students with available scholarships, textbook grants, and peer support resources without exposing private details.
              </p>
            </div>

            {/* Core Principle 4 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-ai-50 text-ai-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Transparent & Explainable AI (XAI)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Risk scores are paired with explicit root cause factor breakdowns (e.g. attendance drop vs assignment rate) so educators understand exactly why support is recommended.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default EthicalAIPage;
