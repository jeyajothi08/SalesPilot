import React from 'react';
import { motion } from 'framer-motion';

export const CRMShowcase = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Built-in CRM Engine</h2>
        <p className="text-lg text-gray-400 font-light leading-relaxed">
          Manage your pipeline directly within SalesPilot, or sync bi-directionally with Salesforce and HubSpot.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.02]">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-white/10"></div>
             <div className="w-3 h-3 rounded-full bg-white/10"></div>
             <div className="w-3 h-3 rounded-full bg-white/10"></div>
           </div>
           <div className="text-xs text-gray-500 font-medium">pipeline.salespilot.ai</div>
           <div className="w-10"></div>
        </div>
        <div className="p-8 grid grid-cols-4 gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.05] to-transparent">
           {/* Mock Kanban Columns */}
           {["Lead In", "Contacted", "Proposal", "Won"].map((col, i) => (
             <div key={i} className="flex flex-col gap-4">
                <div className="text-sm font-semibold text-white/70">{col}</div>
                <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl bg-white/5 border border-white/10">
                   <div className="h-2 w-1/3 bg-white/20 rounded mb-4"></div>
                   <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                   <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                </motion.div>
                {i % 2 === 0 && (
                  <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-70">
                     <div className="h-2 w-1/4 bg-white/20 rounded mb-4"></div>
                     <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                     <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                  </motion.div>
                )}
             </div>
           ))}
        </div>
      </motion.div>
    </section>
  );
};
