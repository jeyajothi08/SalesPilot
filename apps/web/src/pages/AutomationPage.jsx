import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './landing/components/Navbar';
import { Footer } from './landing/components/Footer';
import { Link } from 'react-router-dom';
import { Bot, ArrowRight } from 'lucide-react';

const AutomationPage = () => {
  return (
    <main className="bg-black text-white min-h-screen selection:bg-blue-500 selection:text-white font-sans overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-[spin_3s_linear_infinite]"></div>
          <Bot className="w-12 h-12 text-blue-500" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-center max-w-2xl"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 uppercase tracking-widest">
            Coming Soon
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Advanced Workflow Automation</h1>
          <p className="text-xl text-gray-400 font-light mb-10">
            We are building the ultimate visual workflow builder to automate your entire sales process across Email, Voice, SMS, and WhatsApp.
          </p>
          <Link to="/" className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};

export default AutomationPage;
