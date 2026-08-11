import React from 'react';
import { motion } from 'framer-motion';

export const Window = ({ 
  id, 
  title, 
  children, 
  onClose, 
  isActive, 
  onFocus,
}) => {
  if (!isActive) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute inset-0 w-full h-full flex flex-col bg-ds-surface/95 backdrop-blur-2xl overflow-hidden z-20"
      onClick={onFocus}
    >
      {/* Full Screen Window Content */}
      <div className="flex-1 w-full h-full overflow-auto custom-scrollbar bg-ds-background/50">
         {children}
      </div>
    </motion.div>
  );
};

