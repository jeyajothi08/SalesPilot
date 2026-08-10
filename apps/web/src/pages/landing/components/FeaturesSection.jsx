import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Calendar, Mail, TrendingUp, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { slug: "voice-calling", icon: <Phone />, title: "AI Voice Calling", desc: "Human-like conversational AI that dials leads automatically and handles objections gracefully." },
  { slug: "smart-conversations", icon: <MessageSquare />, title: "Smart Conversations", desc: "Understands context, intent, and sentiment to answer complex questions naturally." },
  { slug: "auto-booking", icon: <Calendar />, title: "Auto Booking", desc: "Seamlessly books meetings directly into your Google Calendar or Zoom schedule." },
  { slug: "email-automation", icon: <Mail />, title: "Email Automation", desc: "Automatically sends follow-ups, proposals, and thank you notes after calls." },
  { slug: "lead-qualification", icon: <TrendingUp />, title: "Lead Qualification", desc: "Intelligently scores and categorizes leads by interest level and potential value." },
  { slug: "premium-analytics", icon: <BarChart />, title: "Premium Analytics", desc: "Detailed performance reports, conversion metrics, and beautiful charts." }
];

export const FeaturesSection = () => {
  const navigate = useNavigate();
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white"
        >
          Everything you need. <br/><span className="text-gray-500">Nothing you don't.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-400 font-light leading-relaxed"
        >
          SalesPilot AI replaces your entire SDR team with intelligent automation, designed with unparalleled attention to detail.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group overflow-hidden"
          >
            <div 
              onClick={() => navigate(`/features/${feat.slug}`)} 
              className="block w-full h-full p-8 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-white mb-3 group-hover:text-blue-400 transition-colors">{feat.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
