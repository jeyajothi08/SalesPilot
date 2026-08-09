import React from 'react';
import { motion } from 'framer-motion';

export const VoiceCallsShowcase = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center mb-20 max-w-3xl mx-auto">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6">
            Sub-second Latency
          </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Indistinguishable from human SDRs.</h2>
        <p className="text-lg text-gray-400 font-light leading-relaxed">
          Powered by ElevenLabs and Twilio, our voice AI handles outbound cold calling and inbound routing flawlessly.
        </p>
      </div>

      <div className="relative w-full max-w-4xl mx-auto h-[300px] rounded-3xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl flex items-center justify-center">
         
         <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-50 mix-blend-screen"></div>

         <div className="flex items-center gap-2 z-10">
            {[...Array(20)].map((_, i) => (
               <motion.div 
                 key={i}
                 animate={{ height: [20, Math.random() * 100 + 40, 20] }}
                 transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                 className="w-2 bg-blue-500/80 rounded-full"
               />
            ))}
         </div>
         
         <div className="absolute bottom-6 text-sm text-gray-500 font-medium z-10">
            Live Transcription: <span className="text-gray-300">"Hey there, this is Alex from SalesPilot. I noticed you..."</span>
         </div>
      </div>
    </section>
  );
};
