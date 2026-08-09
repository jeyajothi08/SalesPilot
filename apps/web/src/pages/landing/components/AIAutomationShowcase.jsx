import React from 'react';
import { motion } from 'framer-motion';

export const AIAutomationShowcase = () => {
  return (
    <section id="automation" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400 mb-6">
            AI Brain
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Contextual memory across all channels.
          </h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
            Our autonomous agents remember past interactions, analyze sentiment, and dynamically adjust their sales pitch to guarantee the highest conversion rates.
          </p>
          <ul className="space-y-4">
             {["Continuous Learning Engine", "Real-time Objection Handling", "Automated Follow-ups"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {item}
                </li>
             ))}
          </ul>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative h-[400px] w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.01] overflow-hidden flex items-center justify-center shadow-2xl"
        >
          {/* Mock Node graph connecting memory */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center gap-4">
             <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                AI
             </motion.div>
             <div className="flex gap-8 mt-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0 }} className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 backdrop-blur-sm">CRM Data</motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 backdrop-blur-sm">Call Logs</motion.div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 2 }} className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 backdrop-blur-sm">Emails</motion.div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
