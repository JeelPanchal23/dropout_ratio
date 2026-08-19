import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { csvAPI } from '../services/api';
import { FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, Download, ArrowRight } from 'lucide-react';

const CSVImportPage = () => {
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const sampleCSV = `studentId,name,email,department,semester,attendance,currentGpa,previousGpa,assignmentCompletion,failedSubjects,backlogCount
STU2026901,Aman Verma,aman.v@univ.edu,Computer Engineering,4,58,5.4,6.8,50,2,1
STU2026902,Neha Rastogi,neha.r@univ.edu,Information Technology,6,88,8.2,8.0,92,0,0
STU2026903,Rahul Mehta,rahul.m@univ.edu,Mechanical Engineering,2,42,4.8,6.2,35,3,2`;

  const handleLoadSample = () => {
    setCsvText(sampleCSV);
  };

  const handleParseAndUpload = async () => {
    if (!csvText.trim()) return;
    setLoading(true);
    setSummary(null);

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) return;

      const headers = lines[0].split(',').map(h => h.trim());
      const students = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(c => c.trim());
        if (row.length < headers.length) continue;

        const obj = {};
        headers.forEach((h, idx) => {
          obj[h] = row[idx];
        });
        students.push(obj);
      }

      const res = await csvAPI.importCSV(students);
      setSummary(res.data.summary);
    } catch (err) {
      console.error('CSV import failed:', err);
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
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Bulk Student Data Import</h1>
            <p className="text-xs text-slate-500 font-medium">Upload institutional CSV datasets to parse, validate, and auto-generate batch AI risk scores</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Upload / Input Controls */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Paste or Upload CSV Content</h3>
                </div>
                <button
                  onClick={handleLoadSample}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Load Sample CSV</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CSV Data Input</label>
                <textarea
                  rows={10}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste raw CSV dataset content here..."
                  className="w-full p-3 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                onClick={handleParseAndUpload}
                disabled={loading || !csvText.trim()}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>{loading ? 'Validating & Processing Batch ML Predictions...' : 'Process Bulk Import'}</span>
              </button>
            </div>

            {/* Right Summary Results */}
            <div className="lg:col-span-6 space-y-6">
              {summary ? (
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">Import Processing Summary</h3>

                  <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">TOTAL RECORDS</span>
                      <span className="text-xl text-slate-900 font-mono">{summary.totalRecords}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800">
                      <span className="block text-[10px]">SUCCESSFULLY IMPORTED</span>
                      <span className="text-xl font-mono">{summary.successfullyImported}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800">
                      <span className="block text-[10px]">HIGH RISK DETECTED</span>
                      <span className="text-xl font-mono">{summary.highRiskDetected}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800">
                      <span className="block text-[10px]">FAILED REJECTED</span>
                      <span className="text-xl font-mono">{summary.failedRecords}</span>
                    </div>
                  </div>

                  {summary.errors && summary.errors.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-xs space-y-1">
                      <span className="font-bold text-rose-900 block mb-1">Validation Errors Log:</span>
                      {summary.errors.map((err, idx) => (
                        <p key={idx} className="text-rose-700 font-mono text-[11px]">{err}</p>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <a
                      href="/students"
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>View Imported Students in Directory</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 space-y-2 shadow-2xs">
                  <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">Awaiting Dataset Input</h4>
                  <p className="text-xs text-slate-500">Paste your CSV content on the left or click "Load Sample CSV" to test bulk importing.</p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default CSVImportPage;
