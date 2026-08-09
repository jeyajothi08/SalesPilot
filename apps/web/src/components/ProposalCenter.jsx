import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, LayoutDashboard, BarChart2 } from 'lucide-react';

import ProposalDashboard from './proposals/ProposalDashboard';
import ProposalBuilder from './proposals/ProposalBuilder';
import ProposalAnalytics from './proposals/ProposalAnalytics';

const tabs = [
  { id: 'dashboard', label: 'Proposals', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
];

const ProposalCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBuilding, setIsBuilding] = useState(false); // Controls the Wizard View

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
               <FileText className="w-6 h-6 text-primary" />
            </div>
            Proposal & Quotation Center
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-3xl font-medium">
            Generate beautiful, AI-powered client proposals and quotations in seconds.
          </p>
        </div>
      </div>

      {!isBuilding && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           <StatCard label="Total Proposals" value="142" />
           <StatCard label="Accepted" value="86" color="text-green-500" highlight />
           <StatCard label="Pending" value="24" color="text-yellow-500" />
           <StatCard label="Rejected" value="32" color="text-red-500" />
           <StatCard label="Pipeline Revenue" value="$420k" />
           <StatCard label="Conversion Rate" value="60.5%" trend="+2.4%" />
        </div>
      )}

      {/* Main Container */}
      <div className={`glass-card bg-bg-primary/80 backdrop-blur-xl rounded-[32px] border border-border/50 shadow-xl flex flex-col ${isBuilding ? 'min-h-[800px]' : 'min-h-[600px]'} overflow-hidden relative transition-all duration-500`}>
        
        {/* Navigation Tabs (Hide if building) */}
        {!isBuilding && (
          <div className="flex border-b border-border/50 bg-bg-secondary/30 p-2 relative z-10">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'text-primary shadow-sm border border-primary/20 bg-primary/5'
                      : 'text-text-muted hover:text-text-main hover:bg-white/50 dark:hover:bg-bg-secondary/50 border border-transparent'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="proposalTabIndicator"
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
        )}

        {/* Tab Content Area */}
        <div className={`flex-1 ${isBuilding ? 'p-0' : 'p-6 md:p-8'} overflow-hidden relative z-0`}>
          <AnimatePresence mode="wait">
            
            {isBuilding ? (
              <motion.div
                key="builder"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ProposalBuilder onCancel={() => setIsBuilding(false)} />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                {activeTab === 'dashboard' && <ProposalDashboard onCreate={() => setIsBuilding(true)} />}
                {activeTab === 'analytics' && <ProposalAnalytics />}
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

      </div>

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

export default ProposalCenter;
