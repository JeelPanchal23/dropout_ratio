import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  LifeBuoy, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  BarChart3,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'Faculty';

  const navItems = [
    { label: 'Faculty Command Center', path: '/admin/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Faculty'] },
    { label: 'Student Directory', path: '/admin/students', icon: Users, roles: ['Admin', 'Faculty'] },
    { label: 'Prediction Studio', path: '/predict', icon: BrainCircuit, roles: ['Admin', 'Faculty'] },
    { label: 'Interventions', path: '/interventions', icon: LifeBuoy, roles: ['Admin', 'Faculty'] },
    { label: 'Bulk CSV Import', path: '/csv-import', icon: FileSpreadsheet, roles: ['Admin'] },
    { label: 'System Reports', path: '/reports', icon: FileText, roles: ['Admin', 'Faculty'] },
    { label: 'Audit Logs', path: '/audit-logs', icon: ShieldAlert, roles: ['Admin', 'Faculty'] },
    { label: 'Privacy & Security', path: '/privacy', icon: Lock, roles: ['Admin', 'Faculty', 'Student'] },
    { label: 'My Student Portal', path: '/student/dashboard', icon: UserCheck, roles: ['Student'] }
  ];

  const allowedItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex text-slate-300">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Navigation</p>
          <nav className="space-y-1">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* SDG 4 Alignment Badge */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950 text-white border border-slate-800 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-extrabold text-[10px] uppercase tracking-wider border border-brand-500/30">SDG 4 Aligned</span>
            <h4 className="text-xs font-bold mt-2">Quality Education</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">Empowering student retention through explainable decision support.</p>
          </div>
        </div>
      </div>

      {/* User Profile Card Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
          {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
        </div>
        <div className="overflow-hidden text-xs">
          <p className="font-bold text-white truncate">{user?.name || 'User'}</p>
          <p className="text-[11px] text-slate-400 truncate">{user?.role || 'User'}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
