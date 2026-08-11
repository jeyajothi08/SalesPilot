import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, LayoutDashboard, Phone, Users, Calendar, Mail, 
   BookOpen, BarChart2, PieChart, Settings, LogOut 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  
  const topMenu = [
    { id: 'dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { id: 'calls', icon: <Phone />, label: 'AI Calling' },
    { id: 'customers', icon: <Users />, label: 'Customers' },
    { id: 'meetings', icon: <Calendar />, label: 'Meetings' },
    { id: 'communications', icon: <Mail />, label: 'Communications' },
    { id: 'kb', icon: <BookOpen />, label: 'Knowledge Base' },
    { id: 'reports', icon: <BarChart2 />, label: 'Reports' },
    { id: 'analytics', icon: <PieChart />, label: 'Analytics' },
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-72 h-[calc(100vh-2rem)] m-4 glass-card bg-bg-primary/90 rounded-[24px] flex flex-col justify-between hidden lg:flex border border-border shadow-sm relative z-20 overflow-hidden"
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-24 flex items-center px-8 border-b border-border/50 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-purple p-0.5 mr-3 shadow-md shadow-primary/20">
             <div className="w-full h-full bg-bg-primary rounded-[10px] flex items-center justify-center">
               <Bot className="w-6 h-6 text-primary" />
             </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-text-main">SalesPilot</span>
        </div>
        
        <div className="p-4 space-y-1 mt-4 overflow-y-auto flex-1 custom-scrollbar">
          {topMenu.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-text-muted hover:bg-bg-secondary hover:text-text-main'
              }`}
            >
              <div className={`w-5 h-5 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-border/50 space-y-1 shrink-0 bg-bg-primary/50 backdrop-blur-md">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
             activeTab === 'settings'
               ? 'bg-primary text-white shadow-lg shadow-primary/30' 
               : 'text-text-muted hover:bg-bg-secondary hover:text-text-main'
          }`}
        >
          <div className={`w-5 h-5 transition-transform ${activeTab === 'settings' ? 'scale-110' : 'group-hover:scale-110'}`}>
             <Settings />
          </div>
          <span className="font-medium text-sm">Settings</span>
        </button>
        <Link to="/">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
            <div className="w-5 h-5 transition-transform group-hover:scale-110">
              <LogOut />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
