import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { MobileHome } from './views/MobileHome';
import { MobileVoiceAgent } from './views/MobileVoiceAgent';
import { AnimatePresence } from 'framer-motion';

export const MobileOS = () => {
  const [activeTab, setActiveTab] = useState('home'); // home, crm, voice, analytics, settings

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white overflow-hidden selection:bg-ds-accent selection:text-white font-sans touch-none">
      
      {/* Dynamic View Rendering */}
      <div className="absolute inset-0 pb-[90px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <MobileHome key="home" onNavigate={setActiveTab} />}
          {activeTab === 'voice' && <MobileVoiceAgent key="voice" onClose={() => setActiveTab('home')} />}
          
          {/* Fallbacks for unbuilt views */}
          {['crm', 'analytics', 'settings'].includes(activeTab) && (
            <div key="wip" className="flex items-center justify-center h-full text-ds-text-tertiary font-bold tracking-widest uppercase">
              {activeTab} View Coming Soon
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Navigation */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      
    </div>
  );
};

export default MobileOS;
