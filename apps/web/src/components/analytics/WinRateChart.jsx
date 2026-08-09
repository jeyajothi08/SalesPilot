import React from 'react';
import { motion } from 'framer-motion';

export default function WinRateChart({ current, trend }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current / 100) * circumference;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col items-center justify-center relative">
       <h2 className="text-xl font-bold text-white mb-6 self-start w-full">Win Rate</h2>
       
       <div className="relative flex items-center justify-center">
          {/* Background Circle */}
          <svg className="w-40 h-40 transform -rotate-90">
             <circle 
                cx="80" 
                cy="80" 
                r={radius} 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="12" 
                fill="none" 
             />
             {/* Progress Circle */}
             <motion.circle 
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="80" 
                cy="80" 
                r={radius} 
                stroke="#10b981" 
                strokeWidth="12" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray={circumference}
             />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-3xl font-bold text-white">{current}%</span>
             <span className="text-xs text-emerald-400 mt-1">+{trend}% YoY</span>
          </div>
       </div>

       <div className="mt-8 text-center text-sm text-gray-400">
          AI automation has improved close rates by <span className="text-white font-medium">14%</span> this quarter.
       </div>
    </div>
  );
}
