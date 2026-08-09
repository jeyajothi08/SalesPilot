import React from 'react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  { quote: "SalesPilot has completely transformed our outbound process. We book 3x more meetings now without hiring more SDRs.", author: "Sarah Jenkins", role: "VP of Sales, TechCorp" },
  { quote: "The AI sounds so natural that our prospects don't even realize they are talking to a machine until they are told.", author: "Marcus Chen", role: "Founder, GrowthGen" },
  { quote: "Incredible ROI. The platform paid for itself in the first 48 hours. The WhatsApp automation is a game changer.", author: "Emily Davis", role: "Sales Director, Innovate" }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Loved by sales teams.</h2>
        <p className="text-xl text-gray-400 font-light leading-relaxed">
          See what our customers have to say about SalesPilot AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((test, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
          >
            <div className="mb-8">
               {/* 5 Stars */}
               <div className="flex gap-1 mb-6">
                 {[...Array(5)].map((_, i) => (
                   <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                 ))}
               </div>
               <p className="text-gray-300 font-light leading-relaxed">"{test.quote}"</p>
            </div>
            <div>
               <div className="font-semibold text-white">{test.author}</div>
               <div className="text-sm text-gray-500">{test.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
