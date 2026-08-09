import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Ready to scale?</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed mb-8">
            Get in touch with our team to see how SalesPilot AI can transform your revenue engine.
          </p>
        </div>
        
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
           {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                 <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 border border-green-500/30">✓</div>
                 <h3 className="text-xl font-semibold text-white mb-2">Message received</h3>
                 <p className="text-gray-400 text-sm">We'll be in touch shortly.</p>
              </motion.div>
           ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                    <input required type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                 </div>
                 <input required type="email" placeholder="Work Email" className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors" />
                 <textarea required rows="4" placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
                 <button type="submit" className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors mt-2">Submit</button>
              </form>
           )}
        </div>
      </div>
    </section>
  );
};
