import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, subtext, icon: Icon, color = 'brand', trend }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between"
    >
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {subtext && <p className="text-xs text-slate-500 mt-1 font-medium">{subtext}</p>}
        {trend && (
          <span className={`inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded-md ${trend.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {trend.value}
          </span>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.brand}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
