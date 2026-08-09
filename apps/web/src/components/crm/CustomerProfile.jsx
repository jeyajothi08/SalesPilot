import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit, MoreHorizontal, Mail, Phone, Globe, MapPin, 
  Briefcase, DollarSign, Target, Bot, Activity, PhoneCall, MessageSquare, FileText
} from 'lucide-react';
import { getStatusBadge } from '../../data/mockCustomers';

import CustomerTimeline from './CustomerTimeline';
import CallHistory from './CallHistory';
import MessageHistory from './MessageHistory';
import NotesAndDocs from './NotesAndDocs';

const CustomerProfile = ({ customer, onBack }) => {
  const [activeTab, setActiveTab] = useState('timeline');

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: <Activity className="w-4 h-4" /> },
    { id: 'calls', label: 'Call History', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes & Docs', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto pb-12"
    >
      
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-bg-primary glass-card border border-border rounded-xl text-sm font-medium text-text-muted hover:text-text-main flex items-center transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Customers
        </button>
        <div className="flex space-x-3">
          <button className="p-2 bg-bg-primary glass-card border border-border rounded-xl text-text-muted hover:text-text-main transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 bg-bg-primary glass-card border border-border rounded-xl text-text-muted hover:text-text-main transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="glass-card bg-bg-primary p-6 md:p-8 rounded-[32px] border border-border shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Left Side: Avatar & Basic Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-8">
          <img src={customer.avatar} alt={customer.name} className="w-24 h-24 rounded-3xl border border-border shadow-lg mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-text-main">{customer.name}</h1>
          <p className="text-sm font-medium text-text-muted mt-1">{customer.company}</p>
          
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(customer.status)}`}>
              {customer.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-bg-secondary border border-border text-text-main">
              {customer.type}
            </span>
          </div>

          <div className="mt-6 w-full space-y-3">
             <InfoRow icon={<Mail className="w-4 h-4" />} value={customer.email} />
             <InfoRow icon={<Phone className="w-4 h-4" />} value={customer.phone} />
             <InfoRow icon={<Globe className="w-4 h-4" />} value={customer.website} />
             <InfoRow icon={<MapPin className="w-4 h-4" />} value={customer.location} />
          </div>
        </div>

        {/* Middle: Extended Info & AI Summary */}
        <div className="flex-1 z-10 flex flex-col">
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <InfoCard icon={<Briefcase />} label="Industry" value={customer.industry} color="text-blue-500" />
            <InfoCard icon={<Target />} label="Service Interested" value={customer.service} color="text-purple-500" />
            <InfoCard icon={<DollarSign />} label="Budget" value={customer.budget} color="text-green-500" />
            <InfoCard icon={<Bot />} label="Assigned AI" value={customer.assignedAI} color="text-orange-500" />
          </div>

          <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex-1 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-primary flex items-center mb-2">
              <Bot className="w-4 h-4 mr-2" /> AI Customer Summary
            </h4>
            <p className="text-sm text-text-main/80 font-medium leading-relaxed">
              {customer.summary}
            </p>
          </div>
        </div>

        {/* Right Side: Lead Score */}
        <div className="z-10 w-full md:w-48 flex flex-col items-center justify-center pt-6 md:pt-0">
          <h3 className="text-sm font-semibold text-text-muted mb-4">Lead Score</h3>
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-bg-secondary" />
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * customer.score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className={`${customer.score > 80 ? 'text-green-500' : customer.score > 50 ? 'text-yellow-500' : 'text-red-500'}`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tracking-tighter text-text-main">{customer.score}</span>
            </div>
          </div>
          <p className={`text-xs font-bold mt-4 ${customer.score > 80 ? 'text-green-500' : customer.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
            {customer.score > 80 ? 'HIGH PROBABILITY' : customer.score > 50 ? 'MEDIUM PROBABILITY' : 'LOW PROBABILITY'}
          </p>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border overflow-x-auto custom-scrollbar pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main hover:border-border'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'timeline' && <CustomerTimeline />}
            {activeTab === 'calls' && <CallHistory />}
            {activeTab === 'messages' && <MessageHistory />}
            {activeTab === 'notes' && <NotesAndDocs />}
          </motion.div>
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

const InfoRow = ({ icon, value }) => (
  <div className="flex items-center space-x-3 text-sm text-text-muted">
    <div className="text-text-muted/70">{icon}</div>
    <span className="truncate">{value}</span>
  </div>
);

const InfoCard = ({ icon, label, value, color }) => (
  <div className="p-3 bg-bg-secondary rounded-xl border border-border">
    <div className={`flex items-center space-x-2 mb-1 ${color}`}>
      <div className="w-4 h-4">{icon}</div>
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
    </div>
    <p className="font-semibold text-text-main truncate text-sm">{value}</p>
  </div>
);

export default CustomerProfile;
