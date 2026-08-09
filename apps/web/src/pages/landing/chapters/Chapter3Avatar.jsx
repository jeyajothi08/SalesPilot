import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AIAvatar } from '../../../design-system/ai/AIAvatar';

gsap.registerPlugin(ScrollTrigger);

export const Chapter3Avatar = () => {
  const sectionRef = useRef(null);
  const [aiState, setAiState] = useState('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%", // 2 viewport heights to scroll through
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.3) setAiState('idle');
            else if (p >= 0.3 && p < 0.6) setAiState('listening');
            else if (p >= 0.6 && p < 0.9) setAiState('thinking');
            else setAiState('speaking');
          }
        }
      });

      // Text fade in/out sequence
      tl.to('.text-1', { opacity: 1, duration: 1 })
        .to('.text-1', { opacity: 0, duration: 1 })
        .to('.text-2', { opacity: 1, duration: 1 })
        .to('.text-2', { opacity: 0, duration: 1 })
        .to('.text-3', { opacity: 1, duration: 1 })
        .to('.text-3', { opacity: 0, duration: 1 })
        .to('.text-4', { opacity: 1, duration: 1 });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* Central 3D Avatar */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
         <AIAvatar state={aiState} className="w-[600px] h-[600px] scale-125 md:scale-100" />
      </div>

      {/* Text Overlay Layers */}
      <div className="relative z-20 w-full h-full flex items-center justify-center max-w-4xl px-6 text-center pointer-events-none">
         
         <div className="absolute text-1 opacity-0">
           <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">Meet your new hire.</h2>
           <p className="text-xl text-white/50">It never sleeps, never takes a day off, and remembers everything.</p>
         </div>

         <div className="absolute text-2 opacity-0">
           <h2 className="text-5xl md:text-7xl font-bold text-blue-400 mb-4">It Listens.</h2>
           <p className="text-xl text-white/50">Taking inbound calls and answering questions with millisecond latency.</p>
         </div>

         <div className="absolute text-3 opacity-0">
           <h2 className="text-5xl md:text-7xl font-bold text-purple-400 mb-4">It Thinks.</h2>
           <p className="text-xl text-white/50">Analyzing CRM context in real-time to decide the perfect response.</p>
         </div>

         <div className="absolute text-4 opacity-0">
           <h2 className="text-5xl md:text-7xl font-bold text-green-400 mb-4">It Executes.</h2>
           <p className="text-xl text-white/50">Generating proposals, booking meetings, and closing deals.</p>
         </div>

      </div>

    </section>
  );
};
