import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ 
  variant = 'primary', // primary, monochrome, glass, text-only, icon-only
  size = 'md', // sm, md, lg, xl
  className = ''
}) => {
  const dimensions = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
    xl: { icon: 64, text: 'text-5xl' },
  };

  const d = dimensions[size];

  const getGradient = () => {
    if (variant === 'monochrome') return 'fill-white';
    if (variant === 'glass') return 'fill-white/20 backdrop-blur-md';
    return 'fill-[url(#brand-gradient)]';
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      
      {/* Neural Sphere Icon */}
      {variant !== 'text-only' && (
        <motion.svg 
          width={d.icon} 
          height={d.icon} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          whileHover={variant === 'primary' ? { rotate: 180, scale: 1.1 } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        >
          <defs>
            <linearGradient id="brand-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="45" stroke="url(#brand-gradient)" strokeWidth="8" strokeDasharray="80 120" strokeLinecap="round" className="animate-spin-slow" />
          
          {/* The Geometric 'S' */}
          <path d="M70 35C70 25 60 20 50 20C40 20 30 25 30 35C30 45 70 55 70 65C70 75 60 80 50 80C40 80 30 75 30 65" 
                stroke={variant === 'monochrome' ? 'white' : 'url(#brand-gradient)'} 
                strokeWidth="12" 
                strokeLinecap="round" 
          />
          
          {/* The AI Core */}
          <circle cx="50" cy="50" r="8" className={getGradient()} />
        </motion.svg>
      )}

      {/* Wordmark */}
      {variant !== 'icon-only' && (
        <div className={`font-extrabold tracking-tighter ${d.text} ${variant === 'monochrome' ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70'}`}>
          SalesPilot<span className="text-blue-500">.</span>
        </div>
      )}

    </div>
  );
};
