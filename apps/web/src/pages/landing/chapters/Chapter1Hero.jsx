import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { Button } from '../../../design-system/atoms/Button';
import { AIAvatar } from '../../../design-system/ai/AIAvatar';

export const Chapter1Hero = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const yText = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleOrb = useTransform(scrollY, [0, 1000], [1, 1.5]);

  useEffect(() => {
    // Initial load animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[120vh] flex items-center justify-center overflow-hidden">
      
      {/* 3D Orb Background Container */}
      <motion.div 
        style={{ scale: scaleOrb }}
        className="absolute inset-0 z-0 flex items-center justify-center mt-32"
      >
         <AIAvatar state="thinking" className="w-[800px] h-[800px] opacity-60" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6"
      >
        <div className="hero-stagger px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold text-ds-text-secondary uppercase tracking-widest mb-8 shadow-2xl">
          SalesPilot OS Beta 1.0
        </div>
        
        <h1 className="hero-stagger text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/30 leading-none mb-8">
          The AI Era<br/>of Sales.
        </h1>
        
        <p className="hero-stagger text-xl md:text-2xl text-ds-text-secondary max-w-2xl mb-12 font-medium">
          Deploy a 24x7 Digital Employee that learns your product, calls your leads, and closes deals autonomously.
        </p>
        
        <div className="hero-stagger flex items-center gap-6">
          <Button variant="primary" size="lg" className="rounded-full px-8 py-6 text-lg shadow-[0_0_40px_rgba(59,130,246,0.4)]">
            Deploy Your AI
          </Button>
          <Button variant="ghost" size="lg" className="rounded-full px-8 py-6 text-lg">
            Watch Keynote
          </Button>
        </div>
      </motion.div>
      
    </section>
  );
};
