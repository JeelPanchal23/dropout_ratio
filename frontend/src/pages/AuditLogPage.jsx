import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { auditAPI } from '../services/api';
import { Shield, RefreshCw, Clock, User, Activity } from 'lucide-react';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditAPI.getAuditLogs({ limit: 50 });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-brand-400" />
                <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">Security & Privacy Audit</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">Institutional Audit Log</h1>
            </div>

            <button
              onClick={fetchLogs}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
              title="Refresh Audit Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-brand-400 mx-auto" />
              <p className="text-xs font-semibold">Loading security audit records...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              No audit log entries recorded yet.
            </div>
          ) : (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-4">Action</th>
                      <th className="py-3.5 px-4">Target</th>
                      <th className="py-3.5 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {log.user?.name} ({log.user?.role})
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 font-mono font-bold text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {log.target || '--'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AuditLogPage;
