import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  LifeBuoy, 
  BrainCircuit, 
  Sparkles, 
  Plus,
  RefreshCw,
  BarChart2,
  FileQuestion
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import { dashboardAPI } from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardAPI.getStats();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-400">Compiling institutional risk analytics...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { stats, riskDistribution, departmentAnalysis, topRiskFactors, aiInsights } = data || {
    stats: { totalStudents: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0, activeInterventions: 0 },
    riskDistribution: [],
    departmentAnalysis: [],
    topRiskFactors: [],
    aiInsights: []
  };

  const isDatabaseEmpty = !stats || stats.totalStudents === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Top Command Center Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-extrabold text-[10px] uppercase tracking-wider border border-brand-500/20">
                  Command Center
                </span>
                <span className="text-xs text-slate-400 font-medium">Institutional Analytics</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Faculty Command Center</h1>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to="/students"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Manage / Add Student</span>
              </Link>

              <button
                onClick={fetchDashboardData}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Metrics Cards (Shows 0 when empty) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <DashboardCard
              title="Total Students"
              value={stats.totalStudents || 0}
              subtext="Registered institutional students"
              icon={Users}
              color="brand"
            />
            <DashboardCard
              title="High Risk"
              value={stats.highRisk || 0}
              subtext="Requires immediate intervention"
              icon={AlertCircle}
              color="rose"
            />
            <DashboardCard
              title="Medium Risk"
              value={stats.mediumRisk || 0}
              subtext="Academic warning status"
              icon={AlertTriangle}
              color="amber"
            />
            <DashboardCard
              title="Low Risk"
              value={stats.lowRisk || 0}
              subtext="Satisfactory academic standing"
              icon={CheckCircle2}
              color="emerald"
            />
            <DashboardCard
              title="Active Interventions"
              value={stats.activeInterventions || 0}
              subtext="Mentor follow-ups assigned"
              icon={LifeBuoy}
              color="indigo"
            />
          </div>

          {/* Empty Database Experience Banner (Requirement 1, 39, 40) */}
          {isDatabaseEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/20">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">0 Registered Students in Database</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  No student records available yet. EduShield AI starts with an empty database. Register a student or invite students to complete their profiles to generate real analytics.
                </p>
              </div>
              <Link
                to="/students"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student Account</span>
              </Link>
            </motion.div>
          )}

          {/* AI Insights Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="text-xs font-extrabold tracking-wider text-amber-300 uppercase">Institutional AI Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {(aiInsights && aiInsights.length > 0) ? (
                aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span className="font-medium text-slate-300 leading-snug">{insight}</span>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 font-medium col-span-2">
                  No student data available yet. Add students to generate AI insights.
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Donut Chart: Risk Distribution */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Student Risk Level Distribution</h3>
                <p className="text-xs text-slate-400">Proportion of Low, Medium, and High Risk students</p>
              </div>

              {isDatabaseEmpty ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-500 font-medium">
                  No student data available yet.
                </div>
              ) : (
                <div className="h-64 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {!isDatabaseEmpty && (
                <div className="flex items-center justify-center space-x-6 text-xs font-semibold pt-2 border-t border-slate-800">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-300">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bar Chart: Department-wise Breakdown */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white">Department-Wise Risk Breakdown</h3>
                <p className="text-xs text-slate-400">Calculated from registered students in MongoDB</p>
              </div>

              {isDatabaseEmpty || departmentAnalysis.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-500 font-medium">
                  Add students to generate department analytics.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="High" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Medium" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Low" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
