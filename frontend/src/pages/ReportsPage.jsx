import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { reportsAPI } from '../services/api';
import { FileText, Download, Printer, BarChart2, CheckCircle2 } from 'lucide-react';

const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await reportsAPI.getOverview();
      setReport(res.data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!report) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Total Monitored Students,${report.summary.totalStudents}\n`;
    csvContent += `High Risk Count,${report.summary.highRisk}\n`;
    csvContent += `Medium Risk Count,${report.summary.mediumRisk}\n`;
    csvContent += `Low Risk Count,${report.summary.lowRisk}\n`;
    csvContent += `Active Interventions,${report.summary.activeInterventions}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EduShield_Executive_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-2 border-b border-slate-200/80">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Institutional System Reports</h1>
              <p className="text-xs text-slate-500 font-medium">Exportable executive summary reports on student risk distribution & intervention efficacy</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Report</span>
              </button>
            </div>
          </div>

          {loading || !report ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold">Generating system report...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Executive Summary Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-brand-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">Executive Summary</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Generated: {new Date(report.timestamp).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-semibold block text-[10px]">TOTAL STUDENTS</span>
                    <span className="text-2xl font-extrabold text-slate-900">{report.summary.totalStudents}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800">
                    <span className="font-semibold block text-[10px]">HIGH RISK (% OF TOTAL)</span>
                    <span className="text-2xl font-extrabold">{report.summary.highRisk} ({report.summary.highRiskPercentage}%)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800">
                    <span className="font-semibold block text-[10px]">MEDIUM RISK</span>
                    <span className="text-2xl font-extrabold">{report.summary.mediumRisk} ({report.summary.mediumRiskPercentage}%)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                    <span className="font-semibold block text-[10px]">LOW RISK</span>
                    <span className="text-2xl font-extrabold">{report.summary.lowRisk} ({report.summary.lowRiskPercentage}%)</span>
                  </div>
                </div>
              </div>

              {/* Department Analysis Table */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Department Performance & Risk Density</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4 text-center">Total</th>
                        <th className="py-3 px-4 text-center text-rose-600">High Risk</th>
                        <th className="py-3 px-4 text-center text-amber-600">Medium Risk</th>
                        <th className="py-3 px-4 text-center text-emerald-600">Low Risk</th>
                        <th className="py-3 px-4 text-center">Avg Attendance</th>
                        <th className="py-3 px-4 text-center">Avg GPA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {report.departmentAnalysis.map((d) => (
                        <tr key={d.department} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-bold text-slate-900">{d.department}</td>
                          <td className="py-3 px-4 text-center font-bold text-slate-700">{d.total}</td>
                          <td className="py-3 px-4 text-center font-extrabold text-rose-600">{d.High}</td>
                          <td className="py-3 px-4 text-center font-bold text-amber-600">{d.Medium}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">{d.Low}</td>
                          <td className="py-3 px-4 text-center font-bold">{d.avgAttendance}%</td>
                          <td className="py-3 px-4 text-center font-bold text-brand-700">{d.avgGpa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
