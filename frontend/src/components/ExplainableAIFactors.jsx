import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowDownRight, Info } from 'lucide-react';

const ExplainableAIFactors = ({ factors = [] }) => {
  if (!factors || factors.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
        No specific elevated risk drivers detected for this student record.
      </div>
    );
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return { bar: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700 border-rose-200', percent: '85%' };
      case 'Medium':
        return { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 border-amber-200', percent: '55%' };
      default:
        return { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', percent: '25%' };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-brand-600" />
          <span>Why is this student at risk? (XAI Factors)</span>
        </h4>
        <span className="text-[11px] text-slate-400">Ranked by feature impact</span>
      </div>

      <div className="space-y-2.5">
        {factors.map((item, index) => {
          const style = getImpactColor(item.impact);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.2 }}
              className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900">{item.factor}</span>
                  {item.value && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
                      {item.value}
                    </span>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${style.badge}`}>
                  {item.impact} Impact
                </span>
              </div>

              {/* Progress Impact Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
                <motion.div
                  className={`h-full rounded-full ${style.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: style.percent }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-500 leading-snug flex items-center space-x-1">
                  <Info className="w-3 h-3 text-slate-400 shrink-0 inline mr-1" />
                  <span>{item.description}</span>
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplainableAIFactors;
