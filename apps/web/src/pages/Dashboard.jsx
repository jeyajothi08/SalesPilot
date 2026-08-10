import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Dashboard Components
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import StatCards from '../components/dashboard/StatCards';
import LiveAIStatus from '../components/dashboard/LiveAIStatus';
import LeadAnalytics from '../components/dashboard/LeadAnalytics';
import RecentCallsTable from '../components/dashboard/RecentCallsTable';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import AIInsights from '../components/dashboard/AIInsights';
import QuickActions from '../components/dashboard/QuickActions';

// Existing Pages (rendered as tabs)
import CallPage from '../components/CallPage';
import Customers from '../components/Customers';
import KnowledgeBase from '../components/KnowledgeBase';
import MeetingCenter from '../components/MeetingCenter';
import CommunicationCenter from '../components/CommunicationCenter';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar Shell */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Shell */}
      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
        
        {/* Sticky Header */}
        <TopHeader />

        {/* Dynamic Content Area */}
        <div className="p-4 sm:p-8 max-w-350 mx-auto min-h-[calc(100vh-6rem)]">
           
           {/* OVERVIEW DASHBOARD */}
           {activeTab === 'dashboard' && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               transition={{ duration: 0.5 }}
               className="space-y-6"
             >
                {/* 1. Quick Actions */}
                <QuickActions />

                {/* 2. Top Statistics */}
                <StatCards />

                {/* 3. Main Split Area: Lead Analytics & Live AI Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                   <LeadAnalytics />
                   <LiveAIStatus />
                </div>

                {/* 4. Second Split Area: Recent Calls Table & Calendar Widget */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                   <RecentCallsTable />
                   <div className="col-span-1 lg:col-span-1 h-100 lg:h-full">
                     <CalendarWidget />
                   </div>
                </div>

                {/* 5. Third Split Area: AI Insights & Activity Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                   <AIInsights />
                   <div className="col-span-1 lg:col-span-1 h-100 lg:h-full">
                     <ActivityTimeline />
                   </div>
                </div>

             </motion.div>
           )}
           
           {/* EXISTING UI SCREENS */}
           {activeTab === 'calls' && <CallPage />}
           {activeTab === 'customers' && <Customers />}
           {activeTab === 'kb' && <KnowledgeBase />}
           {activeTab === 'meetings' && <MeetingCenter />}
           {activeTab === 'communications' && <CommunicationCenter />}
           
           {/* PLACEHOLDER SCREENS */}
           {['reports', 'analytics', 'settings'].includes(activeTab) && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center justify-center h-[60vh] text-center"
             >
                <div className="w-24 h-24 mb-6 rounded-3xl bg-bg-primary shadow-sm border border-border flex items-center justify-center">
                  <span className="text-4xl">🚧</span>
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-2">Module Under Construction</h2>
                <p className="text-text-muted max-w-md">
                  The <span className="font-semibold text-primary capitalize">{activeTab.replace('-', ' ')}</span> module is currently being built by the engineering team. Check back soon!
                </p>
             </motion.div>
           )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
