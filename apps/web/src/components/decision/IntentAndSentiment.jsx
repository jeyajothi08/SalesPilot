import React from 'react';
import { Target, HeartPulse } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

const sentimentData = [
  { time: '0:00', score: 50 },
  { time: '1:00', score: 60 },
  { time: '2:00', score: 45 },
  { time: '3:00', score: 70 },
  { time: '4:00', score: 85 },
  { time: '5:00', score: 80 },
  { time: '6:00', score: 95 },
];

const IntentAndSentiment = () => {
  const currentIntent = "Interested";
  const intentConfidence = 92;
  const currentSentiment = "Excited";

  const intentOptions = [
    { label: 'Interested', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    { label: 'Just Browsing', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { label: 'Price Sensitive', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    { label: 'Urgent', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Intent Analysis */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm relative overflow-hidden">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-4">
          <Target className="w-4 h-4" />
          Real-Time Intent
        </h3>
        
        <div className="flex items-end gap-3 mb-6">
          <h2 className="text-4xl font-extrabold text-text-main tracking-tight">{currentIntent}</h2>
          <span className="text-sm font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg mb-1 border border-green-500/20">{intentConfidence}% Match</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {intentOptions.map(opt => (
            <div key={opt.label} className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${opt.label === currentIntent ? `${opt.bg} ${opt.color} ${opt.border} shadow-sm` : 'bg-bg-primary text-text-muted border-border'}`}>
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-pink-500" />
            Sentiment Flow
          </h3>
          <span className="text-xs font-bold text-pink-500 bg-pink-500/10 border border-pink-500/20 px-2 py-1 rounded-lg">{currentSentiment}</span>
        </div>
        
        <div className="flex-1 min-h-[120px] w-full -ml-4">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={sentimentData}>
               <defs>
                 <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                   <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }} 
                 itemStyle={{ color: '#ec4899', fontSize: '12px', fontWeight: 'bold' }}
               />
               <Area type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default IntentAndSentiment;
