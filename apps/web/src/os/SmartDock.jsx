import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, FileText, Settings, Search, Sparkles, Network } from 'lucide-react';

export const SmartDock = ({ onAppClick, openApps = [] }) => {
  const apps = [
    { id: 'copilot', label: 'AI Copilot', icon: <Sparkles className="w-5 h-5 text-yellow-400" />, color: 'bg-yellow-500/20' },
    { id: 'workflow', label: 'Automations', icon: <Network className="w-5 h-5 text-indigo-400" />, color: 'bg-indigo-500/20' },
    { id: 'crm', label: 'CRM', icon: <Users className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/20' },
    { id: 'analytics', label: 'Analytics', icon: <LayoutDashboard className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/20' },
    { id: 'voice', label: 'Voice Calls', icon: <MessageSquare className="w-5 h-5 text-green-400" />, color: 'bg-green-500/20' },
    { id: 'billing', label: 'Billing', icon: <FileText className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/20' },
    { id: 'proposals', label: 'Proposals', icon: <FileText className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/20' },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
    >
       <div className="flex items-end gap-3 px-4 py-3 bg-ds-surface/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <button className="group relative flex flex-col items-center justify-end mb-1" onClick={() => {
             // Simulate pressing Ctrl+K
             document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
          }}>
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors transform origin-bottom hover:scale-125 duration-200">
               <Search className="w-5 h-5 text-ds-text-primary" />
             </div>
             <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white bg-black/80 px-2 py-1 rounded-md whitespace-nowrap">
               Command Palette
             </span>
          </button>
          
          <div className="w-px h-10 bg-white/10 self-center mx-1"></div>

          {apps.map((app) => (
             <button 
               key={app.id}
               onClick={() => onAppClick(app.id)}
               className="group relative flex flex-col items-center justify-end"
             >
                <div className={`w-12 h-12 rounded-2xl ${app.color} border border-white/10 flex items-center justify-center transition-all transform origin-bottom hover:scale-125 duration-200 shadow-lg group-hover:shadow-xl`}>
                   {app.icon}
                </div>
                
                {/* Active Dot */}
                <div className={`h-1 w-1 rounded-full mt-1.5 transition-colors ${openApps.includes(app.id) ? 'bg-white' : 'bg-transparent'}`}></div>
                
                <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white bg-black/80 px-2 py-1 rounded-md whitespace-nowrap">
                  {app.label}
                </span>
             </button>
          ))}
          
          <div className="w-px h-10 bg-white/10 self-center mx-1"></div>

          <button 
             onClick={() => onAppClick('settings')}
             className="group relative flex flex-col items-center justify-end mb-1"
          >
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors transform origin-bottom hover:scale-125 duration-200 shadow-lg group-hover:shadow-xl">
               <Settings className="w-5 h-5 text-ds-text-secondary group-hover:text-white" />
             </div>
             
             {/* Active Dot */}
             <div className={`h-1 w-1 rounded-full mt-1.5 transition-colors ${openApps.includes('settings') ? 'bg-white' : 'bg-transparent'}`}></div>
             
             <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white bg-black/80 px-2 py-1 rounded-md whitespace-nowrap">
               Settings
             </span>
          </button>

       </div>
    </motion.div>
  );
};
