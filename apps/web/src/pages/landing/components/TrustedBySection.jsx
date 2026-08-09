import React from 'react';
import { motion } from 'framer-motion';

const COMPANIES = [
  "Acme Corp", "GlobalTech", "StartupInc", "NextGen", "CloudSync", "Nexus", "Vertex", "Quantum"
];

export const TrustedBySection = () => {
  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.02] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Trusted by innovative companies
        </p>
      </div>
      
      {/* Infinite Marquee */}
      <div className="relative flex w-full overflow-hidden whitespace-nowrap">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10"></div>
        
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-16 px-8 opacity-50 grayscale"
        >
          {/* Double array for seamless loop */}
          {[...COMPANIES, ...COMPANIES].map((company, idx) => (
            <div key={idx} className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
               {/* Fictional icon */}
               <div className="w-6 h-6 rounded bg-white/20"></div>
               {company}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
