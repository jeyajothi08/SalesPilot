import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ear, Brain, Search, Target, CheckCircle2, MessageSquare, LineChart, FileText } from 'lucide-react';

const steps = [
  { id: 1, label: 'Listening', icon: <Ear className="w-5 h-5" /> },
  { id: 2, label: 'Understanding Context', icon: <Brain className="w-5 h-5" /> },
  { id: 3, label: 'Searching Knowledge Base', icon: <Search className="w-5 h-5" /> },
  { id: 4, label: 'Analyzing Intent', icon: <Target className="w-5 h-5" /> },
  { id: 5, label: 'Choosing Strategy', icon: <LineChart className="w-5 h-5" /> },
  { id: 6, label: 'Generating Response', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 7, label: 'Predicting Outcome', icon: <CheckCircle2 className="w-5 h-5" /> },
  { id: 8, label: 'Preparing Follow-up', icon: <FileText className="w-5 h-5" /> },
];

const LiveThinkingPanel = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500); // Change step every 2.5s for demo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-xl relative overflow-hidden flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary animate-pulse" />
          Live AI Processing
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
           <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Active Stream</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 space-y-4">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isPast = idx < activeStep;
          
          return (
            <div key={step.id} className="relative flex items-center gap-4">
               {/* Connecting Line */}
               {idx !== steps.length - 1 && (
                  <div className={`absolute left-5 top-10 bottom-[-16px] w-[2px] transition-colors duration-500 ${isPast ? 'bg-primary' : 'bg-border/50'}`}></div>
               )}
               
               {/* Icon Circle */}
               <motion.div 
                 animate={{ 
                   scale: isActive ? 1.1 : 1, 
                   boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.5)' : 'none',
                   borderColor: isActive ? 'rgba(59,130,246,1)' : isPast ? 'rgba(59,130,246,0.3)' : 'var(--theme-border)'
                 }}
                 className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 z-10 bg-bg-primary
                   ${isActive ? 'text-primary' : isPast ? 'text-primary/70' : 'text-text-muted/50'}
                 `}
               >
                 {step.icon}
               </motion.div>
               
               {/* Label */}
               <div className={`transition-all duration-500 ${isActive ? 'opacity-100 translate-x-2' : isPast ? 'opacity-70' : 'opacity-30'}`}>
                 <p className={`text-sm font-bold ${isActive ? 'text-text-main' : 'text-text-muted'}`}>{step.label}</p>
                 {isActive && (
                   <motion.div 
                     initial={{ width: 0, opacity: 0 }} 
                     animate={{ width: '100px', opacity: 1 }} 
                     className="h-1 bg-gradient-to-r from-primary to-transparent mt-1 rounded-full"
                   />
                 )}
               </div>
            </div>
          )
        })}
      </div>

      {/* Abstract background glow based on active step */}
      <motion.div 
        animate={{ y: activeStep * 40 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute left-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none"
      />
    </div>
  );
};

export default LiveThinkingPanel;
