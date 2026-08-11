import React, { useState } from 'react';
import UnifiedInbox from '../../os/apps/communication/UnifiedInbox';
import VoiceCallCenter from '../../os/apps/communication/VoiceCallCenter';
import LiveChatWidget from '../../os/apps/communication/LiveChatWidget';
import { MessageSquare, PhoneCall, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunicationDashboard() {
  const [activeTab, setActiveTab] = useState('inbox');

  return (
    <div className="w-full h-full bg-black flex flex-col font-sans overflow-hidden">
      
      {/* Top Navigation */}
      <header className="h-14 border-b border-white/10 bg-white/5 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-medium tracking-tight ml-2">Omnichannel Hub</span>
          </div>

          <nav className="flex space-x-2">
             {[
               { id: 'inbox', label: 'Unified Inbox', icon: MessageSquare },
               { id: 'voice', label: 'Voice Center', icon: PhoneCall },
               { id: 'analytics', label: 'Analytics', icon: BarChart2 }
             ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors relative ${
                    activeTab === tab.id ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                   <tab.icon size={16} className="mr-2" />
                   {tab.label}
                   {activeTab === tab.id && (
                     <motion.div 
                       layoutId="commTab"
                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full translate-y-[11px]"
                     />
                   )}
                </button>
             ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-6 relative bg-gradient-to-br from-indigo-900/10 via-black to-black">
        <AnimatePresence mode="wait">
          {activeTab === 'inbox' && (
            <motion.div 
              key="inbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full w-full"
            >
              <UnifiedInbox />
            </motion.div>
          )}

          {activeTab === 'voice' && (
            <motion.div 
              key="voice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full w-full"
            >
              <VoiceCallCenter />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full w-full flex flex-col items-center justify-center"
            >
               <BarChart2 size={48} className="text-gray-600 mb-4" />
               <h2 className="text-xl text-white font-medium mb-2">Communication Analytics</h2>
               <p className="text-gray-400 max-w-md text-center">Track average response times, AI resolution rates, and customer sentiment across all channels.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Customer Live Chat Widget for Demo Purposes */}
        <div className="absolute bottom-6 right-6 flex flex-col items-end pointer-events-none">
           <div className="bg-black/80 backdrop-blur border border-white/10 rounded-lg p-3 text-xs text-gray-400 mb-4 mr-2 pointer-events-auto">
             Try the Live Chat Widget &rarr;
           </div>
           <div className="pointer-events-auto">
             <LiveChatWidget />
           </div>
        </div>

      </main>
    </div>
  );
}
