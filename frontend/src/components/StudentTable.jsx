import React from 'react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import { ChevronDown, ChevronUp, Eye, BrainCircuit, PlusCircle, FileText, Award } from 'lucide-react';

const StudentTable = ({
  students = [],
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  onAddIntervention
}) => {
  const navigate = useNavigate();

  const handleHeaderClick = (column) => {
    if (onSort) onSort(column);
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 inline ml-1" /> : <ChevronDown className="w-3.5 h-3.5 inline ml-1" />;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold">Loading student directory...</p>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
        <p className="text-sm font-bold text-slate-300">No student records found in MongoDB database.</p>
        <p className="text-xs text-slate-500">Register new students to build your institutional repository.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <th onClick={() => handleHeaderClick('studentId')} className="py-3.5 px-4 cursor-pointer hover:text-white">
                ID {renderSortIcon('studentId')}
              </th>
              <th onClick={() => handleHeaderClick('name')} className="py-3.5 px-4 cursor-pointer hover:text-white">
                Student Name {renderSortIcon('name')}
              </th>
              <th onClick={() => handleHeaderClick('department')} className="py-3.5 px-4 cursor-pointer hover:text-white">
                Department {renderSortIcon('department')}
              </th>
              <th onClick={() => handleHeaderClick('semester')} className="py-3.5 px-4 cursor-pointer hover:text-white text-center">
                Sem {renderSortIcon('semester')}
              </th>
              <th className="py-3.5 px-4 text-center">CPI / SPI</th>
              <th className="py-3.5 px-4 text-center">Attendance</th>
              <th className="py-3.5 px-4 text-center">Risk Score</th>
              <th className="py-3.5 px-4 text-center">Risk Level</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {students.map((st) => {
              const cpi = st.academicRecords?.currentCpi ?? st.currentGpa ?? null;
              const spi = st.academicRecords?.currentSpi ?? st.previousGpa ?? null;
              const att = st.attendanceRecords?.overallAttendance ?? st.attendance ?? null;

              return (
                <tr 
                  key={st.studentId || st._id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                    {st.studentId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-brand-300 transition-colors">
                      {st.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{st.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">
                    {st.department}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-300">
                    S{st.semester || 1}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span className="text-brand-300">{cpi !== null ? Number(cpi).toFixed(2) : '--'}</span>
                    <span className="text-slate-600 px-1">/</span>
                    <span className="text-indigo-300">{spi !== null ? Number(spi).toFixed(2) : '--'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`font-bold font-mono ${
                      att === null ? 'text-slate-600' :
                      att < 75 ? 'text-rose-400 font-extrabold' : 'text-emerald-400'
                    }`}>
                      {att !== null ? `${att}%` : '--'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-extrabold text-sm text-white font-mono">
                      {st.riskScore !== undefined ? `${st.riskScore}%` : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <RiskBadge level={st.riskLevel} score={st.riskScore} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => navigate(`/students/${st.studentId}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {onAddIntervention && (
                        <button
                          onClick={() => onAddIntervention(st)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all"
                          title="Assign Support Intervention"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
