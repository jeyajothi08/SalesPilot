import React from 'react';
import { motion } from 'framer-motion';

export const Loader = ({ type = 'spinner', size = 'md', className = '' }) => {
  
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const currentSize = sizeMap[size];

  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse bg-ds-border rounded-xl ${className}`}></div>
    );
  }

  if (type === 'pulse') {
    return (
      <span className={`relative flex ${currentSize} ${className}`}>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ds-accent opacity-75"></span>
        <span className="relative inline-flex rounded-full h-full w-full bg-ds-accent"></span>
      </span>
    );
  }

  // Default Spinner (Apple style)
  return (
    <div className={`relative ${currentSize} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-ds-border rounded-full"
      ></motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-transparent border-t-ds-accent rounded-full"
      ></motion.div>
    </div>
  );
};
