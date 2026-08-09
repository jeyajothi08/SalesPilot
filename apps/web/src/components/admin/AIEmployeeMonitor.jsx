import React from 'react';
import { Bot, PhoneCall, Headphones, Brain, Moon, WifiOff, Star, PhoneForwarded } from 'lucide-react';
import { motion } from 'framer-motion';

const agents = [
  { id: 1, name: 'Sales Agent Alpha', status: 'calling', calls: 142, meetings: 12, success: 8.5, rating: 4.8 },
  { id: 2, name: 'Support Agent Beta', status: 'listening', calls: 85, meetings: 0, success: 98, rating: 4.9 },
  { id: 3, name: 'Outbound Agent Gamma', status: 'thinking', calls: 210, meetings: 45, success: 21.4, rating: 4.6 },
  { id: 4, name: 'Qualifier Agent Delta', status: 'idle', calls: 0, meetings: 0, success: 0, rating: 0 },
  { id: 5, name: 'Billing Agent Epsilon', status: 'offline', calls: 12, meetings: 0, success: 100, rating: 5.0 },
];

const AIEmployeeMonitor = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-full">
      {agents.map((agent, index) => (
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: index * 0.1 }}
           key={agent.id} 
           className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
         >
            {/* Status Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500
               ${agent.status === 'calling' ? 'bg-blue-500' : 
                 agent.status === 'listening' ? 'bg-purple-500' : 
                 agent.status === 'thinking' ? 'bg-orange-500' : 
                 agent.status === 'idle' ? 'bg-green-500' : 'bg-gray-500'
               }
            `}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-bg-primary border border-border flex items-center justify-center shadow-sm">
                     <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                     <h3 className="font-bold text-text-main text-base group-hover:text-primary transition-colors">{agent.name}</h3>
                     <StatusBadge status={agent.status} />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <Metric icon={<PhoneForwarded className="w-4 h-4 text-text-muted" />} label="Calls" value={agent.calls} />
               <Metric icon={<Star className="w-4 h-4 text-text-muted" />} label="Rating" value={agent.rating > 0 ? `${agent.rating}/5` : 'N/A'} />
               <Metric label="Meetings Booked" value={agent.meetings} highlight />
               <Metric label="Success Rate" value={agent.success > 0 ? `${agent.success}%` : 'N/A'} />
            </div>
         </motion.div>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    calling: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <PhoneCall className="w-3 h-3 mr-1" /> },
    listening: { color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Headphones className="w-3 h-3 mr-1" /> },
    thinking: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: <Brain className="w-3 h-3 mr-1 animate-pulse" /> },
    idle: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <Moon className="w-3 h-3 mr-1" /> },
    offline: { color: 'text-text-muted', bg: 'bg-bg-primary', border: 'border-border', icon: <WifiOff className="w-3 h-3 mr-1" /> },
  };

  const { color, bg, border, icon } = config[status] || config.offline;

  return (
    <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${color} ${bg} ${border}`}>
       {icon}
       {status}
    </span>
  );
};

const Metric = ({ icon, label, value, highlight }) => (
  <div className="p-3 bg-bg-primary/50 rounded-xl border border-border/50">
     <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
        {icon}
        {label}
     </p>
     <p className={`text-xl font-extrabold ${highlight ? 'text-primary' : 'text-text-main'}`}>{value}</p>
  </div>
);

export default AIEmployeeMonitor;
