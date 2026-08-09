import React from 'react';
import { ShieldAlert, Lightbulb } from 'lucide-react';

const objections = [
  { id: 1, type: 'Too Expensive', context: 'Customer mentioned budget constraints for Q4.', response: 'Highlight the ROI and time saved by automation. Offer flexible payment terms if necessary.' },
  { id: 2, type: 'Need Approval', context: 'Requires sign-off from VP of Engineering.', response: 'Offer to host a technical demo specifically for the engineering team to address concerns directly.' },
];

const ObjectionHandling = () => {
  return (
    <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 h-full shadow-sm flex flex-col">
       <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
         <ShieldAlert className="w-4 h-4 text-red-500" />
         Objection Analysis
       </h3>

       <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
         {objections.map(obj => (
           <div key={obj.id} className="p-4 bg-bg-primary border border-border rounded-2xl relative overflow-hidden group">
             
             {/* Subtle red warning accent */}
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50"></div>
             
             <div className="pl-2 mb-3">
               <h4 className="font-bold text-text-main text-sm mb-1">{obj.type}</h4>
               <p className="text-xs text-text-muted">{obj.context}</p>
             </div>

             <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3 mt-2">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">AI Suggestion</p>
                  <p className="text-xs font-medium text-text-main">{obj.response}</p>
                </div>
             </div>

           </div>
         ))}
       </div>
    </div>
  );
};

export default ObjectionHandling;
