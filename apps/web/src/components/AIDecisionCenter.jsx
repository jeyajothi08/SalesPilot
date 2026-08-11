import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Settings } from 'lucide-react';

import LiveThinkingPanel from './decision/LiveThinkingPanel';
import IntentAndSentiment from './decision/IntentAndSentiment';
import LeadScoringAndPrediction from './decision/LeadScoringAndPrediction';
import ActionAndStrategy from './decision/ActionAndStrategy';
import ObjectionHandling from './decision/ObjectionHandling';
import CustomerJourneyTimeline from './decision/CustomerJourneyTimeline';
import AICoachAndInsights from './decision/AICoachAndInsights';
import DecisionAnalytics from './decision/DecisionAnalytics';

const AIDecisionCenter = () => {
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
               <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            AI Decision Center
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-3xl font-medium">
            Your AI Sales Employee thinks, analyzes, predicts, and recommends the best sales strategy in real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-bg-secondary border border-border rounded-xl text-text-muted hover:text-primary transition-colors shadow-sm">
            <Settings className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 btn-primary flex justify-center items-center gap-2 font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
            <BrainCircuit className="w-4 h-4" />
            AI Global Settings
          </button>
        </div>
      </div>

      {/* Top Unified Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
         <StatCard label="AI Confidence" value="98%" highlight />
         <StatCard label="Today's Decisions" value="1,420" color="text-text-main" />
         <StatCard label="Successful Decisions" value="1,280" color="text-green-500" />
         <StatCard label="Lead Conversion" value="12.4%" trend="+1.2%" />
         <StatCard label="Customer Satisfaction" value="4.8/5" />
         <StatCard label="Avg Call Score" value="92/100" />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
         {/* Left Column: Live Thinking & Intent (4/12) */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="h-[400px]">
              <LiveThinkingPanel />
            </div>
            <div className="flex-1">
              <IntentAndSentiment />
            </div>
         </div>

         {/* Middle Column: Core Logic (5/12) */}
         <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="h-[300px]">
              <LeadScoringAndPrediction />
            </div>
            <div className="flex-1">
               <ActionAndStrategy />
            </div>
         </div>

         {/* Right Column: Objections & Coaching (3/12) */}
         <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="h-[350px]">
               <ObjectionHandling />
            </div>
            <div className="flex-1">
               <AICoachAndInsights />
            </div>
         </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 h-[250px]">
            <CustomerJourneyTimeline />
         </div>
         <div className="lg:col-span-4 h-[250px]">
            <DecisionAnalytics />
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

export default AIDecisionCenter;
