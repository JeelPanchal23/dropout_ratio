import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RiskBadge from '../components/RiskBadge';
import RiskScoreMeter from '../components/RiskScoreMeter';
import ExplainableAIFactors from '../components/ExplainableAIFactors';
import InterventionTimeline from '../components/InterventionTimeline';
import { studentAPI, predictionAPI, interventionAPI } from '../services/api';
import { 
  ArrowLeft, BrainCircuit, BookOpen, Clock, Award, CheckCircle2, 
  AlertTriangle, Sparkles, User, GraduationCap, FileText, Calendar, 
  Layers, Download, Activity, HeartHandshake, FileCheck, Shield
} from 'lucide-react';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repredicting, setRepredicting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.getStudentById(id);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPrediction = async () => {
    if (!data?.student) return;
    try {
      setRepredicting(true);
      await predictionAPI.createPrediction({ studentId: data.student.studentId });
      await fetchStudentProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Prediction failed.');
    } finally {
      setRepredicting(false);
    }
  };

  const handleStatusUpdate = async (interventionId, newStatus) => {
    try {
      await interventionAPI.updateIntervention(interventionId, { 
        status: newStatus,
        outcome: newStatus === 'Completed' ? 'Student attendance & assignment submission improved following counseling.' : 'Mentorship active.' 
      });
      fetchStudentProfile();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-slate-400">Loading student 360° profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { student, predictions, interventions } = data;
  const latestPrediction = predictions && predictions.length > 0 ? predictions[0] : null;

  const currentCpi = student.academicRecords?.currentCpi ?? student.currentGpa;
  const currentSpi = student.academicRecords?.currentSpi ?? student.previousGpa;
  const overallAtt = student.attendanceRecords?.overallAttendance ?? student.attendance;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'personal', label: 'Personal Information' },
    { id: 'academic', label: 'Academic' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'learning', label: 'Learning Behavior' },
    { id: 'ai-risk', label: 'AI Risk' },
    { id: 'interventions', label: 'Interventions' },
    { id: 'documents', label: 'CV / Resume' },
    { id: 'certificates', label: 'Certificates' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Top Navigation */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <button
              onClick={() => navigate('/students')}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-brand-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Student Directory</span>
            </button>

            <button
              onClick={handleRunPrediction}
              disabled={repredicting}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>{repredicting ? 'AI Analyzing...' : 'Run AI Risk Analysis'}</span>
            </button>
          </div>

          {/* Student Profile Header Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                {student.name ? student.name.split(' ').map(n => n[0]).join('') : 'ST'}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-extrabold text-white">{student.name}</h1>
                  <RiskBadge level={student.riskLevel} score={student.riskScore} />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ID: <span className="font-mono font-bold text-brand-400">{student.studentId}</span> • {student.department} • Semester {student.semester || 1}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800/80 text-xs">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500">CPI</span>
                <p className="text-base font-extrabold text-brand-300 font-mono">{currentCpi !== null && currentCpi !== undefined ? Number(currentCpi).toFixed(2) : '--'}</p>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500">Attendance</span>
                <p className="text-base font-extrabold text-emerald-400 font-mono">{overallAtt !== null && overallAtt !== undefined ? `${overallAtt}%` : '--'}</p>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] font-bold uppercase text-slate-500">Risk Score</span>
                <p className="text-base font-extrabold text-rose-400 font-mono">{student.riskScore !== undefined ? `${student.riskScore}%` : 'Pending'}</p>
              </div>
            </div>
          </div>

          {/* Organized Tabs Bar (Requirement 19) */}
          <div className="flex space-x-2 border-b border-slate-800 overflow-x-auto pb-2 text-xs scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <h3 className="text-sm font-bold text-white">AI Risk Assessment</h3>
                  <div className="py-2 flex justify-center">
                    <RiskScoreMeter
                      score={latestPrediction?.riskScore ?? student.riskScore ?? 0}
                      level={latestPrediction?.riskLevel ?? student.riskLevel ?? 'Pending'}
                      confidence={latestPrediction?.confidence ?? 88}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <h3 className="text-sm font-bold text-white">Academic Key Performance Indicators</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-slate-400">Current CPI</span>
                      <p className="text-sm font-extrabold text-white font-mono">{currentCpi !== null && currentCpi !== undefined ? Number(currentCpi).toFixed(2) : '--'}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-slate-400">Current SPI</span>
                      <p className="text-sm font-extrabold text-white font-mono">{currentSpi !== null && currentSpi !== undefined ? Number(currentSpi).toFixed(2) : '--'}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-slate-400">Attendance</span>
                      <p className="text-sm font-extrabold text-emerald-400 font-mono">{overallAtt !== null && overallAtt !== undefined ? `${overallAtt}%` : '--'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><span className="text-slate-500">Full Name:</span> <strong className="text-white ml-2">{student.name}</strong></div>
                <div><span className="text-slate-500">Student ID:</span> <strong className="text-brand-400 font-mono ml-2">{student.studentId}</strong></div>
                <div><span className="text-slate-500">Email:</span> <strong className="text-white ml-2">{student.email}</strong></div>
                <div><span className="text-slate-500">Phone:</span> <strong className="text-white ml-2">{student.phone || 'Not provided'}</strong></div>
                <div><span className="text-slate-500">Department:</span> <strong className="text-white ml-2">{student.department}</strong></div>
                <div><span className="text-slate-500">Semester:</span> <strong className="text-white ml-2">Semester {student.semester || 1}</strong></div>
                <div><span className="text-slate-500">College / Institution:</span> <strong className="text-white ml-2">{student.college || 'Not provided'}</strong></div>
              </div>
            </div>
          )}

          {/* TAB: ACADEMIC */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Semester 1 to 8 Academic Record</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {Array.from({ length: 8 }, (_, i) => {
                    const match = (student.academicRecords?.semesterRecords || []).find(s => s.semester === i + 1);
                    return (
                      <div key={i + 1} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                        <span className="font-bold text-slate-300">Semester {i + 1}</span>
                        <p className="text-slate-400">SPI: <strong className="text-brand-300 font-mono">{match && match.spi !== null ? Number(match.spi).toFixed(2) : '--'}</strong></p>
                        <p className="text-slate-400">CPI: <strong className="text-indigo-300 font-mono">{match && match.cpi !== null ? Number(match.cpi).toFixed(2) : '--'}</strong></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Attendance Summary</h3>
              <p className="text-xs text-slate-400">
                Overall Attendance: <strong className="text-emerald-400 font-mono font-bold text-sm ml-1">{overallAtt !== null && overallAtt !== undefined ? `${overallAtt}%` : 'Not provided yet'}</strong>
              </p>
            </div>
          )}

          {/* TAB: LEARNING BEHAVIOR */}
          {activeTab === 'learning' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white">LMS & Learning Engagement Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">LMS Activity</span>
                  <p className="text-base font-extrabold text-white font-mono">{student.learningBehavior?.lmsActivity ?? '--'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Assignments Rate</span>
                  <p className="text-base font-extrabold text-white font-mono">{student.learningBehavior?.assignmentCompletion ?? '--'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Quiz Score</span>
                  <p className="text-base font-extrabold text-white font-mono">{student.learningBehavior?.quizScore ?? '--'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-500">Self Study Hours</span>
                  <p className="text-base font-extrabold text-white font-mono">{student.learningBehavior?.studyHours ?? '--'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI RISK */}
          {activeTab === 'ai-risk' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <ExplainableAIFactors
                  factors={latestPrediction?.riskFactors || [
                    { factor: 'Attendance Indicator', impact: overallAtt < 75 ? 'High' : 'Low', value: `${overallAtt}%`, description: 'Student attendance evaluation.' }
                  ]}
                />
              </div>
            </div>
          )}

          {/* TAB: INTERVENTIONS */}
          {activeTab === 'interventions' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Active Interventions</h3>
              {interventions && interventions.length > 0 ? (
                interventions.map((inv) => (
                  <InterventionTimeline key={inv._id || inv.id} intervention={inv} onStatusUpdate={handleStatusUpdate} />
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                  No active intervention workflows created for this student yet.
                </div>
              )}
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Student Uploaded CV & Documents</h3>
              {(!student.documents || student.documents.length === 0) ? (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                  No CV or document uploaded by student yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {student.documents.map((doc) => (
                    <div key={doc._id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="truncate text-xs">
                        <p className="font-bold text-white truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-slate-500">{(doc.fileSize / 1024).toFixed(1)} KB</p>
                      </div>
                      <a
                        href={`/api/students/${student.studentId}/documents/${doc._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                      >
                        View File
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Uploaded Certificates & Achievements</h3>
              {(!student.certificates || student.certificates.length === 0) ? (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                  No certificates uploaded by student yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {student.certificates.map((cert) => (
                    <div key={cert._id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <h4 className="font-bold text-white">{cert.title}</h4>
                      <p className="text-indigo-300">{cert.organization}</p>
                      <a
                        href={`/api/students/${student.studentId}/documents/${cert._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                      >
                        View Certificate
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default StudentProfile;
