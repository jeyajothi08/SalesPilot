import React from 'react';
import { motion } from 'framer-motion';

export default function KPIWidget({ title, value, prefix = "", suffix = "", trend, trendLabel, icon }) {
  const isPositive = trend >= 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            {icon}
         </div>
         <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            <svg className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {Math.abs(trend)}%
         </div>
      </div>
      
      <div>
         <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
         <div className="text-3xl font-bold text-white tracking-tight">
            {prefix}{typeof value === 'number' && prefix === '$' ? value.toLocaleString() : value}{suffix}
         </div>
         <div className="text-xs text-gray-500 mt-2">{trendLabel}</div>
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
    </motion.div>
  );
}
