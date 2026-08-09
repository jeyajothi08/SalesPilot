import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Activity, CreditCard, ShieldCheck, Search, Bell } from 'lucide-react';

import AIEmployeeMonitor from './admin/AIEmployeeMonitor';
import TeamAndAccess from './admin/TeamAndAccess';
import SystemHealthAndAPIs from './admin/SystemHealthAndAPIs';
import BusinessMetrics from './admin/BusinessMetrics';
import SecurityAndBackup from './admin/SecurityAndBackup';
import SubscriptionAndSettings from './admin/SubscriptionAndSettings';
import GlobalSearchModal from './admin/GlobalSearchModal';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'team', label: 'Team & Access', icon: <Users className="w-4 h-4" /> },
  { id: 'system', label: 'System & APIs', icon: <Activity className="w-4 h-4" /> },
  { id: 'billing', label: 'Billing & Settings', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
];

const AdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut CMD+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
               <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            Admin Control Center
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-3xl font-medium">
            Manage your AI workforce, user permissions, business revenue, and system health from one intelligent dashboard.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 bg-bg-secondary border border-border rounded-xl text-text-muted hover:text-text-main hover:border-primary/50 transition-colors shadow-sm w-64"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-bold flex-1 text-left">Search anything...</span>
            <div className="flex items-center gap-1 text-[10px] font-bold">
               <span className="px-1.5 py-0.5 bg-bg-primary rounded border border-border">CMD</span>
               <span className="px-1.5 py-0.5 bg-bg-primary rounded border border-border">K</span>
            </div>
          </button>

          <button className="p-3 bg-bg-secondary border border-border rounded-xl text-text-muted hover:text-primary transition-colors relative shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-bg-primary"></span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-card bg-bg-primary/80 backdrop-blur-xl rounded-[32px] border border-border/50 shadow-xl flex flex-col min-h-[750px] overflow-hidden relative">
        
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
                    layoutId="adminTabIndicator"
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
              {activeTab === 'overview' && (
                <div className="space-y-6 h-full flex flex-col">
                  {/* Top Stats specific to Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <StatCard label="Total Customers" value="1,248" />
                     <StatCard label="Online AI Agents" value="5" color="text-green-500" highlight />
                     <StatCard label="Revenue (MRR)" value="$45,000" />
                     <StatCard label="Monthly Growth" value="+40.6%" color="text-primary" />
                  </div>
                  <div className="flex-1">
                     <AIEmployeeMonitor />
                  </div>
                </div>
              )}

              {activeTab === 'team' && <TeamAndAccess />}
              
              {activeTab === 'system' && (
                <div className="space-y-6 h-full flex flex-col">
                  <div className="flex-1">
                    <SystemHealthAndAPIs />
                  </div>
                  <div className="h-[300px]">
                    <BusinessMetrics />
                  </div>
                </div>
              )}

              {activeTab === 'billing' && <SubscriptionAndSettings />}
              
              {activeTab === 'security' && <SecurityAndBackup />}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

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

export default AdminControlCenter;
