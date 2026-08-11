import React, { useState, useEffect } from 'react';
import { Window } from './Window';
import { AIAvatar } from '../design-system/ai/AIAvatar';
import { ConversationPanel } from '../design-system/ai/ConversationPanel';
import { SmartSuggestionCard } from '../design-system/ai/SmartSuggestionCard';
import { Mail, FileText, Mic } from 'lucide-react';
import { Badge } from '../design-system/atoms/Badge';
import { useCRM } from '../context/CRMContext';

export const CopilotApp = ({ id, isActive, onFocus, onClose }) => {
  const { deals, computeAnalytics } = useCRM();
  const [aiState, setAiState] = useState('idle'); // idle, listening, thinking, speaking
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const analytics = computeAnalytics();
    setMessages([
      { 
        role: 'ai', 
        content: `Hello! I'm your SalesPilot AI Digital Employee. I've analyzed your live pipeline and found ${analytics.totalDeals} active deals totaling $${analytics.totalValue.toLocaleString()} in value (Weighted revenue: $${Math.round(analytics.weightedPipeline).toLocaleString()}). How can I assist you today?` 
      }
    ]);
  }, [computeAnalytics]);

  // Demo state machine to cycle through voice interaction states
  const runDemoCycle = () => {
    if (aiState !== 'idle') return;
    
    setAiState('listening');
    
    setTimeout(() => {
      const topDeal = deals[0]?.title || 'Acme Corp';
      setMessages(prev => [...prev, { role: 'user', content: `Draft a follow-up summary for ${topDeal}.` }]);
      setAiState('thinking');
      
      setTimeout(() => {
        setAiState('speaking');
        setMessages(prev => [...prev, { role: 'ai', content: `I've analyzed ${topDeal}. It has a high win probability (${deals[0]?.probability || 80}%). I've generated a tailored executive proposal in your drafts.` }]);
        
        setTimeout(() => {
          setAiState('idle');
        }, 4000);
      }, 3000);
    }, 2000);
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
               <div className="text-[10px] font-bold text-ds-text-tertiary uppercase tracking-wider mb-2">Live CRM Actions</div>
               <SmartSuggestionCard 
                 icon={<Mail className="w-4 h-4"/>} 
                 title={`Follow up with ${deals[0]?.company || 'Key Accounts'}`} 
                 description={`Next step: ${deals[0]?.nextAction || 'Schedule review call'}`} 
                 onClick={runDemoCycle} 
               />
               <SmartSuggestionCard 
                 icon={<FileText className="w-4 h-4"/>} 
                 title="Analyze Pipeline Risks" 
                 description={`Analyze ${deals.length} deals for win probabilities.`} 
                 onClick={runDemoCycle} 
               />
            </div>
          )}

          {/* Voice Input Area */}
          <div className="p-4 bg-ds-surface-hover shrink-0">
             <button 
               onClick={runDemoCycle}
               className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg cursor-pointer
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
