import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MicOff, PhoneOff, MoreHorizontal } from 'lucide-react';
import { AIAvatar } from '../../design-system/ai/AIAvatar';
import { Badge } from '../../design-system/atoms/Badge';

export const MobileVoiceAgent = ({ onClose }) => {
  const [aiState, setAiState] = useState('listening'); // listening, thinking, speaking

  // Auto-cycle for demo purposes
  useEffect(() => {
     const cycle = () => {
        setTimeout(() => setAiState('thinking'), 3000);
        setTimeout(() => setAiState('speaking'), 6000);
        setTimeout(() => setAiState('listening'), 10000);
     };
     cycle();
     const interval = setInterval(cycle, 10000);
     return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
       {/* Top Status */}
       <header className="pt-12 px-6 flex justify-between items-center relative z-10">
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
             <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
          <Badge variant={aiState === 'listening' ? 'info' : aiState === 'thinking' ? 'warning' : 'success'} pulse>
             <span className="capitalize">{aiState}</span>
          </Badge>
          <div className="w-10 h-10"></div> {/* Spacer */}
       </header>

       {/* Massive 3D Avatar Centerpiece */}
       <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <AIAvatar state={aiState} className="w-[150vw] h-[150vw] max-w-[600px] max-h-[600px] opacity-90" />
       </div>

       {/* Transcript / Text Output */}
       <div className="px-8 pb-12 text-center h-32 flex items-center justify-center relative z-10">
          <motion.p 
            key={aiState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold text-white/90"
          >
             {aiState === 'listening' && "Listening to you..."}
             {aiState === 'thinking' && "Analyzing CRM context..."}
             {aiState === 'speaking' && "I've sent the proposal to Sarah. Anything else?"}
          </motion.p>
       </div>

       {/* Huge Touch Controls */}
       <div className="pb-12 px-12 flex items-center justify-center gap-8 relative z-10">
          <button className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform">
             <MicOff className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={onClose}
            className="w-20 h-20 rounded-full bg-ds-danger flex items-center justify-center active:scale-95 transition-transform shadow-[0_0_40px_rgba(239,68,68,0.4)]"
          >
             <PhoneOff className="w-8 h-8 text-white" />
          </button>
       </div>

    </motion.div>
  );
};
