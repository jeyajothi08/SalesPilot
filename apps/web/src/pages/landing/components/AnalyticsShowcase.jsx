import React from 'react';
import { motion } from 'framer-motion';

export const AnalyticsShowcase = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Revenue Intelligence</h2>
        <p className="text-lg text-gray-400 font-light leading-relaxed">
          AI-driven forecasting and real-time BI dashboards to keep a pulse on your business.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl p-8 grid md:grid-cols-3 gap-6"
      >
        <div className="col-span-1 p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center">
           <div className="text-sm text-gray-500 mb-2">Total Revenue Generated</div>
           <div className="text-4xl font-bold text-white mb-2">$1.24M</div>
           <div className="text-sm text-green-400 font-medium">+12.5% vs last month</div>
        </div>
        
        <div className="col-span-2 p-6 rounded-xl bg-white/5 border border-white/5 flex items-end justify-between gap-4 h-48">
           {/* Mock Bar Chart */}
           {[30, 45, 25, 60, 50, 80, 70].map((h, i) => (
             <motion.div 
               key={i}
               initial={{ height: 0 }}
               whileInView={{ height: `${h}%` }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, type: "spring" }}
               className="w-full bg-gradient-to-t from-blue-600/50 to-blue-400 rounded-t-md"
             />
           ))}
        </div>
      </motion.div>
    </section>
  );
};
