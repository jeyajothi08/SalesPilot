import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Users, Flame, Calendar, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const dummyData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 40 }, { value: 30 }, { value: 60 }
];

const StatCard = ({ title, value, description, trend, icon, color, delay }) => {
  const isPositive = trend.startsWith('+');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="glass-card bg-bg-primary p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Background Gradient Blob */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-40 ${color}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl bg-bg-secondary ${color.replace('bg-', 'text-')} shadow-sm border border-border`}>
          {icon}
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
          {trend}
        </span>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-text-main mb-1">{value}</h2>
        <h4 className="text-text-main font-semibold text-sm mb-1">{title}</h4>
        <p className="text-text-muted text-xs">{description}</p>
      </div>

      {/* Mini Trend Graph */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyData}>
            <Area type="monotone" dataKey="value" stroke={isPositive ? '#10B981' : '#EF4444'} fill={isPositive ? '#10B981' : '#EF4444'} fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const StatCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      <StatCard title="Total Calls Today" value="1,284" description="vs 1,020 yesterday" trend="+25.8%" icon={<PhoneCall />} color="bg-blue-500" delay={0.1} />
      <StatCard title="Total Customers" value="45,210" description="Active subscriptions" trend="+12.5%" icon={<Users />} color="bg-purple-500" delay={0.2} />
      <StatCard title="Hot Leads" value="384" description="Requires attention" trend="+42.1%" icon={<Flame />} color="bg-orange-500" delay={0.3} />
      <StatCard title="Meetings Booked" value="142" description="For the next 7 days" trend="+8.2%" icon={<Calendar />} color="bg-pink-500" delay={0.4} />
      <StatCard title="Revenue Generated" value="$12.4k" description="Estimated from bookings" trend="+15.3%" icon={<DollarSign />} color="bg-emerald-500" delay={0.5} />
      <StatCard title="AI Performance" value="98.2%" description="Avg. call success score" trend="+1.2%" icon={<Activity />} color="bg-indigo-500" delay={0.6} />
    </div>
  );
};

export default StatCards;
