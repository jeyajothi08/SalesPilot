import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailAgent from '../../components/agents/EmailAgent';
import VoiceAgent from '../../components/agents/VoiceAgent';
import LeadScoringAgent from '../../components/agents/LeadScoringAgent';
import FollowUpAgent from '../../components/agents/FollowUpAgent';
import { Mail, Mic, Award, Clock, Bot, Sparkles } from 'lucide-react';

export default function AgentCenterPage() {
  const [activeTab, setActiveTab] = useState('email'); // email | voice | lead_scoring | followup

  return (
    <div className="w-full h-full bg-black flex flex-col font-sans text-white">
      
      {/* Master Agent Center Navigation Header */}
      <header className="h-14 border-b border-white/10 bg-black/80 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold tracking-tight text-sm">Agent Center</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold ml-1">
            Autonomous Sales Employees
          </span>
        </div>

        <nav className="flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          {[
            { id: 'email', label: 'Email Agent', icon: Mail },
            { id: 'voice', label: 'Voice Agent', icon: Mic },
            { id: 'lead_scoring', label: 'Lead Scoring', icon: Award },
            { id: 'followup', label: 'Follow-up Agent', icon: Clock }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-none ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-purple-300" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Agent Area */}
      <main className="flex-1 overflow-hidden relative bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full absolute inset-0"
          >
            {activeTab === 'email' ? (
              <EmailAgent />
            ) : activeTab === 'voice' ? (
              <VoiceAgent />
            ) : activeTab === 'lead_scoring' ? (
              <LeadScoringAgent />
            ) : (
              <FollowUpAgent />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
