import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Mic, BarChart2, Settings } from 'lucide-react';

export const BottomNav = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'crm', icon: Users, label: 'CRM' },
    { id: 'voice', icon: Mic, label: 'AI Voice', isMain: true },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-6 pt-4 z-50 pointer-events-none">
       <div className="relative mx-auto max-w-sm flex items-center justify-between bg-ds-surface/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-2 shadow-2xl pointer-events-auto">
          
          {tabs.map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;

             if (tab.isMain) {
                return (
                   <button 
                     key={tab.id}
                     onClick={() => {
                        // Simulate Haptic Feedback
                        if (window.navigator && window.navigator.vibrate) {
                           window.navigator.vibrate(50);
                        }
                        onChange(tab.id);
                     }}
                     className="relative -top-6 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-ds-accent text-white shadow-[0_10px_30px_rgba(59,130,246,0.5)] transform transition-transform active:scale-95"
                   >
                     <Icon className="w-7 h-7" />
                   </button>
                )
             }

             return (
               <button 
                 key={tab.id}
                 onClick={() => {
                    if (window.navigator && window.navigator.vibrate) {
                       window.navigator.vibrate(20);
                    }
                    onChange(tab.id);
                 }}
                 className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors active:bg-white/5"
               >
                 <Icon className={`w-6 h-6 mb-1 transition-colors ${isActive ? 'text-white' : 'text-ds-text-tertiary'}`} />
                 
                 {/* Active Indicator Dot */}
                 {isActive && (
                    <motion.div 
                      layoutId="bottomNavIndicator"
                      className="absolute bottom-1 w-1 h-1 rounded-full bg-white"
                    />
                 )}
               </button>
             );
          })}
          
       </div>
    </div>
  );
};
