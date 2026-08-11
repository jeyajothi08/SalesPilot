import React from 'react';
import { ArrowRight, Calendar, FileText, Percent, Zap } from 'lucide-react';

const ActionAndStrategy = () => {
  
  const recommendations = [
    { id: 1, action: 'Book Follow-up Meeting', icon: <Calendar className="w-5 h-5 text-blue-500" />, reason: 'Customer requested a technical deep dive.', priority: 'High' },
    { id: 2, action: 'Send Enterprise Proposal', icon: <FileText className="w-5 h-5 text-purple-500" />, reason: 'Verbal agreement reached on pricing tiers.', priority: 'High' },
  ];

  const strategies = [
    { label: 'Upsell AI Module', icon: <Zap className="w-4 h-4 text-primary" />, desc: 'Customer showed interest in automation features.' },
    { label: 'Bundle Discount', icon: <Percent className="w-4 h-4 text-green-500" />, desc: 'Offer 15% off if closing before end of Q3.' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Recommendations */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Recommended Actions</h3>
        
        <div className="space-y-3">
           {recommendations.map(rec => (
             <div key={rec.id} className="p-4 bg-bg-primary border border-border rounded-2xl flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
               <div className="p-2 bg-bg-secondary rounded-xl border border-border group-hover:bg-primary/5 transition-colors">
                 {rec.icon}
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-center mb-1">
                   <h4 className="font-bold text-text-main text-sm">{rec.action}</h4>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">{rec.priority}</span>
                 </div>
                 <p className="text-xs text-text-muted">{rec.reason}</p>
               </div>
               <button className="self-center p-2 text-text-muted hover:text-primary transition-colors">
                 <ArrowRight className="w-4 h-4" />
               </button>
             </div>
           ))}
        </div>
      </div>

      {/* Strategies */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Sales Strategy</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {strategies.map((strat, idx) => (
            <div key={idx} className="p-4 bg-bg-primary border border-border rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                {strat.icon}
                <h4 className="font-bold text-text-main text-sm">{strat.label}</h4>
              </div>
              <p className="text-xs text-text-muted">{strat.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ActionAndStrategy;
