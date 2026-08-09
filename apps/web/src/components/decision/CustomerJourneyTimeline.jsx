import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const steps = [
  { id: 1, label: 'First Call', status: 'completed', date: 'Oct 12' },
  { id: 2, label: 'Follow-up', status: 'completed', date: 'Oct 14' },
  { id: 3, label: 'Demo Meeting', status: 'current', date: 'Today' },
  { id: 4, label: 'Proposal', status: 'pending', date: 'Pending' },
  { id: 5, label: 'Negotiation', status: 'pending', date: '-' },
  { id: 6, label: 'Closed Won', status: 'pending', date: '-' },
];

const CustomerJourneyTimeline = () => {
  return (
    <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 h-full shadow-sm overflow-x-auto">
       <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Customer Journey</h3>
       
       <div className="flex items-center min-w-[600px] pt-4 pb-2 px-4">
         {steps.map((step, index) => (
           <React.Fragment key={step.id}>
             <div className="flex flex-col items-center relative group">
               {/* Node */}
               <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 bg-bg-primary
                 ${step.status === 'completed' ? 'border-green-500 text-green-500' : 
                   step.status === 'current' ? 'border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
                   'border-border text-border'}
               `}>
                 {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                  step.status === 'current' ? <Clock className="w-5 h-5 animate-pulse" /> : 
                  <Circle className="w-4 h-4" />}
               </div>
               
               {/* Label */}
               <div className="absolute top-12 w-24 text-center">
                 <p className={`text-xs font-bold mb-1 ${step.status === 'current' ? 'text-primary' : 'text-text-main'}`}>{step.label}</p>
                 <p className="text-[10px] text-text-muted">{step.date}</p>
               </div>
             </div>

             {/* Connector */}
             {index < steps.length - 1 && (
               <div className={`flex-1 h-[2px] -mt-10 mx-2 transition-colors ${step.status === 'completed' ? 'bg-green-500' : 'bg-border'}`}></div>
             )}
           </React.Fragment>
         ))}
       </div>
    </div>
  );
};

export default CustomerJourneyTimeline;
