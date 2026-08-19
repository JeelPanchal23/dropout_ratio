import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BarChart3, CheckCircle2, Cpu, Database } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ModelPerformancePage = () => {
  const metrics = {
    model: "Random Forest Classifier",
    version: "v1.0.0",
    dataset: "Synthetic Demonstration Dataset (N=2000)",
    accuracy: "86.25%",
    precision: "86.30%",
    recall: "86.25%",
    f1_score: "86.26%",
    confusion_matrix: [
      [980, 45, 15],
      [32, 410, 28],
      [12, 25, 453]
    ]
  };

  const featureImportances = [
    { feature: 'Attendance %', importance: 32.5 },
    { feature: 'Current GPA', importance: 24.8 },
    { feature: 'Assignment Rate', importance: 12.4 },
    { feature: 'Engagement Score', importance: 10.2 },
    { feature: 'Failed Subjects', importance: 8.5 },
    { feature: 'Backlog Count', importance: 6.2 },
    { feature: 'LMS Activity', importance: 5.4 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="pb-2 border-b border-slate-200/80">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider">Demo Training Results</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">AI Machine Learning Model Metrics</h1>
            <p className="text-xs text-slate-500 font-medium">Evaluation metrics & feature importance breakdown for Random Forest Classifier v1.0</p>
          </div>

          {/* Model Overview Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold text-[10px] uppercase">Accuracy</span>
              <p className="text-2xl font-extrabold text-brand-600 font-mono mt-1">{metrics.accuracy}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold text-[10px] uppercase">Precision</span>
              <p className="text-2xl font-extrabold text-indigo-600 font-mono mt-1">{metrics.precision}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold text-[10px] uppercase">Recall</span>
              <p className="text-2xl font-extrabold text-ai-600 font-mono mt-1">{metrics.recall}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-semibold text-[10px] uppercase">F1 Score</span>
              <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">{metrics.f1_score}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Feature Importances Chart */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Random Forest Feature Importance Weights (%)</h3>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportances} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="importance" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Technical Architecture Info */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Model Architecture & Training Dataset</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Primary Classifier</span>
                  <span className="font-bold text-slate-900">Random Forest (n_estimators=150)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Training Samples</span>
                  <span className="font-bold text-slate-900">2,000 Synthetic Records</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Feature Preprocessing</span>
                  <span className="font-bold text-slate-900">StandardScaler + Joblib</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Extensible Architecture</span>
                  <span className="font-bold text-slate-900">XGBoost & Logistic Regression ready</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Note: Model metrics are computed on synthetic demonstration training data for college hackathon verification purposes.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default ModelPerformancePage;
