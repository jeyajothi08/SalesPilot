import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileText, Globe, MessageCircle, Briefcase, Zap, Search, Settings } from 'lucide-react';

import DataSourceManager from './knowledge/DataSourceManager';
import FAQBuilder from './knowledge/FAQBuilder';
import ServicesAndProducts from './knowledge/ServicesAndProducts';
import AITrainingPanel from './knowledge/AITrainingPanel';
import LiveAITest from './knowledge/LiveAITest';

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState('data-sources');

  const tabs = [
    { id: 'data-sources', label: 'Data Sources', icon: <FileText className="w-4 h-4" /> },
    { id: 'faqs', label: 'FAQ Builder', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'services', label: 'Services & Products', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'training', label: 'AI Training', icon: <Database className="w-4 h-4" /> },
    { id: 'testing', label: 'Live Testing', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto pb-12"
    >
      
      {/* Header & Description */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-main flex items-center">
          <Database className="w-8 h-8 mr-3 text-primary" />
          AI Knowledge Base
        </h1>
        <p className="text-sm text-text-muted mt-2 max-w-3xl font-medium">
          Train your AI Sales Employee with your specific company information. Upload documents, URLs, and services to ground responses in facts.
        </p>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
         <StatCard label="Knowledge Score" value="96%" trend="+2.4%" color="text-green-500" bg="bg-green-100 dark:bg-green-500/10" border="border-green-200 dark:border-green-500/20" />
         <StatCard label="PDF Documents" value="14" />
         <StatCard label="Website Pages" value="128" />
         <StatCard label="FAQs Trained" value="45" />
         <StatCard label="Services Listed" value="8" />
         <StatCard label="Last Trained" value="2 hrs ago" highlight />
      </div>

      {/* Main Tabbed Interface */}
      <div className="glass-card bg-bg-primary rounded-[32px] border border-border shadow-sm flex flex-col min-h-[700px] overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-bg-secondary/50 p-2 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-bg-primary text-primary shadow-sm border border-border'
                  : 'text-text-muted hover:text-text-main hover:bg-white/50 dark:hover:bg-bg-primary/50 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <div className="flex-1"></div>
          <button className="flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-bold text-text-muted hover:text-text-main transition-colors border border-transparent">
             <Settings className="w-4 h-4" />
             <span>Settings</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 md:p-8 bg-bg-primary overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'data-sources' && <DataSourceManager />}
              {activeTab === 'faqs' && <FAQBuilder />}
              {activeTab === 'services' && <ServicesAndProducts />}
              {activeTab === 'training' && <AITrainingPanel />}
              {activeTab === 'testing' && <LiveAITest />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
};

const StatCard = ({ label, value, trend, color, bg, border, highlight }) => (
  <div className={`p-4 rounded-2xl flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-md ${highlight ? 'bg-primary/5 border border-primary/20' : bg ? `${bg} border ${border}` : 'bg-bg-secondary border border-border'}`}>
     <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">{label}</p>
     <div className="flex items-baseline space-x-2">
       <h3 className={`text-2xl font-bold tracking-tight ${highlight ? 'text-primary' : color || 'text-text-main'}`}>{value}</h3>
       {trend && <span className="text-xs font-bold text-green-500">{trend}</span>}
     </div>
  </div>
);

export default KnowledgeBase;
