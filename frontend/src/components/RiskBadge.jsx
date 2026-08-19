import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

const RiskBadge = ({ level = 'Low', score, showIcon = true, size = 'md' }) => {
  let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  let Icon = CheckCircle2;

  if (level === 'High') {
    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200/80 font-bold';
    Icon = AlertCircle;
  } else if (level === 'Medium') {
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200/80 font-semibold';
    Icon = AlertTriangle;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : (size === 'lg' ? 'px-3.5 py-1.5 text-xs' : 'px-2.5 py-1 text-xs');

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border shadow-2xs font-semibold ${badgeStyle} ${sizeClass}`}>
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{level} Risk</span>
      {score !== undefined && <span className="opacity-75">({score}%)</span>}
    </span>
  );
};

export default RiskBadge;
