import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ConversationPanel = ({ messages = [] }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6"
    >
      {messages.map((msg, idx) => {
        const isAI = msg.role === 'ai';
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'}`}
          >
             <div className={`
               max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
               ${isAI 
                 ? 'bg-white/5 border border-white/10 text-ds-text-primary rounded-tl-sm shadow-xl' 
                 : 'bg-ds-accent text-white rounded-tr-sm shadow-ds-glow-primary'
               }
             `}>
                {msg.content}
                <div className={`text-[10px] mt-2 font-medium opacity-50 ${isAI ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
             </div>
          </motion.div>
        );
      })}
    </div>
  );
};
