import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
      
      {/* Background Gradient */}
      <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SalesPilot AI is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] text-white">
          Your 24×7 <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
            AI Sales Employee.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Scale your revenue without scaling headcount. Our AI engine books meetings, closes deals, and handles objections automatically.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold flex items-center gap-2 w-full sm:w-auto justify-center hover:bg-gray-100 transition-colors"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold w-full sm:w-auto justify-center hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Book Demo
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Abstract Dashboard Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-20 w-full max-w-5xl h-100 md:h-150 border border-white/10 rounded-2xl relative overflow-hidden bg-black/40 backdrop-blur-md shadow-2xl shadow-blue-500/10 z-10 flex items-center justify-center"
      >
         <div className="absolute top-0 w-full h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
         </div>
         <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative">
               <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-ping"></div>
               <Bot className="w-10 h-10 text-blue-400" />
            </div>
            <div className="text-center">
              <div className="text-white font-medium text-lg">SalesPilot Engine Active</div>
              <div className="text-gray-400 text-sm mt-1">Processing 42 active leads...</div>
            </div>
         </div>
      </motion.div>
    </section>
  );
};
