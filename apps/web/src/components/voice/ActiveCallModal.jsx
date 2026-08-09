import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActiveCallModal({ isOpen, onClose, customerName }) {
  const [transcript, setTranscript] = useState([
    { speaker: 'AI', text: 'Hello! This is SalesPilot AI calling. How can I assist you today?' }
  ]);
  
  const [isAiTalking, setIsAiTalking] = useState(true);

  // Simulate a live conversation
  useEffect(() => {
    if (!isOpen) return;
    
    const timer1 = setTimeout(() => {
      setIsAiTalking(false);
      setTranscript(prev => [...prev, { speaker: 'Customer', text: 'Hi, I received your proposal and had a few questions about the pricing.' }]);
    }, 4000);

    const timer2 = setTimeout(() => {
      setIsAiTalking(true);
      setTranscript(prev => [...prev, { speaker: 'AI', text: 'Absolutely, I would be happy to walk you through the pricing tiers. The enterprise plan includes 24/7 support.' }]);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  // Audio wave animation renderer
  const renderWave = (isActive) => (
    <div className="flex items-center justify-center gap-1 h-16 mt-6">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-gray-600'}`}
          animate={isActive ? {
            height: [10, Math.random() * 40 + 10, 10],
          } : { height: 4 }}
          transition={{
            repeat: Infinity,
            duration: 0.5 + Math.random() * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white font-medium">Live Call in Progress</span>
              </div>
              <span className="text-gray-400 text-sm">00:00:12</span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{customerName || 'Unknown Caller'}</h3>
              <p className="text-sm text-gray-400">{isAiTalking ? 'AI is speaking...' : 'Customer is speaking...'}</p>
              
              {renderWave(isAiTalking)}

              {/* Transcript */}
              <div className="mt-8 w-full bg-black/40 rounded-xl p-4 h-48 overflow-y-auto border border-white/5 space-y-4">
                {transcript.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.speaker === 'AI' ? 'items-start' : 'items-end'}`}>
                    <span className="text-xs text-gray-500 mb-1">{msg.speaker}</span>
                    <div className={`px-3 py-2 rounded-lg text-sm ${msg.speaker === 'AI' ? 'bg-blue-500/20 text-blue-100' : 'bg-white/10 text-gray-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-black/30 flex justify-center gap-4">
               <button 
                  onClick={onClose}
                  className="px-6 py-2.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 font-medium rounded-xl transition-colors flex items-center gap-2"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21L9.22 3.683A1 1 0 008.27 3H5z" />
                 </svg>
                 End Call
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
