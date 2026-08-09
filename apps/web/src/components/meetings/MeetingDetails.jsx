import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Video, Clock, MapPin, Users, Phone, FileText, CheckCircle, ExternalLink, Calendar as CalIcon, Settings, Target } from 'lucide-react';

const MeetingDetails = ({ meeting, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-bg-primary glass-card border border-border rounded-xl text-sm font-medium text-text-muted hover:text-text-main flex items-center transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calendar
        </button>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-sm font-bold text-text-main hover:bg-border transition-colors">
            Reschedule
          </button>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 flex items-center transition-colors">
            <Video className="w-4 h-4 mr-2" /> Join Meeting
          </button>
        </div>
      </div>

      {/* Meeting Header Card */}
      <div className="glass-card bg-bg-primary p-6 md:p-8 rounded-[32px] border border-border shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

         <div className="flex-1 z-10">
           <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-primary/10 text-primary border-primary/20 flex items-center`}>
                <Video className="w-3.5 h-3.5 mr-1.5" /> {meeting.type || 'Virtual'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-green-500/10 text-green-500 border-green-500/20 flex items-center`}>
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Confirmed
              </span>
           </div>
           
           <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">{meeting.title}</h1>
           
           <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center text-text-muted">
                <CalIcon className="w-5 h-5 mr-2 text-primary" />
                <span className="font-semibold text-text-main">October 24, 2026</span>
              </div>
              <div className="flex items-center text-text-muted">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                <span className="font-semibold text-text-main">{meeting.time} (45 mins)</span>
              </div>
              <div className="flex items-center text-text-muted">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                <span className="font-semibold text-text-main">Michael Scott</span>
              </div>
           </div>
         </div>

         {/* CRM Snapshot */}
         <div className="w-full md:w-72 bg-bg-secondary p-5 rounded-2xl border border-border z-10 flex flex-col justify-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Customer Snapshot</h3>
            <div className="flex items-center space-x-3 mb-4">
              <img src="https://ui-avatars.com/api/?name=Michael+Scott&background=2563EB&color=fff" className="w-10 h-10 rounded-full border border-border" alt="avatar" />
              <div>
                <p className="font-bold text-sm text-text-main">Michael Scott</p>
                <p className="text-xs font-medium text-text-muted">Dunder Mifflin</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
               <span className="text-text-muted font-medium">Lead Score</span>
               <span className="font-bold text-green-500">92 (Hot)</span>
            </div>
            <button className="w-full py-2 bg-white dark:bg-bg-primary border border-border rounded-lg text-xs font-bold text-text-main hover:text-primary transition-colors flex justify-center items-center">
               View Full Profile <ExternalLink className="w-3 h-3 ml-1" />
            </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border overflow-x-auto custom-scrollbar pb-1">
        {['overview', 'agenda', 'ai-insights', 'documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main hover:border-border'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
         {activeTab === 'overview' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="glass-card bg-bg-primary p-6 rounded-3xl border border-border">
                <h3 className="text-lg font-bold text-text-main flex items-center mb-4">
                  <FileText className="w-5 h-5 mr-2 text-primary" /> Meeting Context
                </h3>
                <p className="text-sm text-text-main/80 font-medium leading-relaxed bg-bg-secondary p-4 rounded-2xl border border-border">
                  Michael requested this demo after receiving our automated pricing proposal via email yesterday. He is primarily interested in the AI Chatbot integration and wants to understand the deployment timeline for his enterprise setup.
                </p>
              </div>

              <div className="glass-card bg-bg-primary p-6 rounded-3xl border border-border">
                <h3 className="text-lg font-bold text-text-main flex items-center mb-4">
                  <Settings className="w-5 h-5 mr-2 text-accent-purple" /> Automation Status
                </h3>
                <div className="space-y-3">
                   <StatusRow label="Calendar Invite Sent" status="Completed" color="text-green-500" />
                   <StatusRow label="24h Email Reminder" status="Completed" color="text-green-500" />
                   <StatusRow label="1h WhatsApp Reminder" status="Scheduled" color="text-yellow-500" />
                   <StatusRow label="Post-Meeting Summary AI" status="Pending" color="text-text-muted" />
                </div>
              </div>

           </motion.div>
         )}

         {activeTab === 'ai-insights' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card bg-bg-primary p-6 rounded-3xl border border-border">
              <h3 className="text-lg font-bold text-text-main flex items-center mb-6">
                <Target className="w-5 h-5 mr-2 text-orange-500" /> AI Suggestions for this Meeting
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl">
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Priority Focus</p>
                    <p className="text-sm font-semibold text-text-main">Emphasize the seamless integration timeline. Time-to-market is their main pain point.</p>
                 </div>
                 <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Upsell Opportunity</p>
                    <p className="text-sm font-semibold text-text-main">Pitch the annual maintenance contract (AMC) as a bundle for 20% off.</p>
                 </div>
                 <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Next Best Action</p>
                    <p className="text-sm font-semibold text-text-main">AI will automatically generate and send a finalized invoice if they agree on the call.</p>
                 </div>
              </div>
           </motion.div>
         )}

      </div>

    </div>
  );
};

const StatusRow = ({ label, status, color }) => (
  <div className="flex justify-between items-center p-3 bg-bg-secondary border border-border rounded-xl">
    <span className="text-sm font-semibold text-text-main">{label}</span>
    <span className={`text-xs font-bold uppercase tracking-wider flex items-center ${color}`}>
      {status === 'Completed' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
      {status}
    </span>
  </div>
);

export default MeetingDetails;
