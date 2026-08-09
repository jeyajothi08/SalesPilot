import React from 'react';
import { BarChart2, TrendingUp, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';

const emailData = [
  { name: 'Mon', open: 65, click: 28, reply: 12 },
  { name: 'Tue', open: 72, click: 35, reply: 15 },
  { name: 'Wed', open: 68, click: 30, reply: 14 },
  { name: 'Thu', open: 81, click: 42, reply: 22 },
  { name: 'Fri', open: 75, click: 38, reply: 18 },
  { name: 'Sat', open: 45, click: 15, reply: 5 },
  { name: 'Sun', open: 50, click: 18, reply: 8 },
];

const whatsappData = [
  { name: 'Mon', sent: 120, read: 115, replied: 45 },
  { name: 'Tue', sent: 150, read: 142, replied: 62 },
  { name: 'Wed', sent: 130, read: 125, replied: 50 },
  { name: 'Thu', sent: 200, read: 195, replied: 85 },
  { name: 'Fri', sent: 180, read: 170, replied: 70 },
  { name: 'Sat', sent: 80, read: 75, replied: 20 },
  { name: 'Sun', sent: 95, read: 90, replied: 25 },
];

const conversionData = [
  { name: 'Cold Outreach', value: 400 },
  { name: 'Opened', value: 300 },
  { name: 'Clicked', value: 150 },
  { name: 'Replied', value: 50 },
  { name: 'Meeting Booked', value: 20 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const DeliveryAnalytics = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" />
            Delivery Analytics
          </h2>
          <p className="text-sm text-text-muted mt-1">Deep dive into your communication performance and conversion rates.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select className="bg-bg-secondary border border-border text-sm font-bold rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50 text-text-main">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Overall Delivery" value="99.8%" trend="+0.2%" good />
        <MetricCard title="Avg. Open Rate" value="68.4%" trend="+4.1%" good />
        <MetricCard title="Avg. Click Rate" value="24.2%" trend="-1.5%" />
        <MetricCard title="Bounce Rate" value="0.8%" trend="-0.1%" good />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Email Performance */}
        <div className="glass-card bg-bg-secondary/50 rounded-3xl border border-border p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><Mail className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold text-text-main">Email Engagement</h3>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={emailData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)', color: 'var(--theme-text-main)' }} 
                  itemStyle={{ color: 'var(--theme-text-main)', fontSize: '14px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="open" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOpen)" name="Open Rate %" />
                <Area type="monotone" dataKey="click" stroke="#8b5cf6" strokeWidth={2} fillOpacity={0} name="Click Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WhatsApp Performance */}
        <div className="glass-card bg-bg-secondary/50 rounded-3xl border border-border p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><MessageSquare className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold text-text-main">WhatsApp Delivery</h3>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={whatsappData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'var(--theme-bg-primary)', opacity: 0.5}}
                  contentStyle={{ borderRadius: '16px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--theme-text-muted)', paddingTop: '10px' }} />
                <Bar dataKey="sent" fill="#10b981" radius={[4, 4, 0, 0]} name="Sent" maxBarSize={20} />
                <Bar dataKey="read" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Read" maxBarSize={20} />
                <Bar dataKey="replied" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Replied" maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="col-span-1 lg:col-span-2 glass-card bg-bg-secondary/50 rounded-3xl border border-border p-6">
           <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold text-text-main">Overall Funnel Conversion</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-8">
             {conversionData.map((step, idx) => (
                <React.Fragment key={step.name}>
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center mb-3 shadow-lg bg-bg-primary relative" style={{ borderColor: COLORS[idx % COLORS.length] }}>
                       <span className="text-xl font-bold text-text-main">{step.value}</span>
                    </div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{step.name}</p>
                  </div>
                  {idx < conversionData.length - 1 && (
                    <div className="hidden md:block h-[2px] bg-border flex-1 -mt-8 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-border rotate-45 bg-bg-primary"></div>
                    </div>
                  )}
                </React.Fragment>
             ))}
          </div>

        </div>

      </div>

    </div>
  );
};

const MetricCard = ({ title, value, trend, good }) => (
  <div className="p-4 rounded-2xl bg-bg-secondary border border-border hover:border-primary/30 transition-colors shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</p>
      {trend && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${good ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-text-main">{value}</h3>
  </div>
);

export default DeliveryAnalytics;
