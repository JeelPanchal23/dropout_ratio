import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StudentTable from '../components/StudentTable';
import { studentAPI, interventionAPI } from '../services/api';
import { Search, Filter, RefreshCw, PlusCircle, X, CheckCircle2 } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [semester, setSemester] = useState('All');
  const [riskLevel, setRiskLevel] = useState('All');
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Intervention Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionType, setInterventionType] = useState('Attendance Counseling');
  const [reason, setReason] = useState('');
  const [assignedTo, setAssignedTo] = useState('Dr. Sarah Jenkins');
  const [priority, setPriority] = useState('Medium');
  const [modalSuccess, setModalSuccess] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [search, department, semester, riskLevel, sortBy, sortOrder, page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        department: department === 'All' ? '' : department,
        semester: semester === 'All' ? '' : semester,
        riskLevel: riskLevel === 'All' ? '' : riskLevel,
        sortBy,
        sortOrder,
        page,
        limit: 15
      };
      const res = await studentAPI.getStudents(params);
      setStudents(res.data.students || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleOpenInterventionModal = (student) => {
    setSelectedStudent(student);
    setReason(`Attendance at ${student.attendance}% and GPA ${student.currentGpa}`);
    setModalSuccess(false);
  };

  const handleCreateIntervention = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await interventionAPI.createIntervention({
        studentId: selectedStudent.studentId,
        type: interventionType,
        reason,
        assignedTo,
        priority
      });
      setModalSuccess(true);
      setTimeout(() => {
        setSelectedStudent(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to create intervention:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-2 border-b border-slate-200/80">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Directory & Risk Repository</h1>
              <p className="text-xs text-slate-500 font-medium">Search, filter, and review 360° student academic indicators</p>
            </div>

            <button
              onClick={fetchStudents}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-all"
            >
              <RefreshCw className="w-4 h-4 text-brand-600" />
              <span>Refresh Records</span>
            </button>
          </div>

          {/* Filter & Search Bar Controls */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, or department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Department Filter */}
              <div className="md:col-span-3">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              {/* Semester Filter */}
              <div className="md:col-span-2">
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              {/* Risk Level Filter */}
              <div className="md:col-span-2">
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>

            </div>
          </div>

          {/* Student Table */}
          <StudentTable
            students={students}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onAddIntervention={handleOpenInterventionModal}
          />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">Page {page} of {totalPages}</span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-50 text-xs font-bold border border-slate-200 text-slate-700"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-50 text-xs font-bold border border-slate-200 text-slate-700"
              >
                Next
              </button>
            </div>
          </div>

        </main>
      </div>

      {/* Add Intervention Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Assign Personalized Intervention</h3>
                <p className="text-xs text-slate-500">{selectedStudent.name} ({selectedStudent.studentId})</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900">Intervention Successfully Assigned!</h4>
                <p className="text-xs text-slate-500">Mentor has been notified for follow-up evaluation.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateIntervention} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Intervention Type</label>
                  <select
                    value={interventionType}
                    onChange={(e) => setInterventionType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Attendance Counseling">Attendance Counseling & Schedule Planning</option>
                    <option value="Academic Peer Tutoring">Academic Peer Tutoring & Subject Support</option>
                    <option value="Assignment Milestones">Assignment Completion Milestone Workshop</option>
                    <option value="LMS Study Group">LMS Study Group Assignment</option>
                    <option value="Financial Counseling">Scholarship & Financial Aid Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason / Trigger Factor</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Mentor</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold shadow-md"
                  >
                    Assign Intervention
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentManagement;
