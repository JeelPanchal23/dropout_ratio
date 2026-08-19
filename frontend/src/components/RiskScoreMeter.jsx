import React from 'react';
import { motion } from 'framer-motion';

const RiskScoreMeter = ({ score = 20, level = 'Low', confidence = 89, size = 160 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10B981'; // Green
  if (score >= 70) strokeColor = '#EF4444'; // Red
  else if (score >= 40) strokeColor = '#F59E0B'; // Amber

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Indicator Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{score}%</span>
          <span className={`text-[11px] font-extrabold uppercase tracking-wider ${score >= 70 ? 'text-rose-600' : (score >= 40 ? 'text-amber-600' : 'text-emerald-600')}`}>
            {level} Risk
          </span>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 font-medium mt-2">Model Confidence: <strong>{confidence}%</strong></p>
    </div>
  );
};

export default RiskScoreMeter;
