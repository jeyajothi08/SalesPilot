import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const SmartSuggestionCard = ({ icon, title, description, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-ds-accent/50 rounded-xl transition-colors text-left"
    >
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded-lg bg-ds-surface border border-white/10 flex items-center justify-center text-ds-text-secondary group-hover:text-ds-accent transition-colors">
            {icon}
         </div>
         <div>
            <h4 className="text-xs font-bold text-ds-text-primary">{title}</h4>
            <p className="text-[10px] text-ds-text-tertiary">{description}</p>
         </div>
      </div>
      <ArrowRight className="w-4 h-4 text-ds-text-tertiary group-hover:text-ds-accent transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300" />
    </motion.button>
  );
};
