import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, MessageSquare, FileText, Settings, Sparkles, LogOut } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, active: true },
  { id: 'crm', label: 'CRM Pipeline', icon: <Users className="w-5 h-5" />, badge: 'New' },
  { id: 'voice', label: 'Voice Agents', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'proposals', label: 'Proposals', icon: <FileText className="w-5 h-5" /> },
];

export const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-ds-surface border-r border-ds-border flex flex-col fixed left-0 top-0 overflow-y-auto custom-scrollbar z-40">
       
       {/* Logo Area */}
       <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-ds-primary flex items-center justify-center shadow-ds-glow-primary">
             <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-ds-text-primary">SalesPilot</span>
       </div>

       {/* Navigation */}
       <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="px-2 text-[10px] font-bold text-ds-text-tertiary uppercase tracking-wider mb-2">Main Menu</div>
          {menuItems.map(item => (
            <button 
              key={item.id} 
              className={`
                w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group cursor-not-allowed
                ${item.active ? 'text-ds-accent bg-ds-accent-glass' : 'text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-surface-hover'}
              `}
              disabled
            >
               {item.active && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 top-2 bottom-2 w-1 bg-ds-accent rounded-r-full" />
               )}
               <div className="flex items-center gap-3">
                 {item.icon}
                 <span>{item.label}</span>
               </div>
               {item.badge && (
                 <span className="px-1.5 py-0.5 rounded-md bg-ds-success-bg text-ds-success text-[9px] font-bold uppercase tracking-wider">
                   {item.badge}
                 </span>
               )}
            </button>
          ))}

          <div className="px-2 text-[10px] font-bold text-ds-text-tertiary uppercase tracking-wider mb-2 mt-8">System</div>
          <button disabled className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-surface-hover transition-all cursor-not-allowed">
             <Settings className="w-5 h-5" />
             <span>Settings</span>
          </button>
       </nav>

       {/* User Profile */}
       <div className="p-4 border-t border-ds-border m-4 rounded-xl bg-ds-surface-hover flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
               JD
             </div>
             <div>
                <p className="text-sm font-bold text-ds-text-primary leading-tight">John Doe</p>
                <p className="text-xs text-ds-text-tertiary font-medium">Admin</p>
             </div>
          </div>
          <button className="text-ds-text-tertiary hover:text-ds-danger transition-colors p-1">
             <LogOut className="w-4 h-4" />
          </button>
       </div>

    </div>
  );
};
