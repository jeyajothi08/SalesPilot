import React from 'react';
import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const funnelData = [
  { name: 'Leads', value: 1200 },
  { name: 'Contacted', value: 850 },
  { name: 'Meetings', value: 420 },
  { name: 'Proposals', value: 210 },
  { name: 'Closed Won', value: 95 },
];

const DecisionAnalytics = () => {
  return (
    <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 h-full shadow-sm flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
           <BarChart2 className="w-4 h-4 text-primary" />
           Funnel Analytics
         </h3>
         <select className="bg-bg-primary border border-border text-xs font-bold rounded-lg px-2 py-1 text-text-main focus:outline-none">
           <option>This Month</option>
           <option>Last Quarter</option>
         </select>
       </div>

       <div className="flex-1 min-h-[200px] w-full">
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--theme-border)" strokeOpacity={0.5} />
             <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 10}} />
             <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-main)', fontSize: 12, fontWeight: 'bold'}} />
             <Tooltip 
               cursor={{fill: 'var(--theme-bg-primary)', opacity: 0.5}}
               contentStyle={{ borderRadius: '12px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)', backdropFilter: 'blur(10px)' }} 
             />
             <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
           </BarChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
};

export default DecisionAnalytics;
