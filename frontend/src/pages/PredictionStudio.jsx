import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RiskScoreMeter from '../components/RiskScoreMeter';
import ExplainableAIFactors from '../components/ExplainableAIFactors';
import { predictionAPI } from '../services/api';
import { BrainCircuit, Sparkles, CheckCircle2, Sliders, ArrowRight, RefreshCw } from 'lucide-react';

const PredictionStudio = () => {
  const [formData, setFormData] = useState({
    attendance_percentage: 62,
    current_gpa: 6.1,
    previous_gpa: 7.4,
    assignment_completion: 54,
    quiz_score: 58,
    lms_activity: 42,
    study_hours: 5,
    failed_subjects: 2,
    backlog_count: 2,
    engagement_score: 48,
    scholarship_status: true,
    financial_support_needed: true,
    attendance_trend: -18,
    academic_trend: -1.3
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Simulate artificial processing delay for demo polish
      await new Promise(r => setTimeout(r, 600));
      const res = await predictionAPI.createPrediction(formData);
      setResult(res.data);
    } catch (err) {
      console.error('Prediction studio error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="pb-2 border-b border-slate-200/80">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-ai-100 text-ai-700 font-extrabold text-[10px] uppercase tracking-wider">Interactive Studio</span>
              <span className="text-xs text-slate-400 font-medium">Random Forest Inference Sandbox</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Manual Student Risk Prediction Studio</h1>
            <p className="text-xs text-slate-500 font-medium">Adjust student metrics to simulate real-time AI risk scoring and explainable factor analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Input Form Controls */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Student Indicator Parameters</h3>
                </div>
                <span className="text-[11px] text-slate-400">14 Features</span>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-4 text-xs font-medium">
                
                {/* Attendance Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="font-bold text-slate-700">Attendance Percentage</label>
                    <span className="font-mono font-bold text-brand-600">{formData.attendance_percentage}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" step="1"
                    value={formData.attendance_percentage}
                    onChange={(e) => handleChange('attendance_percentage', parseFloat(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>

                {/* Current GPA & Previous GPA */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Current GPA (0-10)</label>
                    <input
                      type="number" min="0" max="10" step="0.1"
                      value={formData.current_gpa}
                      onChange={(e) => handleChange('current_gpa', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Previous GPA (0-10)</label>
                    <input
                      type="number" min="0" max="10" step="0.1"
                      value={formData.previous_gpa}
                      onChange={(e) => handleChange('previous_gpa', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>

                {/* Assignment Completion & LMS Activity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assignment Rate (%)</label>
                    <input
                      type="number" min="0" max="100"
                      value={formData.assignment_completion}
                      onChange={(e) => handleChange('assignment_completion', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">LMS Activity Score (%)</label>
                    <input
                      type="number" min="0" max="100"
                      value={formData.lms_activity}
                      onChange={(e) => handleChange('lms_activity', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>

                {/* Backlogs & Failed Subjects */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Failed Subjects</label>
                    <input
                      type="number" min="0" max="10"
                      value={formData.failed_subjects}
                      onChange={(e) => handleChange('failed_subjects', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Backlog Count</label>
                    <input
                      type="number" min="0" max="10"
                      value={formData.backlog_count}
                      onChange={(e) => handleChange('backlog_count', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>

                {/* Trends */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Attendance Trend (%)</label>
                    <input
                      type="number" min="-50" max="50"
                      value={formData.attendance_trend}
                      onChange={(e) => handleChange('attendance_trend', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Academic GPA Trend</label>
                    <input
                      type="number" min="-5" max="5" step="0.1"
                      value={formData.academic_trend}
                      onChange={(e) => handleChange('academic_trend', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>

                {/* Financial Support Needed */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="financial_support_needed"
                    checked={formData.financial_support_needed}
                    onChange={(e) => handleChange('financial_support_needed', e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  <label htmlFor="financial_support_needed" className="font-bold text-slate-700">Financial Support Assistance Flag</label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all mt-4"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>{loading ? 'AI Analyzing Student Learning Patterns...' : 'Analyze Student Risk'}</span>
                </button>

              </form>
            </div>

            {/* Right: Output Result Dashboard */}
            <div className="lg:col-span-6 space-y-6">
              {loading ? (
                <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-2xs">
                  <div className="w-12 h-12 border-4 border-ai-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">AI Risk Prediction Engine Active</h4>
                    <p className="text-xs text-slate-500 mt-1">Analyzing attendance trends, GPA trajectories, LMS activity, and backlog counts...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Risk Score Summary Card */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900">Prediction Results</h3>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                        Model {result.modelVersion}
                      </span>
                    </div>

                    <div className="py-2 flex justify-center">
                      <RiskScoreMeter
                        score={result.riskScore}
                        level={result.riskLevel}
                        confidence={result.confidence}
                      />
                    </div>
                  </div>

                  {/* Explainable AI Risk Factors */}
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs">
                    <ExplainableAIFactors factors={result.riskFactors} />
                  </div>

                  {/* Recommended Interventions */}
                  <div className="p-6 rounded-3xl bg-brand-50/70 border border-brand-100 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-900">Recommended Interventions</h4>
                    </div>

                    <ul className="space-y-2 text-xs font-semibold text-brand-800">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-center space-x-2 bg-white/90 p-2.5 rounded-xl border border-brand-100/80">
                          <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 space-y-2 shadow-2xs">
                  <BrainCircuit className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">Ready for Prediction</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Adjust the indicator parameters on the left and click "Analyze Student Risk" to generate an interpretable XAI risk breakdown.
                  </p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default PredictionStudio;
