import React from 'react';
import { motion } from 'framer-motion';

export const AIStateIndicator = ({ state = 'idle', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
  };
  
  const currentSize = sizeMap[size];

  if (state === 'thinking') {
    return (
      <div className={`relative ${currentSize} flex items-center justify-center`}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl"
        />
        <div className="grid grid-cols-3 gap-1 relative z-10">
           {[...Array(9)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 1 }}
               className="w-1.5 h-1.5 bg-purple-500 rounded-full"
             />
           ))}
        </div>
      </div>
    );
  }

  if (state === 'listening') {
    return (
      <div className={`relative ${currentSize} flex items-center justify-center gap-1`}>
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
        />
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: ['20%', '80%', '20%'] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
            className="w-1 bg-blue-500 rounded-full"
            style={{ minHeight: '4px' }}
          />
        ))}
      </div>
    );
  }

  if (state === 'speaking') {
    return (
      <div className={`relative ${currentSize} flex items-center justify-center`}>
         <motion.div
            animate={{ scale: [1, 2], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 border-2 border-green-500 rounded-full"
         />
         <motion.div
            animate={{ scale: [1, 2], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
            className="absolute inset-0 border-2 border-green-500 rounded-full"
         />
         <div className="w-1/3 h-1/3 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] relative z-10"></div>
      </div>
    );
  }

  // Idle
  return (
    <div className={`relative ${currentSize} flex items-center justify-center`}>
       <div className="w-1/3 h-1/3 border-2 border-ds-text-tertiary rounded-full opacity-50"></div>
    </div>
  );
};
