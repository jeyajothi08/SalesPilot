import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DataVisualizationSection = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section className="relative min-h-screen w-full bg-black py-32 overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6">
        
        <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter max-w-4xl mx-auto leading-tight mb-8">
          Infinite scale. <br/> Zero overhead.
        </h2>
        <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-24">
          Visualizing the sheer volume of conversations your AI workforce handles simultaneously. It's like having a 10,000 person call center in your pocket.
        </p>

        {/* Cinematic Stats Display */}
        <div className="relative w-full max-w-6xl mx-auto h-[600px] flex items-center justify-center">
           
           {/* Center Glowing Ring (CSS Based) */}
           <motion.div 
             animate={{ rotate: 360 }} 
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="absolute w-[500px] h-[500px] rounded-full border border-white/10 border-t-blue-500 border-r-purple-500 shadow-[0_0_100px_rgba(59,130,246,0.2)]"
           />
           <motion.div 
             animate={{ rotate: -360 }} 
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="absolute w-[400px] h-[400px] rounded-full border border-white/10 border-b-blue-500 border-l-purple-500 border-dashed"
           />

           {/* Floating Stat Cards (Parallax) */}
           <motion.div style={{ y: y1 }} className="absolute left-[10%] top-[20%] glass-card bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-64 shadow-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Calls Today</p>
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">14.2k</h3>
           </motion.div>

           <motion.div style={{ y: y2 }} className="absolute right-[10%] bottom-[20%] glass-card bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-64 shadow-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Meetings Booked</p>
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">842</h3>
           </motion.div>

           <motion.div style={{ y: y1 }} className="absolute left-[20%] bottom-[10%] glass-card bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-56 shadow-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Conversion</p>
              <h3 className="text-5xl font-black text-white">62%</h3>
           </motion.div>

           <motion.div style={{ y: y2 }} className="absolute right-[20%] top-[10%] glass-card bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-56 shadow-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Revenue Generated</p>
              <h3 className="text-5xl font-black text-white">$1.2M</h3>
           </motion.div>
           
        </div>

      </div>

    </section>
  );
};

export default DataVisualizationSection;
