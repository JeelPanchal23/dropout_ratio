import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InterventionTimeline from '../components/InterventionTimeline';
import { interventionAPI } from '../services/api';
import { LifeBuoy, Search, Filter, CheckCircle2, Clock } from 'lucide-react';

const InterventionsPage = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInterventions();
  }, [statusFilter, priorityFilter, search]);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter,
        priority: priorityFilter,
        search
      };
      const res = await interventionAPI.getInterventions(params);
      setInterventions(res.data || []);
    } catch (err) {
      console.error('Failed to load interventions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await interventionAPI.updateIntervention(id, {
        status: newStatus,
        outcome: newStatus === 'Completed' ? 'Student engagement and attendance metrics verified improved.' : 'Follow-up active.'
      });
      fetchInterventions();
    } catch (err) {
      console.error('Failed to update status:', err);
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
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personalized Intervention Management</h1>
            <p className="text-xs text-slate-500 font-medium">Track assigned mentor support workflows and student recovery outcomes</p>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, or intervention type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                />
              </div>

              {/* Status Tabs */}
              <div className="md:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div className="md:col-span-3">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

            </div>
          </div>

          {/* Interventions Timeline List Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold">Loading active intervention workflows...</p>
            </div>
          ) : interventions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interventions.map((inv) => (
                <InterventionTimeline
                  key={inv._id || inv.id}
                  intervention={inv}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 space-y-2">
              <LifeBuoy className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No Interventions Found</h4>
              <p className="text-xs text-slate-500">There are no interventions matching the selected filter criteria.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default InterventionsPage;
