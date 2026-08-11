import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Globe, Sparkles } from 'lucide-react';
import ActiveCallModal from '../../../components/voice/ActiveCallModal';
import { CRMProvider } from '../../../context/CRMContext';

export const VoiceCallsShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <CRMProvider>
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6">
            <Globe className="w-3.5 h-3.5" />
            Multi-Lingual AI Voice Engine (English, Tamil, Tanglish, Hindi, Telugu, Malayalam)
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Indistinguishable from human SDRs.</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Our Voice AI engine speaks to prospects, transcribes calls, auto-detects languages, queries live CRM pipeline data, and responds in natural speech.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto h-80 rounded-3xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8">
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/20 to-purple-900/20 opacity-50 mix-blend-screen pointer-events-none"></div>

          <div className="flex items-center gap-2 z-10 mb-6">
            {[...Array(24)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [15, Math.random() * 80 + 20, 15] }}
                transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.4, ease: "easeInOut" }}
                className="w-2 bg-blue-500/80 rounded-full"
              />
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center gap-2.5 transition-all cursor-pointer border-none"
            >
              <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Test Interactive Voice SDR</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </button>
          </motion.div>
           
          <div className="absolute bottom-4 text-xs text-gray-400 font-medium z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Supports natural speech in English, Tamil, Tanglish, Hindi, Telugu, and Malayalam</span>
          </div>
        </div>

        {isModalOpen && (
          <ActiveCallModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            customerName="Voice AI Demo Prospect"
          />
        )}
      </section>
    </CRMProvider>
  );
};
