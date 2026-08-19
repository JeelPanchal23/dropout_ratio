import React from 'react';
import { Brain, FilePlus, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

const InterventionTimeline = ({ intervention, onStatusUpdate }) => {
  if (!intervention) return null;

  const steps = [
    { key: 'Recommended', label: 'AI Risk Alert', icon: Brain, status: 'Completed' },
    { key: 'Assigned', label: 'Intervention Assigned', icon: FilePlus, status: ['Assigned', 'In Progress', 'Completed'].includes(intervention.status) ? 'Completed' : 'Pending' },
    { key: 'In Progress', label: 'Mentor Action', icon: UserCheck, status: ['In Progress', 'Completed'].includes(intervention.status) ? 'Completed' : 'Pending' },
    { key: 'Completed', label: 'Outcome Verified', icon: CheckCircle2, status: intervention.status === 'Completed' ? 'Completed' : 'Pending' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[11px] font-extrabold text-brand-600 uppercase tracking-wider">Intervention Workflow</span>
          <h4 className="text-sm font-bold text-slate-900">{intervention.type}</h4>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${intervention.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {intervention.status}
        </span>
      </div>

      {/* Stepper Bar */}
      <div className="relative flex items-center justify-between py-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-0"></div>
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isDone = st.status === 'Completed';
          return (
            <div key={st.key} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isDone ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-slate-200 text-slate-500'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-600 mt-1 text-center max-w-[80px]">
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Intervention Detail Card */}
      <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Reason:</span>
          <span className="font-semibold text-slate-800 text-right">{intervention.reason}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Assigned Mentor:</span>
          <span className="font-bold text-slate-900">{intervention.assignedTo}</span>
        </div>
        {intervention.notes && (
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-slate-500 block mb-0.5">Notes:</span>
            <p className="text-slate-700 italic">{intervention.notes}</p>
          </div>
        )}
        {intervention.outcome && (
          <div className="pt-2 border-t border-slate-200/60 text-emerald-800 font-medium">
            <span className="font-bold">Recorded Outcome:</span> {intervention.outcome}
          </div>
        )}
      </div>

      {/* Status Update Action Buttons */}
      {onStatusUpdate && (
        <div className="flex items-center space-x-2 pt-1">
          {intervention.status !== 'In Progress' && intervention.status !== 'Completed' && (
            <button
              onClick={() => onStatusUpdate(intervention._id || intervention.id, 'In Progress')}
              className="flex-1 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
            >
              Set In Progress
            </button>
          )}
          {intervention.status !== 'Completed' && (
            <button
              onClick={() => onStatusUpdate(intervention._id || intervention.id, 'Completed')}
              className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              Mark Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InterventionTimeline;
