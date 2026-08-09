import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';
import AIOrb3D from './3d/AIOrb3D';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white selection:bg-primary selection:text-white pt-24">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0"></div>
      
      {/* 3D AI Brain */}
      <AIOrb3D />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-xs font-medium tracking-wide">SalesPilot AI is now live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter max-w-5xl mx-auto leading-tight"
        >
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">24×7</span> AI Sales Employee.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto font-medium"
        >
          The first operating system for AI agents. Automate calls, negotiate deals, and scale your revenue infinitely with superhuman intelligence.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
           <MagneticButton className="w-48 h-14 rounded-full text-white font-bold text-base">
              <span className="flex items-center gap-2">
                Deploy Agent <ArrowRight className="w-5 h-5" />
              </span>
           </MagneticButton>
           
           <MagneticButton className="w-48 h-14 rounded-full text-white font-bold text-base group">
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </span>
           </MagneticButton>
        </motion.div>
      </div>

      {/* Floating Glass Panels (Parallax Effect in next steps) */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        className="absolute bottom-[-10%] w-full max-w-5xl mx-auto left-0 right-0 h-64 bg-white/5 backdrop-blur-2xl border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(59,130,246,0.15)] flex justify-center pt-8"
      >
         <div className="w-32 h-1 bg-white/20 rounded-full"></div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
