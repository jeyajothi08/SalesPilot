import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Zap, Target, Users, Settings, BarChart2, Bell } from 'lucide-react';

import EmailDashboard from './communication/EmailDashboard';
import WhatsAppDashboard from './communication/WhatsAppDashboard';
import AutomationFlowBuilder from './communication/AutomationFlowBuilder';
import MessageComposer from './communication/MessageComposer';
import Campaigns from './communication/Campaigns';
import ContactList from './communication/ContactList';
import DeliveryAnalytics from './communication/DeliveryAnalytics';

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'workflows', label: 'Automations', icon: <Zap className="w-4 h-4" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target className="w-4 h-4" /> },
    { id: 'contacts', label: 'Contacts', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto pb-12 relative"
    >
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mr-3 border border-primary/20 shadow-inner">
               <Mail className="w-6 h-6 text-primary" />
            </div>
            Communication Center
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-3xl font-medium">
            Manage all email and WhatsApp conversations, campaigns, and automation rules from one premium dashboard.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-bg-secondary border border-border rounded-xl text-text-muted hover:text-primary transition-colors relative shadow-sm"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-bg-primary"></span>
          </button>

          <button 
            onClick={() => setIsComposerOpen(true)}
            className="px-6 py-3 btn-primary flex justify-center items-center gap-2 font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
          >
            <Zap className="w-4 h-4" />
            AI Message Generator
          </button>
        </div>
      </div>

      {/* Top Unified Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
         <StatCard label="Emails Sent Today" value="4,281" color="text-primary" />
         <StatCard label="WhatsApp Sent" value="1,842" color="text-green-500" />
         <StatCard label="Delivery Rate" value="99.8%" trend="+0.2%" />
         <StatCard label="Open Rate" value="64.2%" trend="+5.1%" />
         <StatCard label="Reply Rate" value="28.4%" />
         <StatCard label="AI Response Rate" value="95%" highlight />
      </div>

      {/* Main Tabbed Interface */}
      <div className="glass-card bg-bg-primary/80 backdrop-blur-xl rounded-[32px] border border-border/50 shadow-xl flex flex-col min-h-[700px] overflow-hidden relative">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-border/50 bg-bg-secondary/30 p-2 overflow-x-auto custom-scrollbar relative z-10">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap overflow-hidden ${
                  activeTab === tab.id
                    ? 'text-primary shadow-sm border border-primary/20 bg-primary/5'
                    : 'text-text-muted hover:text-text-main hover:bg-white/50 dark:hover:bg-bg-secondary/50 border border-transparent'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1"></div>
          <button className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold text-text-muted hover:text-text-main transition-colors border border-transparent">
             <Settings className="w-4 h-4" />
             <span>Settings</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'email' && <EmailDashboard onCompose={() => setIsComposerOpen(true)} />}
              {activeTab === 'whatsapp' && <WhatsAppDashboard onCompose={() => setIsComposerOpen(true)} />}
              {activeTab === 'workflows' && <AutomationFlowBuilder />}
              {activeTab === 'campaigns' && <Campaigns />}
              {activeTab === 'contacts' && <ContactList />}
              {activeTab === 'analytics' && <DeliveryAnalytics />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Message Composer Modal */}
      <AnimatePresence>
        {isComposerOpen && <MessageComposer onClose={() => setIsComposerOpen(false)} />}
      </AnimatePresence>

      {/* Floating Notifications Panel (Mock) */}
      <AnimatePresence>
        {showNotifications && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: -10 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: -10 }}
             className="absolute top-20 right-0 w-80 bg-bg-secondary/90 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-4 z-50 overflow-hidden"
           >
             <h3 className="font-bold text-text-main mb-3 px-2">Recent Activity</h3>
             <div className="space-y-2">
               {[
                 { msg: 'Email to Alice opened.', time: '2m ago', type: 'email' },
                 { msg: 'WhatsApp to TechNova read.', time: '5m ago', type: 'whatsapp' },
                 { msg: 'Campaign Q3 Finished.', time: '1h ago', type: 'campaign' }
               ].map((n, i) => (
                 <div key={i} className="p-3 bg-bg-primary/50 hover:bg-bg-primary rounded-xl text-sm transition-colors border border-transparent hover:border-border cursor-pointer">
                   <p className="font-medium text-text-main">{n.msg}</p>
                   <p className="text-xs text-text-muted mt-1">{n.time}</p>
                 </div>
               ))}
             </div>
           </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

const StatCard = ({ label, value, trend, color, highlight }) => (
  <div className={`p-5 rounded-3xl flex flex-col justify-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl relative overflow-hidden ${highlight ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30' : 'bg-bg-secondary/80 backdrop-blur-md border border-border/60 hover:border-border'}`}>
     
     {highlight && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[30px] rounded-full -mr-10 -mt-10"></div>
     )}

     <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 relative z-10">{label}</p>
     <div className="flex items-end justify-between relative z-10">
       <h3 className={`text-3xl font-extrabold tracking-tight ${highlight ? 'text-primary' : color || 'text-text-main'}`}>{value}</h3>
       {trend && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md mb-1">{trend}</span>}
     </div>
  </div>
);

export default CommunicationCenter;
