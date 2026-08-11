import React, { useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Ear, TrendingUp, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    title: 'Listen.',
    desc: 'The AI processes audio in real-time, understanding intent, sentiment, and context better than a human.',
    icon: <Ear className="w-12 h-12 text-blue-500" />,
    color: 'from-blue-500/20 to-transparent',
    border: 'border-blue-500/20'
  },
  {
    id: 2,
    title: 'Think.',
    desc: 'It searches your entire company knowledge base in milliseconds to formulate the perfect response.',
    icon: <Brain className="w-12 h-12 text-purple-500" />,
    color: 'from-purple-500/20 to-transparent',
    border: 'border-purple-500/20'
  },
  {
    id: 3,
    title: 'Negotiate.',
    desc: 'Handles objections, offers dynamic pricing, and pushes the prospect towards the close.',
    icon: <MessageSquare className="w-12 h-12 text-orange-500" />,
    color: 'from-orange-500/20 to-transparent',
    border: 'border-orange-500/20'
  },
  {
    id: 4,
    title: 'Close.',
    desc: 'Automatically schedules meetings, generates proposals, and logs the victory in your CRM.',
    icon: <TrendingUp className="w-12 h-12 text-green-500" />,
    color: 'from-green-500/20 to-transparent',
    border: 'border-green-500/20'
  }
];

const FeaturesScrollStory = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    // Pin the section and scroll the container horizontally
    const scrollTween = gsap.to(container, {
      x: () => -(container.scrollWidth - window.innerWidth + 200),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        end: () => "+=" + (container.scrollWidth - window.innerWidth),
      }
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="h-screen w-full bg-black flex items-center overflow-hidden relative">
       
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

       <div className="w-full flex items-center h-full">
         
         {/* Introduction Text Block */}
         <div className="w-[40vw] shrink-0 pl-12 md:pl-24 z-10">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight">
               How it works.
            </h2>
            <p className="text-gray-400 text-xl font-medium mt-6 max-w-md">
               A proprietary neural architecture designed specifically for the mechanics of enterprise sales.
            </p>
         </div>

         {/* Horizontal Scrolling Cards */}
         <div ref={containerRef} className="flex gap-8 px-12 z-10">
            {features.map((feature, i) => (
              <div 
                key={feature.id} 
                className={`w-[400px] h-[500px] shrink-0 rounded-[2rem] bg-gradient-to-b ${feature.color} bg-black border ${feature.border} p-10 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 group cursor-pointer`}
              >
                 <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
                       {feature.icon}
                    </div>
                    <h3 className="text-4xl font-extrabold text-white mb-4 tracking-tight">{feature.title}</h3>
                    <p className="text-lg text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                 </div>

                 <div className="relative z-10 flex justify-between items-end">
                    <span className="text-white/20 text-6xl font-black">0{i+1}</span>
                 </div>
              </div>
            ))}
         </div>

       </div>
    </section>
  );
};

export default FeaturesScrollStory;
