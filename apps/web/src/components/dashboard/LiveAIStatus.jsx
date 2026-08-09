import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Phone, Clock, ShieldCheck, Activity } from 'lucide-react';

const LiveAIStatus = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card bg-bg-primary p-0 relative overflow-hidden flex flex-col h-full col-span-1 lg:col-span-1"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 bg-[length:200%_100%] animate-gradient"></div>
      
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center text-text-main">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2.5 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          Live AI Agent Status
        </h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
          Speaking
        </span>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        {/* Animated Background Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
           <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute w-48 h-48 rounded-full border border-green-500/30" />
           <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} className="absolute w-48 h-48 rounded-full border border-green-500/20" />
        </div>

        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-green-400 to-emerald-600 p-1 relative z-10 shadow-lg shadow-green-500/30 mb-6">
            <div className="w-full h-full rounded-[20px] bg-bg-primary flex items-center justify-center">
              <Bot className="w-12 h-12 text-green-500" />
            </div>
        </div>

        {/* AI Wave Animation Bar */}
        <div className="flex items-center justify-center space-x-1.5 h-16 w-full max-w-[200px] mb-6 z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: ['20%', `${Math.random() * 60 + 40}%`, '20%'] }}
              transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
              className="w-1.5 bg-green-500 rounded-full"
            />
          ))}
        </div>

        <h3 className="text-xl font-bold text-text-main">Speaking with Michael Scott</h3>
        <p className="text-text-muted text-sm mt-1 mb-8">+1 (555) 012-3456</p>

        <div className="grid grid-cols-2 gap-4 w-full text-left">
           <div className="bg-bg-secondary p-3 rounded-xl border border-border">
              <p className="text-xs text-text-muted flex items-center mb-1"><Clock className="w-3 h-3 mr-1" /> Duration</p>
              <p className="font-semibold text-text-main">04:12</p>
           </div>
           <div className="bg-bg-secondary p-3 rounded-xl border border-border">
              <p className="text-xs text-text-muted flex items-center mb-1"><ShieldCheck className="w-3 h-3 mr-1" /> Confidence</p>
              <p className="font-semibold text-green-500">98%</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveAIStatus;
