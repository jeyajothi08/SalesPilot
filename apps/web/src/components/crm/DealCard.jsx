import React from 'react';
import { motion } from 'framer-motion';

export default function DealCard({ deal, onDragStart, onClick }) {
  // Color coding based on probability
  const getProbabilityColor = (prob) => {
    if (prob >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
    if (prob >= 50) return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-500/20';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={() => onClick && onClick(deal)}
      className="p-4 mb-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer hover:bg-white/10 hover:border-blue-500/40 transition-all shadow-lg group"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-white text-sm truncate pr-2 group-hover:text-blue-300 transition-colors">{deal.title}</h4>
        <div className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getProbabilityColor(deal.probability)}`}>
          {deal.probability}%
        </div>
      </div>
      
      <div className="text-gray-400 text-xs mb-3 truncate flex items-center justify-between">
        <span>{deal.company}</span>
        {deal.contact && <span className="text-[10px] text-gray-500">{deal.contact}</span>}
      </div>
      
      <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/10">
        <span className="text-gray-500 text-xs flex items-center gap-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {deal.closingDate || 'Closing soon'}
        </span>
        <span className="font-bold text-white text-sm font-mono">
          ${(Number(deal.value) || 0).toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}
