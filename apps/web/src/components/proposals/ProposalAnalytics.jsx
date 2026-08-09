import React from 'react';
import { Target, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const pipelineData = [
  { name: 'Jan', revenue: 15000, proposals: 12 },
  { name: 'Feb', revenue: 22000, proposals: 18 },
  { name: 'Mar', revenue: 18000, proposals: 15 },
  { name: 'Apr', revenue: 35000, proposals: 25 },
  { name: 'May', revenue: 28000, proposals: 22 },
  { name: 'Jun', revenue: 42000, proposals: 30 },
];

const serviceData = [
  { name: 'Web Dev', value: 45 },
  { name: 'React App', value: 30 },
  { name: 'AI Bots', value: 15 },
  { name: 'SEO', value: 10 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

const ProposalAnalytics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* Pipeline Growth */}
      <div className="lg:col-span-2 glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col min-h-[350px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Proposal Pipeline Value
          </h3>
          <select className="bg-bg-primary border border-border text-xs font-bold rounded-lg px-3 py-1.5 text-text-main focus:outline-none">
             <option>Last 6 Months</option>
             <option>This Year</option>
          </select>
        </div>
        
        <div className="flex-1 w-full -ml-4">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" strokeOpacity={0.5} />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
               <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }} 
                 itemStyle={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}
                 formatter={(value) => [`$${value}`, 'Pipeline Value']}
               />
               <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPipeline)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Top Services */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col min-h-[350px]">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
          <PieChartIcon className="w-4 h-4 text-purple-500" />
          Top Selling Services
        </h3>
        
        <div className="flex-1 w-full flex items-center justify-center">
           <ResponsiveContainer width="100%" height={200}>
             <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
               <XAxis type="number" hide />
               <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-main)', fontSize: 12, fontWeight: 'bold'}} width={80} />
               <Tooltip 
                 cursor={{fill: 'transparent'}}
                 contentStyle={{ borderRadius: '12px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }} 
               />
               <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                 {serviceData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ProposalAnalytics;
