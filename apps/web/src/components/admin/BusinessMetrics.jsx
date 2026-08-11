import React from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Jan', rev: 12000 },
  { name: 'Feb', rev: 19000 },
  { name: 'Mar', rev: 15000 },
  { name: 'Apr', rev: 28000 },
  { name: 'May', rev: 32000 },
  { name: 'Jun', rev: 45000 },
];

const customerGrowthData = [
  { name: 'Jan', new: 120, churn: 10 },
  { name: 'Feb', new: 180, churn: 15 },
  { name: 'Mar', new: 150, churn: 20 },
  { name: 'Apr', new: 250, churn: 12 },
  { name: 'May', new: 310, churn: 18 },
  { name: 'Jun', new: 420, churn: 25 },
];

const BusinessMetrics = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Revenue Chart */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              MRR Growth
            </h3>
            <h2 className="text-3xl font-extrabold text-text-main">$45,000 <span className="text-sm font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg ml-2">+40.6%</span></h2>
          </div>
          <select className="bg-bg-primary border border-border text-xs font-bold rounded-lg px-3 py-1.5 text-text-main focus:outline-none">
             <option>Last 6 Months</option>
             <option>This Year</option>
             <option>All Time</option>
          </select>
        </div>
        
        <div className="flex-1 w-full min-h-[200px]">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <defs>
                 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" strokeOpacity={0.5} />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }} 
                 itemStyle={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}
                 formatter={(value) => [`$${value}`, 'Revenue']}
               />
               <Area type="monotone" dataKey="rev" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Growth */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-500" />
            Customer Growth & Churn
          </h3>
        </div>
        
        <div className="flex-1 w-full min-h-[200px]">
           <ResponsiveContainer width="100%" height="100%">
             <RechartsBarChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" strokeOpacity={0.5} />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
               <Tooltip 
                 cursor={{fill: 'var(--theme-bg-primary)', opacity: 0.5}}
                 contentStyle={{ borderRadius: '12px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }} 
               />
               <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Customers" maxBarSize={30} />
               <Bar dataKey="churn" fill="#ef4444" radius={[4, 4, 0, 0]} name="Churned" maxBarSize={30} />
             </RechartsBarChart>
           </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default BusinessMetrics;
