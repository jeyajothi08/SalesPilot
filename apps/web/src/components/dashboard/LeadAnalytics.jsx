import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', calls: 400, conversions: 240, revenue: 2400 },
  { name: 'Tue', calls: 300, conversions: 139, revenue: 1390 },
  { name: 'Wed', calls: 550, conversions: 380, revenue: 3800 },
  { name: 'Thu', calls: 450, conversions: 290, revenue: 2900 },
  { name: 'Fri', calls: 600, conversions: 480, revenue: 4800 },
  { name: 'Sat', calls: 200, conversions: 120, revenue: 1200 },
  { name: 'Sun', calls: 150, conversions: 80, revenue: 800 },
];

const LeadAnalytics = () => {
  const [metric, setMetric] = useState('calls');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-2 glass-card bg-bg-primary p-6 relative overflow-hidden h-full flex flex-col"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
           <h2 className="text-lg font-bold text-text-main tracking-tight">Lead Analytics</h2>
           <p className="text-sm text-text-muted mt-1">Weekly performance metrics and conversions</p>
        </div>
        
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-border">
           <button 
             onClick={() => setMetric('calls')}
             className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${metric === 'calls' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             Calls
           </button>
           <button 
             onClick={() => setMetric('conversions')}
             className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${metric === 'conversions' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             Conversions
           </button>
           <button 
             onClick={() => setMetric('revenue')}
             className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${metric === 'revenue' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             Revenue
           </button>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric === 'revenue' ? '#10B981' : metric === 'conversions' ? '#9333EA' : '#2563EB'} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={metric === 'revenue' ? '#10B981' : metric === 'conversions' ? '#9333EA' : '#2563EB'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: 'var(--theme-text-main)', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey={metric} 
              stroke={metric === 'revenue' ? '#10B981' : metric === 'conversions' ? '#9333EA' : '#2563EB'} 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorMetric)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LeadAnalytics;
