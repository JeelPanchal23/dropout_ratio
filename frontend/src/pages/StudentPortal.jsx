import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, BookOpen, Calendar, FileText, Award, AlertCircle, 
  Upload, Trash2, Download, Plus, CheckCircle2, TrendingUp, 
  HelpCircle, User, Activity, RefreshCw, Layers, Shield, FileCheck, HeartHandshake
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { studentAPI, predictionAPI, interventionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StudentPortal = () => {
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview'); // overview, academic, attendance, documents, certificates, ai-report, interventions

  // Edit / Form states
  const [isUpdatingAcademic, setIsUpdatingAcademic] = useState(false);
  const [academicForm, setAcademicForm] = useState({
    currentSemester: 1,
    currentCpi: '',
    currentSpi: '',
    overallCgpa: '',
    backlogCount: 0,
    failedSubjects: 0
  });

  const [semRecords, setSemRecords] = useState(
    Array.from({ length: 8 }, (_, i) => ({ semester: i + 1, spi: '', cpi: '' }))
  );

  const [attendanceForm, setAttendanceForm] = useState({
    overallAttendance: '',
    attendanceTrend: 0
  });

  // Modal Upload states
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [certMeta, setCertMeta] = useState({ title: '', organization: '', issueDate: '', description: '' });

  // AI Prediction State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiScanStep, setAiScanStep] = useState(0);
  const [aiReport, setAiReport] = useState(null);
  const [aiError, setAiError] = useState('');

  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getMeStudent();
      const st = res.data.student;
      
      const activeStudent = st || {
        name: user?.name || 'Student',
        studentId: user?.studentId || 'STU-RECORD',
        email: user?.email || '',
        department: user?.department || 'Computer Engineering',
        semester: 1,
        academicRecords: { currentCpi: null, currentSpi: null, overallCgpa: null, semesterRecords: [], backlogCount: 0, failedSubjects: 0 },
        attendanceRecords: { overallAttendance: null, attendanceTrend: 0 },
        documents: [],
        certificates: [],
        riskLevel: 'Pending',
        riskScore: 0
      };

      setStudent(activeStudent);
      setPredictions(res.data.predictions || []);
      setInterventions(res.data.interventions || []);

      setAcademicForm({
        currentSemester: activeStudent.semester || 1,
        currentCpi: activeStudent.academicRecords?.currentCpi ?? '',
        currentSpi: activeStudent.academicRecords?.currentSpi ?? '',
        overallCgpa: activeStudent.academicRecords?.overallCgpa ?? '',
        backlogCount: activeStudent.academicRecords?.backlogCount ?? 0,
        failedSubjects: activeStudent.academicRecords?.failedSubjects ?? 0
      });

      const existingSems = activeStudent.academicRecords?.semesterRecords || [];
      const semArr = Array.from({ length: 8 }, (_, i) => {
        const match = existingSems.find(s => s.semester === i + 1);
        return {
          semester: i + 1,
          spi: match && match.spi !== null ? match.spi : '',
          cpi: match && match.cpi !== null ? match.cpi : ''
        };
      });
      setSemRecords(semArr);

      setAttendanceForm({
        overallAttendance: activeStudent.attendanceRecords?.overallAttendance ?? '',
        attendanceTrend: activeStudent.attendanceRecords?.attendanceTrend ?? 0
      });
    } catch (err) {
      console.error('Failed to fetch student profile:', err);
      const fallbackStudent = {
        name: user?.name || 'Student',
        studentId: user?.studentId || 'STU-RECORD',
        email: user?.email || '',
        department: user?.department || 'Computer Engineering',
        semester: 1,
        academicRecords: { currentCpi: null, currentSpi: null, overallCgpa: null, semesterRecords: [], backlogCount: 0, failedSubjects: 0 },
        attendanceRecords: { overallAttendance: null, attendanceTrend: 0 },
        documents: [],
        certificates: [],
        riskLevel: 'Pending',
        riskScore: 0
      };
      setStudent(fallbackStudent);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStudentProfile();
  }, []);

  // Save Academic Records
  const handleSaveAcademic = async (e) => {
    e.preventDefault();
    if (!student) return;

    const formattedSemRecords = semRecords.map(s => ({
      semester: s.semester,
      spi: s.spi !== '' ? Number(s.spi) : null,
      cpi: s.cpi !== '' ? Number(s.cpi) : null
    }));

    const updates = {
      semester: Number(academicForm.currentSemester),
      academicRecords: {
        currentSemester: Number(academicForm.currentSemester),
        currentCpi: academicForm.currentCpi !== '' ? Number(academicForm.currentCpi) : null,
        currentSpi: academicForm.currentSpi !== '' ? Number(academicForm.currentSpi) : null,
        overallCgpa: academicForm.overallCgpa !== '' ? Number(academicForm.overallCgpa) : null,
        semesterRecords: formattedSemRecords,
        backlogCount: Number(academicForm.backlogCount),
        failedSubjects: Number(academicForm.failedSubjects)
      }
    };

    try {
      await studentAPI.updateStudent(student.studentId, updates);
      await fetchStudentProfile();
      setIsUpdatingAcademic(false);
    } catch (err) {
      alert('Error updating academic profile.');
    }
  };

  // Save Attendance Records
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!student) return;

    const updates = {
      attendanceRecords: {
        overallAttendance: attendanceForm.overallAttendance !== '' ? Number(attendanceForm.overallAttendance) : null,
        attendanceTrend: Number(attendanceForm.attendanceTrend)
      }
    };

    try {
      await studentAPI.updateStudent(student.studentId, updates);
      await fetchStudentProfile();
      alert('Attendance updated successfully.');
    } catch (err) {
      alert('Error updating attendance.');
    }
  };

  // Upload Document (CV)
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFile || !student) return;

    const fd = new FormData();
    fd.append('file', docFile);
    fd.append('type', 'cv');

    try {
      await studentAPI.uploadDocument(student.studentId, fd);
      setDocFile(null);
      setDocModalOpen(false);
      await fetchStudentProfile();
    } catch (err) {
      alert('Document upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Upload Certificate
  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    if (!certFile || !student || !certMeta.title || !certMeta.organization) {
      alert('Please fill out Certificate Title, Organization, and select a file.');
      return;
    }

    const fd = new FormData();
    fd.append('file', certFile);
    fd.append('title', certMeta.title);
    fd.append('organization', certMeta.organization);
    fd.append('issueDate', certMeta.issueDate);
    fd.append('description', certMeta.description);

    try {
      await studentAPI.uploadCertificate(student.studentId, fd);
      setCertFile(null);
      setCertMeta({ title: '', organization: '', issueDate: '', description: '' });
      setCertModalOpen(false);
      await fetchStudentProfile();
    } catch (err) {
      alert('Certificate upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete File
  const handleDeleteFile = async (fileId, type) => {
    if (!student || !window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await studentAPI.deleteFile(student.studentId, fileId, type);
      await fetchStudentProfile();
    } catch (err) {
      alert('Error deleting file.');
    }
  };

  // Run AI Analysis Simulation loading state then real API response
  const handleRunAiAnalysis = async () => {
    if (!student) return;
    setAiAnalyzing(true);
    setAiScanStep(0);
    setAiError('');
    setAiReport(null);

    const steps = [
      "Scanning Academic Data...",
      "Analyzing Attendance & Engagement...",
      "Generating Risk Factors...",
      "Creating Personalized Recommendations..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setAiScanStep(i);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const res = await predictionAPI.createPrediction({ studentId: student.studentId });
      setAiReport(res.data);
    } catch (err) {
      setAiError(err.response?.data?.message || "Not enough data available for AI prediction.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-400" />
          <span className="text-sm font-semibold">Loading Student Portal...</span>
        </div>
      </div>
    );
  }

  const overallAtt = student?.attendanceRecords?.overallAttendance;
  const currentCpi = student?.academicRecords?.currentCpi;
  const currentSpi = student?.academicRecords?.currentSpi;
  const overallCgpa = student?.academicRecords?.overallCgpa;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Welcome Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900/80 via-slate-900 to-indigo-900/80 border border-brand-500/20 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Student Success Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome, {student?.name || user?.name || 'Student'}!
                </h1>
                <p className="text-xs text-slate-400">
                  {student?.department} • Semester {student?.semester || 1} • ID: {student?.studentId}
                </p>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={aiAnalyzing}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 self-start sm:self-auto"
              >
                <Activity className="w-4 h-4" />
                <span>{aiAnalyzing ? 'Analyzing Data...' : 'Generate AI Student Report'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Overall CPI</span>
              <p className="text-2xl font-extrabold text-brand-400 font-mono">
                {currentCpi !== null && currentCpi !== undefined ? Number(currentCpi).toFixed(2) : '--'}
              </p>
              <p className="text-[10px] text-slate-500">Academic CPI</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Current SPI</span>
              <p className="text-2xl font-extrabold text-indigo-400 font-mono">
                {currentSpi !== null && currentSpi !== undefined ? Number(currentSpi).toFixed(2) : '--'}
              </p>
              <p className="text-[10px] text-slate-500">Current Semester SPI</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Attendance Rate</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                {overallAtt !== null && overallAtt !== undefined ? `${overallAtt}%` : '--'}
              </p>
              <p className="text-[10px] text-slate-500">Overall Attendance</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">AI Risk Level</span>
              <p className={`text-2xl font-extrabold font-mono ${
                student?.riskLevel === 'High' ? 'text-rose-400' :
                student?.riskLevel === 'Medium' ? 'text-amber-400' :
                student?.riskLevel === 'Low' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {student?.riskLevel || 'Pending'}
              </p>
              <p className="text-[10px] text-slate-500">Decision-support status</p>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex space-x-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none text-xs">
            {[
              { id: 'overview', label: 'Overview & Timeline', icon: Layers },
              { id: 'attendance', label: 'Attendance Management', icon: Calendar },
              { id: 'documents', label: 'My Documents', icon: FileText },
              { id: 'certificates', label: 'Certificates & Achievements', icon: Award },
              { id: 'ai-report', label: 'AI Student Report', icon: Sparkles },
              { id: 'interventions', label: 'My Interventions', icon: HeartHandshake }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & SEMESTER-WISE TIMELINE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Semester-Wise Academic Timeline</h3>
                  <p className="text-xs text-slate-400">Track your semester SPI and CPI history</p>
                </div>
                <button
                  onClick={() => setIsUpdatingAcademic(!isUpdatingAcademic)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
                >
                  {isUpdatingAcademic ? 'Cancel Edit' : 'Edit Academic Record'}
                </button>
              </div>

              {/* Form Mode for Updating Academic Records */}
              {isUpdatingAcademic && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleSaveAcademic}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6"
                >
                  <h4 className="text-xs font-extrabold uppercase text-brand-400 tracking-wider">Update Academic Indicators</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Current Semester</label>
                      <select
                        value={academicForm.currentSemester}
                        onChange={e => setAcademicForm({...academicForm, currentSemester: e.target.value})}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      >
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Current CPI (0-10)</label>
                      <input
                        type="number" step="0.01" min="0" max="10"
                        value={academicForm.currentCpi}
                        onChange={e => setAcademicForm({...academicForm, currentCpi: e.target.value})}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        placeholder="e.g. 8.4"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Current SPI (0-10)</label>
                      <input
                        type="number" step="0.01" min="0" max="10"
                        value={academicForm.currentSpi}
                        onChange={e => setAcademicForm({...academicForm, currentSpi: e.target.value})}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        placeholder="e.g. 8.6"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Active Backlogs</label>
                      <input
                        type="number" min="0"
                        value={academicForm.backlogCount}
                        onChange={e => setAcademicForm({...academicForm, backlogCount: e.target.value})}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-300">Semester 1 to 8 SPI & CPI Breakdown</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {semRecords.map((sr, idx) => (
                        <div key={sr.semester} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                          <span className="font-bold text-slate-300">Sem {sr.semester}</span>
                          <div className="space-y-1">
                            <input
                              type="number" step="0.01" placeholder="SPI"
                              value={sr.spi}
                              onChange={e => {
                                const newArr = [...semRecords];
                                newArr[idx].spi = e.target.value;
                                setSemRecords(newArr);
                              }}
                              className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                            />
                            <input
                              type="number" step="0.01" placeholder="CPI"
                              value={sr.cpi}
                              onChange={e => {
                                const newArr = [...semRecords];
                                newArr[idx].cpi = e.target.value;
                                setSemRecords(newArr);
                              }}
                              className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
                  >
                    Save Academic Record
                  </button>
                </motion.form>
              )}

              {/* Semester Card Grid (Requirement 8) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {semRecords.map((sr) => {
                  const hasData = sr.spi !== '' || sr.cpi !== '';
                  return (
                    <div
                      key={sr.semester}
                      className={`p-4 rounded-2xl border transition-all ${
                        hasData
                          ? 'bg-slate-900/90 border-slate-800 shadow-md'
                          : 'bg-slate-950/40 border-slate-900 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300">Semester {sr.semester}</span>
                        {hasData ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">Recorded</span>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-medium">Not provided yet</span>
                        )}
                      </div>
                      <div className="space-y-1 text-xs font-mono">
                        <p><span className="text-slate-500 text-[10px]">SPI:</span> <span className={sr.spi !== '' ? 'text-brand-300 font-bold' : 'text-slate-600'}>{sr.spi !== '' ? Number(sr.spi).toFixed(2) : '--'}</span></p>
                        <p><span className="text-slate-500 text-[10px]">CPI:</span> <span className={sr.cpi !== '' ? 'text-indigo-300 font-bold' : 'text-slate-600'}>{sr.cpi !== '' ? Number(sr.cpi).toFixed(2) : '--'}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ATTENDANCE MANAGEMENT */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white">Update Attendance Records</h3>
                <form onSubmit={handleSaveAttendance} className="flex flex-col sm:flex-row items-end gap-4 text-xs">
                  <div className="w-full sm:w-64">
                    <label className="block font-bold text-slate-300 mb-1">Overall Attendance (%)</label>
                    <input
                      type="number" min="0" max="100" step="0.1"
                      placeholder="e.g. 85"
                      value={attendanceForm.overallAttendance}
                      onChange={e => setAttendanceForm({...attendanceForm, overallAttendance: e.target.value})}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                  >
                    Save Attendance
                  </button>
                </form>
              </div>

              {overallAtt === null || overallAtt === undefined ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">No Attendance Data Recorded</h4>
                  <p className="text-xs text-slate-500">Enter your overall attendance percentage above to visualize participation trends.</p>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Attendance Summary Indicator</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${overallAtt >= 75 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {overallAtt >= 75 ? 'Satisfactory Attendance (≥75%)' : 'Attendance Warning (<75%)'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${overallAtt >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, Math.max(0, overallAtt))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY DOCUMENTS (CV / RESUME) */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">My Uploaded Documents</h3>
                  <p className="text-xs text-slate-400">Manage your CV, resume, and academic attachments</p>
                </div>
                <button
                  onClick={() => setDocModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Document / CV</span>
                </button>
              </div>

              {(!student?.documents || student.documents.length === 0) ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">No Documents Uploaded Yet</h4>
                  <p className="text-xs text-slate-500">Upload your CV or resume in PDF, DOC, or DOCX format.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {student.documents.map((doc) => (
                    <div key={doc._id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{doc.fileName}</h4>
                          <p className="text-[10px] text-slate-500">{(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href={`/api/students/${student.studentId}/documents/${doc._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="View / Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(doc._id, 'document')}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CERTIFICATES & ACHIEVEMENTS */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Certificates & Achievements</h3>
                  <p className="text-xs text-slate-400">Optional portfolio of co-curricular achievements</p>
                </div>
                <button
                  onClick={() => setCertModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Upload Certificate</span>
                </button>
              </div>

              {(!student?.certificates || student.certificates.length === 0) ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <Award className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">No certificates uploaded yet.</h4>
                  <p className="text-xs text-slate-500">Adding certificates is optional and helps mentors recommend advanced learning tracks.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {student.certificates.map((cert) => (
                    <div key={cert._id} className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Award className="w-5 h-5" />
                          </span>
                          <span className="text-[10px] text-slate-500">{cert.issueDate || '2026'}</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white line-clamp-1">{cert.title}</h4>
                        <p className="text-xs text-indigo-300 font-medium">{cert.organization}</p>
                        {cert.description && <p className="text-[11px] text-slate-400 line-clamp-2">{cert.description}</p>}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <a
                          href={`/api/students/${student.studentId}/documents/${cert._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </a>
                        <button
                          onClick={() => handleDeleteFile(cert._id, 'certificate')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI STUDENT REPORT */}
          {activeTab === 'ai-report' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">AI-Generated Academic Report</h3>
                  <p className="text-xs text-slate-400">Comprehensive risk analysis and support recommendations based on actual submitted data</p>
                </div>
                <button
                  onClick={handleRunAiAnalysis}
                  disabled={aiAnalyzing}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 text-white text-xs font-bold shadow-lg flex items-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>{aiAnalyzing ? 'Analyzing Data...' : 'Run AI Analysis'}</span>
                </button>
              </div>

              {aiAnalyzing && (
                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
                  <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-brand-300">
                    {[
                      "Scanning Academic Data...",
                      "Analyzing Attendance...",
                      "Generating Risk Factors...",
                      "Creating Personalized Recommendations..."
                    ][aiScanStep]}
                  </p>
                </div>
              )}

              {aiError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {aiError}
                </div>
              )}

              {aiReport && (
                <div className="space-y-6">
                  {/* Completeness Bar */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-300">Data Completeness Score</span>
                      <span className="text-brand-400">{aiReport.completeness?.percentage || 85}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-brand-500 h-full" style={{ width: `${aiReport.completeness?.percentage || 85}%` }} />
                    </div>
                  </div>

                  {/* Explainable AI Risk Factors */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white">Why did AI identify this risk score?</h4>
                    <div className="space-y-3 text-xs">
                      {aiReport.riskFactors?.map((rf, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between">
                          <div>
                            <span className="font-bold text-slate-200">{rf.factor}</span>
                            <p className="text-slate-400 text-[11px] mt-0.5">{rf.description}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            rf.impact === 'High' ? 'bg-rose-500/10 text-rose-400' :
                            rf.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {rf.impact} Impact
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Positive Indicators */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-emerald-400">Positive Academic Indicators</h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {aiReport.positiveIndicators?.map((pi, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{pi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-brand-400">Personalized Support Recommendations</h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {aiReport.recommendations?.map((rec, idx) => (
                        <li key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Responsible AI Disclaimer */}
                  <p className="text-[11px] text-slate-500 italic px-2">
                    {aiReport.disclaimer}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MY INTERVENTIONS */}
          {activeTab === 'interventions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Assigned Support & Interventions</h3>
                <p className="text-xs text-slate-400">Academic guidance plans assigned by your faculty advisor</p>
              </div>

              {interventions.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <HeartHandshake className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">No Active Interventions Required</h4>
                  <p className="text-xs text-slate-500">You currently have no assigned academic support plans.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interventions.map((inv) => (
                    <div key={inv._id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white">{inv.type}</span>
                        <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 font-bold text-[10px]">
                          Status: {inv.status}
                        </span>
                      </div>
                      <p className="text-slate-400">{inv.reason}</p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Assigned Mentor: {inv.assignedTo}</span>
                        <span>Due Date: {new Date(inv.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Upload Document Modal */}
      {docModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Upload CV / Resume</h3>
            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select File (PDF, DOC, DOCX - Max 10MB)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setDocFile(e.target.files[0])}
                  className="w-full text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-600 file:text-white file:font-bold"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold shadow-md"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Upload Certificate & Achievement</h3>
            <form onSubmit={handleUploadCertificate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Certificate Title *</label>
                <input
                  type="text" placeholder="e.g. Web Development Professional"
                  value={certMeta.title}
                  onChange={e => setCertMeta({...certMeta, title: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Issuing Organization *</label>
                <input
                  type="text" placeholder="e.g. Google / Coursera"
                  value={certMeta.organization}
                  onChange={e => setCertMeta({...certMeta, organization: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Issue Date</label>
                <input
                  type="text" placeholder="e.g. 2026"
                  value={certMeta.issueDate}
                  onChange={e => setCertMeta({...certMeta, issueDate: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Certificate File (PDF, JPG, PNG)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setCertFile(e.target.files[0])}
                  className="w-full text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white file:font-bold"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md"
                >
                  Upload Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentPortal;
