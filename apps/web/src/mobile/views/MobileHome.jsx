import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, TrendingUp, PhoneCall, Bell } from 'lucide-react';
import { Card } from '../../design-system/molecules/Card';
import { AIAvatar } from '../../design-system/ai/AIAvatar';

export const MobileHome = ({ _onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 pt-12 space-y-6"
    >
       {/* Header */}
       <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-ds-text-secondary uppercase tracking-wider">Tuesday, Oct 14</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Good morning.</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
             <Bell className="w-5 h-5 text-white" />
             <span className="absolute top-0 right-0 w-3 h-3 bg-ds-accent rounded-full border-2 border-black"></span>
          </button>
       </header>

       {/* AI Greeting Card */}
       <Card variant="glass" className="p-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 pointer-events-none opacity-50">
             <AIAvatar state="idle" />
          </div>
          <div className="p-6 relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-ds-accent" />
                <span className="text-xs font-bold text-ds-accent uppercase tracking-wider">Copilot Brief</span>
             </div>
             <p className="text-sm text-ds-text-primary leading-relaxed max-w-[80%]">
                You have 3 meetings today. I've drafted a follow-up proposal for Acme Corp and placed it in your drafts.
             </p>
          </div>
       </Card>

       {/* Metrics Grid */}
       <div className="grid grid-cols-2 gap-4">
          <Card variant="default" className="p-4 flex flex-col justify-between h-32">
             <TrendingUp className="w-6 h-6 text-green-400" />
             <div>
                <p className="text-2xl font-bold text-white">$14.2k</p>
                <p className="text-xs text-ds-text-tertiary">Revenue Today</p>
             </div>
          </Card>
          <Card variant="default" className="p-4 flex flex-col justify-between h-32">
             <PhoneCall className="w-6 h-6 text-blue-400" />
             <div>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-xs text-ds-text-tertiary">AI Calls Made</p>
             </div>
          </Card>
       </div>

       {/* Schedule List */}
       <section>
          <h2 className="text-lg font-bold text-white mb-4">Up Next</h2>
          <div className="space-y-3">
             {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-ds-accent/20 text-ds-accent">
                      <span className="text-xs font-bold">10</span>
                      <span className="text-[10px] uppercase">AM</span>
                   </div>
                   <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">Discovery: TechNova</h4>
                      <p className="text-xs text-ds-text-secondary flex items-center gap-1">
                         <Calendar className="w-3 h-3" /> Zoom
                      </p>
                   </div>
                </div>
             ))}
          </div>
       </section>

    </motion.div>
  );
};
