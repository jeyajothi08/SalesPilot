import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhoneMissed, Clock, Frown, Database } from 'lucide-react';
import { Card } from '../../../design-system/molecules/Card';

gsap.registerPlugin(ScrollTrigger);

const problems = [
  { icon: <PhoneMissed className="w-8 h-8 text-ds-danger" />, title: "Missed Calls", desc: "60% of leads abandon when sent to voicemail." },
  { icon: <Clock className="w-8 h-8 text-ds-warning" />, title: "Slow Follow-ups", desc: "Taking 24 hours to reply drops conversion by 80%." },
  { icon: <Database className="w-8 h-8 text-purple-400" />, title: "Siloed Data", desc: "CRMs are only as good as the manual data entry." },
  { icon: <Frown className="w-8 h-8 text-orange-400" />, title: "Burnout", desc: "Sales teams waste 40% of their day on administrative tasks." }
];

export const Chapter2Problem = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section and animate cards floating up
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        }
      });

      tl.from('.problem-text', { opacity: 0, y: 50, duration: 1 })
        .from('.problem-card', { 
          opacity: 0, 
          y: 100, 
          rotationX: 45, 
          stagger: 0.2, 
          duration: 1 
        })
        .to('.problem-card', {
          y: -50,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          delay: 0.5
        });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full h-screen bg-ds-background flex flex-col items-center justify-center overflow-hidden relative perspective-1000">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ds-danger/10 via-ds-background to-ds-background pointer-events-none"></div>

      <div className="max-w-6xl w-full px-6 flex flex-col items-center">
         <h2 className="problem-text text-5xl md:text-7xl font-extrabold text-white mb-6 text-center tracking-tight">
           Sales is broken.
         </h2>
         <p className="problem-text text-xl text-ds-text-secondary text-center max-w-2xl mb-16">
           Traditional software relies on humans doing robot work. The modern pipeline is leaking revenue.
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {problems.map((prob, idx) => (
               <div key={idx} className="problem-card">
                 <Card variant="glass" className="h-full border-white/5 bg-white/5 backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                      {prob.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{prob.title}</h3>
                    <p className="text-sm text-ds-text-tertiary">{prob.desc}</p>
                 </Card>
               </div>
            ))}
         </div>
      </div>

    </section>
  );
};
