import React, { useState, useEffect } from 'react';
import { Window } from './Window';
import { AIAvatar } from '../design-system/ai/AIAvatar';
import { ConversationPanel } from '../design-system/ai/ConversationPanel';
import { SmartSuggestionCard } from '../design-system/ai/SmartSuggestionCard';
import { Calendar, Mail, FileText, Search, Mic } from 'lucide-react';
import { Badge } from '../design-system/atoms/Badge';

export const CopilotApp = ({ id, isActive, onFocus, onClose }) => {
  const [aiState, setAiState] = useState('idle'); // idle, listening, thinking, speaking
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your SalesPilot AI. I've analyzed your pipeline and noticed you have 3 high-value deals closing this week. How can I assist you today?" }
  ]);

  // Demo state machine to cycle through states
  const runDemoCycle = () => {
    if (aiState !== 'idle') return;
    
    setAiState('listening');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'user', content: "Draft an email to Acme Corp regarding the Q3 proposal." }]);
      setAiState('thinking');
      
      setTimeout(() => {
        setAiState('speaking');
        setMessages(prev => [...prev, { role: 'ai', content: "I've drafted the email. It highlights the ROI improvements we discussed last week. I've placed it in your drafts folder." }]);
        
        setTimeout(() => {
          setAiState('idle');
        }, 4000);
      }, 3000);
    }, 2000);
  };

  const getStatusColor = () => {
    switch(aiState) {
      case 'listening': return 'text-blue-400';
      case 'thinking': return 'text-purple-400';
      case 'speaking': return 'text-green-400';
      default: return 'text-ds-text-secondary';
    }
  };

  return (
    <Window 
      id={id} 
      title="AI Digital Employee" 
      isActive={isActive} 
      onFocus={onFocus} 
      onClose={onClose}
      defaultWidth={450}
      defaultHeight={750}
      defaultX={window.innerWidth - 480} // Open on the right side
      defaultY={50}
    >
       <div className="flex flex-col h-full bg-black/40 relative">
          
          {/* Avatar Section */}
          <div className="h-64 border-b border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
             <AIAvatar state={aiState} className="w-full h-full absolute inset-0 z-0" />
             
             {/* Status Badge overlay */}
             <div className="absolute top-4 right-4 z-10">
                <Badge variant={aiState === 'listening' ? 'info' : aiState === 'thinking' ? 'warning' : aiState === 'speaking' ? 'success' : 'neutral'} pulse={aiState !== 'idle'}>
                   <span className="capitalize">{aiState}</span>
                </Badge>
             </div>
          </div>

          {/* Chat Section */}
          <ConversationPanel messages={messages} />

          {/* Suggestions Context */}
          {aiState === 'idle' && (
            <div className="p-4 border-t border-white/5 bg-white/5 space-y-2 shrink-0">
               <div className="text-[10px] font-bold text-ds-text-tertiary uppercase tracking-wider mb-2">Smart Suggestions</div>
               <SmartSuggestionCard icon={<Mail className="w-4 h-4"/>} title="Follow up with TechNova" description="They haven't replied in 3 days." onClick={runDemoCycle} />
               <SmartSuggestionCard icon={<FileText className="w-4 h-4"/>} title="Generate Proposal" description="For the recent Acme Corp meeting." onClick={runDemoCycle} />
            </div>
          )}

          {/* Voice Input Area */}
          <div className="p-4 bg-ds-surface-hover shrink-0">
             <button 
               onClick={runDemoCycle}
               className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg
                 ${aiState === 'listening' ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-ds-text-primary'}
               `}
             >
                <Mic className="w-4 h-4" />
                {aiState === 'listening' ? 'Listening...' : 'Tap to Speak'}
             </button>
          </div>

       </div>
    </Window>
  );
};
