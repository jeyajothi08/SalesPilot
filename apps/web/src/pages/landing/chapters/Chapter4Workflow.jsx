import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, FileText, Play, CheckCircle } from 'lucide-react';
import { Card } from '../../../design-system/molecules/Card';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { step: "01", title: "Ingest Knowledge", icon: <Database />, desc: "Connect your CRM, Notion, and PDFs. The AI learns your entire business." },
  { step: "02", title: "Analyze Intent", icon: <Brain />, desc: "When a customer calls, the AI instantly retrieves relevant context." },
  { step: "03", title: "Generate Action", icon: <FileText />, desc: "It dynamically drafts a custom proposal while on the phone." },
  { step: "04", title: "Close Deal", icon: <CheckCircle />, desc: "The AI emails the proposal and updates the CRM pipeline automatically." }
];

// Re-using a dummy icon since Database wasn't imported properly
function Database() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg>
  );
}

export const Chapter4Workflow = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal Scroll Animation
      const cards = gsap.utils.toArray('.workflow-card');
      
      gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (cards.length - 1),
          start: "top top",
          end: () => "+=" + document.querySelector(".workflow-container").offsetWidth
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full h-screen bg-ds-background flex items-center overflow-hidden">
      
      <div className="absolute top-12 left-12 md:top-24 md:left-24 z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">How it works</h2>
      </div>

      <div ref={containerRef} className="workflow-container flex w-[400vw] h-full items-center pl-12 md:pl-24 gap-12">
         {steps.map((step, idx) => (
           <div key={idx} className="workflow-card w-screen md:w-[60vw] h-[60vh] flex-shrink-0 flex pr-12">
              <Card variant="glass" className="w-full h-full bg-white/5 border-white/10 flex flex-col justify-between p-12">
                 <div className="flex justify-between items-start">
                    <span className="text-8xl font-black text-white/10 tracking-tighter leading-none">{step.step}</span>
                    <div className="w-16 h-16 rounded-full bg-ds-accent/20 flex items-center justify-center text-ds-accent">
                      {step.icon}
                    </div>
                 </div>
                 
                 <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-xl text-ds-text-secondary max-w-lg">{step.desc}</p>
                 </div>
              </Card>
           </div>
         ))}
      </div>
      
    </section>
  );
};
