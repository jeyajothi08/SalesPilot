import React from 'react';
import { motion } from 'framer-motion';

export const EmailAutomation = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-400 mb-6">
            Hyper-Personalization
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Cold emails that actually get replies.
          </h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
            The AI researches your prospect's LinkedIn and company website to craft highly tailored, non-generic outbound emails.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-full rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl p-8"
        >
           <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center border-b border-white/5 pb-4">
                 <div className="text-sm text-gray-500 w-16">To:</div>
                 <div className="px-2 py-1 rounded bg-white/5 text-sm text-gray-300">john.doe@acmecorp.com</div>
              </div>
              <div className="flex gap-2 items-center border-b border-white/5 pb-4">
                 <div className="text-sm text-gray-500 w-16">Subject:</div>
                 <div className="text-sm text-gray-300 font-medium">Thoughts on your recent Series B</div>
              </div>
              <div className="mt-4">
                 <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="h-2 bg-white/10 rounded mb-3" />
                 <motion.div initial={{ width: 0 }} whileInView={{ width: "90%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.8 }} className="h-2 bg-white/10 rounded mb-3" />
                 <motion.div initial={{ width: 0 }} whileInView={{ width: "95%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.1 }} className="h-2 bg-white/10 rounded mb-6" />
                 
                 <motion.div initial={{ width: 0 }} whileInView={{ width: "60%" }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.5 }} className="h-2 bg-blue-500/40 rounded mb-3" />
                 <motion.div initial={{ width: 0 }} whileInView={{ width: "40%" }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.8 }} className="h-2 bg-blue-500/40 rounded" />
              </div>
           </div>
        </motion.div>

      </div>
    </section>
  );
};
