import React from 'react';
import { motion } from 'framer-motion';

export const WhatsAppAutomation = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="order-2 md:order-1 relative h-[500px] w-full rounded-3xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col justify-end p-6"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          
          <div className="relative z-10 flex flex-col gap-4 max-w-sm">
             <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-sm text-gray-300 self-start">
               Hi! I saw you were looking at our enterprise pricing. Any questions?
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1 }} className="p-4 rounded-2xl rounded-tr-sm bg-green-500/20 border border-green-500/30 text-sm text-green-100 self-end">
               Yes, does it include SSO?
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 2 }} className="p-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-sm text-gray-300 self-start">
               Absolutely. Enterprise includes SAML SSO. Want me to send over a booking link to discuss rollout?
             </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="order-1 md:order-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 mb-6">
            WhatsApp Business API
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Meet your customers where they are.
          </h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
            Deploy conversational agents on WhatsApp to instantly answer FAQs, qualify leads, and push them down the funnel automatically.
          </p>
        </motion.div>

      </div>
    </section>
  );
};
