import React from 'react';
import { Flame, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const LeadScoringAndPrediction = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Lead Score Card */}
      <div className="glass-card bg-gradient-to-br from-orange-500/10 to-bg-secondary rounded-3xl border border-orange-500/20 p-6 shadow-sm relative overflow-hidden flex-1">
         <div className="absolute top-0 right-0 p-4 opacity-10">
           <Flame className="w-32 h-32 text-orange-500" />
         </div>

         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2 relative z-10">Lead Classification</h3>
         <div className="flex items-baseline gap-2 mb-4 relative z-10">
            <h2 className="text-4xl font-extrabold text-orange-500 tracking-tight">Hot Lead</h2>
            <span className="text-sm font-bold text-text-muted">98/100</span>
         </div>
         
         <div className="space-y-3 relative z-10">
            <div className="p-3 bg-bg-primary/50 backdrop-blur-sm rounded-xl border border-border">
               <p className="text-xs font-bold text-text-muted mb-1">Reasoning</p>
               <p className="text-sm font-medium text-text-main">High engagement on pricing page, positive sentiment during call, matches ideal customer profile.</p>
            </div>
         </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-2 gap-4 flex-1">
         <PredictionCard 
           icon={<TrendingUp className="w-5 h-5 text-green-500" />}
           label="Close Probability"
           value="85%"
           subtext="Highly Likely"
           color="green"
         />
         <PredictionCard 
           icon={<Activity className="w-5 h-5 text-blue-500" />}
           label="Expected Rev"
           value="$12,500"
           subtext="Annual ARR"
           color="blue"
         />
         <PredictionCard 
           icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />}
           label="Risk Level"
           value="Low"
           subtext="Budget Approved"
           color="yellow"
         />
         <PredictionCard 
           icon={<Flame className="w-5 h-5 text-primary" />}
           label="Priority"
           value="High"
           subtext="Action Required"
           color="primary"
         />
      </div>

    </div>
  );
};

const PredictionCard = ({ icon, label, value, subtext, color }) => {
  const bgMap = {
    green: 'bg-green-500/5 border-green-500/20',
    blue: 'bg-blue-500/5 border-blue-500/20',
    yellow: 'bg-yellow-500/5 border-yellow-500/20',
    primary: 'bg-primary/5 border-primary/20',
  };

  return (
    <div className={`rounded-2xl border p-4 flex flex-col justify-between ${bgMap[color]}`}>
      <div className="flex justify-between items-start mb-2">
         {icon}
         <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">{label}</span>
      </div>
      <div>
         <h4 className="text-xl font-extrabold text-text-main tracking-tight">{value}</h4>
         <p className="text-[11px] font-medium text-text-muted mt-0.5">{subtext}</p>
      </div>
    </div>
  );
};

export default LeadScoringAndPrediction;
