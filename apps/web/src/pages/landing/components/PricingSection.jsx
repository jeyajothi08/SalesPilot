import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Simple, transparent pricing.</h2>
        <p className="text-xl text-gray-400 font-light leading-relaxed">
          Invest in an AI employee that costs a fraction of a human SDR.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Starter Plan */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-10 rounded-3xl bg-white/5 border border-white/10 flex flex-col"
        >
          <div className="text-xl font-semibold text-white mb-2">Starter</div>
          <div className="text-gray-500 text-sm mb-8">Perfect for freelancers and small agencies.</div>
          <div className="mb-8 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">$99</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
             {["500 AI Voice Minutes", "Email Automation", "Basic Analytics", "Standard Support"].map((feat, i) => (
               <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                 <CheckCircle2 className="w-5 h-5 text-blue-400" /> {feat}
               </li>
             ))}
          </ul>
          <Link to="/register" className="w-full">
            <button className="w-full py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">Start Free Trial</button>
          </Link>
        </motion.div>

        {/* Pro Plan */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-10 rounded-3xl bg-linear-to-b from-blue-600/20 to-purple-600/10 border border-blue-500/30 flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-blue-400 to-purple-400"></div>
          <div className="text-xl font-semibold text-white mb-2 flex items-center justify-between">
             Professional
             <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">Most Popular</span>
          </div>
          <div className="text-gray-400 text-sm mb-8">For growing teams that need more power.</div>
          <div className="mb-8 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">$299</span>
            <span className="text-gray-400">/month</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
             {["Unlimited AI Voice Minutes", "WhatsApp Automation", "Custom Knowledge Base", "Advanced CRM Integration", "Priority 24/7 Support"].map((feat, i) => (
               <li key={i} className="flex items-center gap-3 text-gray-200 text-sm">
                 <CheckCircle2 className="w-5 h-5 text-blue-400" /> {feat}
               </li>
             ))}
          </ul>
          <Link to="/register" className="w-full">
            <button className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25">Get Started</button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
