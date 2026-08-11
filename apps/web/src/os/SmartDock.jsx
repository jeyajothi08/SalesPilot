import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, FileText, Settings, Search, Sparkles, Network } from 'lucide-react';

export const SmartDock = ({ onAppClick, openApps = [] }) => {
  const apps = [
    { id: 'copilot', label: 'AI Copilot', icon: <Sparkles className="w-4 h-4 text-blue-400" />, color: 'bg-blue-500/20' },
    { id: 'workflow', label: 'Automations', icon: <Network className="w-4 h-4 text-cyan-400" />, color: 'bg-cyan-500/20' },
    { id: 'crm', label: 'CRM', icon: <Users className="w-4 h-4 text-blue-400" />, color: 'bg-blue-500/20' },
    { id: 'analytics', label: 'Analytics', icon: <LayoutDashboard className="w-4 h-4 text-blue-300" />, color: 'bg-blue-600/20' },
    { id: 'voice', label: 'Voice Calls', icon: <MessageSquare className="w-4 h-4 text-blue-400" />, color: 'bg-blue-500/20' },
    { id: 'billing', label: 'Billing', icon: <FileText className="w-4 h-4 text-cyan-400" />, color: 'bg-cyan-500/20' },
    { id: 'proposals', label: 'Proposals', icon: <FileText className="w-4 h-4 text-blue-400" />, color: 'bg-blue-500/20' },
  ];

  return (
    <motion.div 
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-100"
    >
       <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl">
          
          <button className="group relative flex flex-col items-center" onClick={() => {
             document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
          }}>
             <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110">
               <Search className="w-4 h-4 text-white/80" />
             </div>
             <span className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-black/90 px-2 py-0.5 rounded whitespace-nowrap">
               Search (⌘K)
             </span>
          </button>
          
          <div className="w-px h-6 bg-white/10 mx-0.5"></div>

          {apps.map((app) => (
             <button 
               key={app.id}
               onClick={() => onAppClick(app.id)}
               className="group relative flex flex-col items-center"
             >
                <div className={`w-9 h-9 rounded-xl ${app.color} border border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-sm`}>
                   {app.icon}
                </div>
                
                {/* Active Dot */}
                <div className={`h-1 w-1 rounded-full mt-1 transition-colors ${openApps.includes(app.id) ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                
                <span className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-black/90 px-2 py-0.5 rounded whitespace-nowrap">
                  {app.label}
                </span>
             </button>
          ))}
          
          <div className="w-px h-6 bg-white/10 mx-0.5"></div>

          <button 
             onClick={() => onAppClick('settings')}
             className="group relative flex flex-col items-center"
          >
             <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110">
               <Settings className="w-4 h-4 text-white/80 group-hover:text-white" />
             </div>
             
             {/* Active Dot */}
             <div className={`h-1 w-1 rounded-full mt-1 transition-colors ${openApps.includes('settings') ? 'bg-blue-400' : 'bg-transparent'}`}></div>
             
             <span className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-black/90 px-2 py-0.5 rounded whitespace-nowrap">
               Settings
             </span>
          </button>

       </div>
    </motion.div>
  );
};
