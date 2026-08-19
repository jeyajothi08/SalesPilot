import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useCRM } from '../../context/CRMContext';

// Helper to compute client-side analytics on the live CRM context
const computeClientPipelineAnalytics = (queryText, dealsList) => {
  const deals = Array.isArray(dealsList) ? dealsList : [];
  const activeDeals = deals.filter(d => {
    const st = (d.stage || d.stageTitle || '').toLowerCase();
    return st !== 'won' && st !== 'lost' && st !== 'closed won' && st !== 'closed lost';
  });
  
  const targetDeals = activeDeals.length > 0 ? activeDeals : deals;

  const totDeals = targetDeals.length;
  const totVal = targetDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const weightVal = targetDeals.reduce((sum, d) => sum + ((Number(d.value) || 0) * ((Number(d.probability) || 50) / 100)), 0);

  const sortedVal = [...targetDeals].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
  const sortedProb = [...targetDeals].sort((a, b) => (Number(b.probability) || 0) - (Number(a.probability) || 0));
  const sortedRisk = [...targetDeals].sort((a, b) => (Number(a.probability) || 0) - (Number(b.probability) || 0));

  const topDeal = sortedVal[0] || { title: 'N/A', company: 'N/A', value: 0, probability: 0, nextAction: 'N/A', stageTitle: 'N/A' };
  const topProb = sortedProb[0] || { title: 'N/A', company: 'N/A', value: 0, probability: 0, nextAction: 'N/A', stageTitle: 'N/A' };
  const riskDeal = sortedRisk[0] || { title: 'N/A', company: 'N/A', value: 0, probability: 0, nextAction: 'N/A', stageTitle: 'N/A' };

  // Group by stage
  const stages = {};
  targetDeals.forEach(d => {
    const st = d.stageTitle || d.stage || 'Qualified';
    if (!stages[st]) stages[st] = { count: 0, total_value: 0 };
    stages[st].count += 1;
    stages[st].total_value += (Number(d.value) || 0);
  });

  const q = queryText.toLowerCase();

  // Filter query: deals above $X
  if (q.includes("above") || q.includes("greater than") || q.includes("more than")) {
    const match = q.match(/\$?(\d[\d,]*)/);
    const minVal = match ? parseFloat(match[1].replace(/,/g, '')) : 50000;
    const filtered = targetDeals.filter(d => Number(d.value) >= minVal);
    if (filtered.length === 0) {
      return `No active deals currently found with value above $${minVal.toLocaleString()}.`;
    }
    const listStr = filtered.map(d => `• **${d.title}** (${d.company}) — $${Number(d.value).toLocaleString()} (${d.stageTitle || d.stage})`).join('\n');
    return `Found **${filtered.length} deal(s)** above $${minVal.toLocaleString()}:\n\n${listStr}`;
  }

  // Filter query: deals in stage X
  if (q.includes("in proposal") || q.includes("in negotiation") || q.includes("in qualified") || q.includes("in lead")) {
    let targetSt = 'proposal';
    if (q.includes("negotiation")) targetSt = 'negotiation';
    else if (q.includes("qualified")) targetSt = 'qualified';
    else if (q.includes("lead")) targetSt = 'lead';

    const filtered = targetDeals.filter(d => (d.stage || '').toLowerCase().includes(targetSt));
    if (filtered.length === 0) {
      return `No active deals currently in stage matching "${targetSt}".`;
    }
    const listStr = filtered.map(d => `• **${d.title}** (${d.company}) — $${Number(d.value).toLocaleString()} (${d.probability}% probability)`).join('\n');
    return `Found **${filtered.length} deal(s)** in stage matching "${targetSt}":\n\n${listStr}`;
  }

  // 1. Full Pipeline Analysis / Active Deals
  if (q.includes("analyze my pipeline") || q.includes("how is my pipeline") || q.includes("pipeline summary") || q.includes("total pipeline value") || q.includes("active deals")) {
    const stageLines = Object.entries(stages)
      .filter(([_, info]) => info.count > 0)
      .map(([st, info]) => `• **${st}**: $${info.total_value.toLocaleString()} (${info.count} deal${info.count > 1 ? 's' : ''})`)
      .join('\n');

    return `Here's your current pipeline:\n\n` +
      `• **Active deals**: ${totDeals}\n` +
      `• **Total pipeline**: $${totVal.toLocaleString()}\n` +
      `• **Weighted pipeline**: $${Math.round(weightVal).toLocaleString()}\n` +
      `• **Highest-value deal**: ${topDeal.title} — $${topDeal.value.toLocaleString()}\n` +
      `• **Highest probability**: ${topProb.title} — ${topProb.probability}%\n\n` +
      `**Stage Summary**:\n${stageLines}\n\n` +
      `**Priority**:\nFocus on **${topDeal.title}** because it has the largest opportunity value ($${topDeal.value.toLocaleString()}) and the strongest current probability (${topDeal.probability}%).`;
  }

  // 2. Most Valuable Deal / Biggest Deal
  if (q.includes("most valuable") || q.includes("biggest opportunity") || q.includes("highest value") || q.includes("biggest deal") || q.includes("is the biggest")) {
    return `Your most valuable deal is **${topDeal.title}** (${topDeal.company}) valued at **$${topDeal.value.toLocaleString()}**.\n\n` +
      `• **Current Stage**: ${topDeal.stageTitle || topDeal.stage}\n` +
      `• **Win Probability**: ${topDeal.probability}%\n` +
      `• **Weighted Value**: $${Math.round(topDeal.value * (topDeal.probability/100)).toLocaleString()}\n` +
      `• **Next Action**: ${topDeal.nextAction || 'Schedule follow-up review'}`;
  }

  // 3. Highest Win Probability Deal
  if (q.includes("highest win probability") || q.includes("likely to close") || q.includes("highest probability") || q.includes("high probability")) {
    return `The deal most likely to close is **${topProb.title}** (${topProb.company}) with a **${topProb.probability}% win probability**.\n\n` +
      `• **Deal Value**: $${topProb.value.toLocaleString()}\n` +
      `• **Current Stage**: ${topProb.stageTitle || topProb.stage}\n` +
      `• **Weighted Contribution**: $${Math.round(topProb.value * (topProb.probability/100)).toLocaleString()}\n` +
      `• **Next Action**: ${topProb.nextAction || 'Send final contract for signature'}`;
  }

  // 4. Weighted Pipeline Calculation
  if (q.includes("weighted") || q.includes("expected revenue")) {
    const contribs = targetDeals.map(d => `• **${d.title}**: $${d.value.toLocaleString()} × ${d.probability}% = **$${Math.round(d.value * (d.probability/100)).toLocaleString()}**`).join('\n');
    return `Your **Weighted Pipeline** is calculated by multiplying each deal's value by its win probability (\`deal_value × win_probability\`).\n\n` +
      `Total Expected Revenue: **$${Math.round(weightVal).toLocaleString()}** (from unweighted total of **$${totVal.toLocaleString()}** across ${totDeals} deals).\n\n` +
      `**Deal Breakdown**:\n${contribs}`;
  }

  // 5. Risky Deals
  if (q.includes("at risk") || q.includes("risky") || q.includes("risk")) {
    return `Your highest-risk opportunity is **${riskDeal.title}** (${riskDeal.company}) valued at **$${riskDeal.value.toLocaleString()}**.\n\n` +
      `• **Reason for Risk**: Lower win probability of ${riskDeal.probability}% in stage ${riskDeal.stageTitle || riskDeal.stage}.\n` +
      `• **Recommended Action**: ${riskDeal.nextAction || 'Schedule executive check-in to mitigate risk'}.`;
  }

  // 6. Stage Analysis & Comparison
  if (q.includes("stage") || q.includes("compare") || q.includes("each stage") || q.includes("how many deals in")) {
    const stageLines = Object.entries(stages)
      .map(([st, info]) => `• **${st}**: $${info.total_value.toLocaleString()} across ${info.count} deal(s)`)
      .join('\n');
    return `### Stage Comparison Summary\n\n${stageLines}\n\nTotal Pipeline Value across active stages: **$${totVal.toLocaleString()}**.`;
  }

  // 7. Priorities & Follow up
  if (q.includes("follow up") || q.includes("prioritize") || q.includes("priority") || q.includes("today") || q.includes("who should i")) {
    return `### Recommended Priorities for Today\n\n` +
      `1. **High-Value Focus**: **${topDeal.title}** ($${topDeal.value.toLocaleString()})\n` +
      `   - *Action*: ${topDeal.nextAction || 'Review contract terms'} (${topDeal.probability}% probability).\n\n` +
      `2. **Risk Mitigation**: **${riskDeal.title}** ($${riskDeal.value.toLocaleString()})\n` +
      `   - *Action*: ${riskDeal.nextAction || 'Address prospect concerns'} (${riskDeal.probability}% probability).`;
  }

  // Default overview
  return `Here is your current pipeline summary:\n\n` +
    `• **Active Deals**: ${totDeals}\n` +
    `• **Total Pipeline Value**: $${totVal.toLocaleString()}\n` +
    `• **Weighted Revenue**: $${Math.round(weightVal).toLocaleString()}\n` +
    `• **Top Opportunity**: ${topDeal.title} ($${topDeal.value.toLocaleString()})\n` +
    `• **Highest Win Probability**: ${topProb.title} (${topProb.probability}%)\n\n` +
    `Ask me questions like "Analyze my pipeline", "Which deal is the biggest?", "Change Acme deal value to $100,000", or "Move Acme to Proposal Sent".`;
};

// Formatter helper for markdown bold and lists
const formatMessageText = (content) => {
  if (!content) return null;
  
  const lines = content.split('\n');
  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={lineIdx} className="h-2" />;
    }

    if (line.startsWith('### ')) {
      return <h4 key={lineIdx} className="font-bold text-white text-sm my-1 tracking-tight">{line.replace('### ', '')}</h4>;
    }

    // Replace **text** bold formatting
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formattedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return (
        <div key={lineIdx} className="flex items-start gap-1.5 my-0.5 pl-1">
          <span className="text-blue-400 font-bold select-none">•</span>
          <span>{formattedLine}</span>
        </div>
      );
    }

    return <p key={lineIdx} className="my-0.5">{formattedLine}</p>;
  });
};

export const CopilotChat = ({ onClose, inline = false }) => {
  const crmContext = useCRM();
  const deals = Array.isArray(crmContext?.deals) ? crmContext.deals : [];
  const updateDealStage = crmContext?.updateDealStage || (() => {});
  const updateDealValue = crmContext?.updateDealValue || (() => {});
  const deleteDeal = crmContext?.deleteDeal || (() => {});

  const [pendingAction, setPendingAction] = useState(null);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I am SalesPilot AI Copilot. I am connected to your live CRM pipeline. Ask me to analyze your pipeline, compute weighted revenue, or run action commands like "Move Acme to Proposal" or "Change Acme deal value to $100,000".' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const confirmPendingAction = async () => {
    if (!pendingAction) return;
    setIsLoading(true);
    const { type, deal, targetStage, targetStageTitle, newVal } = pendingAction;
    try {
      if (type === 'stage') {
        await updateDealStage(deal.id, targetStage);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Action Confirmed & Executed: Successfully moved **${deal.title}** (${deal.company}) to stage **${targetStageTitle}**.`
        }]);
      } else if (type === 'value') {
        updateDealValue(deal.id, newVal);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Action Confirmed & Executed: Successfully updated value of **${deal.title}** to **$${newVal.toLocaleString()}**.`
        }]);
      } else if (type === 'delete') {
        deleteDeal(deal.id);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Action Confirmed & Executed: Successfully deleted deal **${deal.title}**.`
        }]);
      }
    } finally {
      setPendingAction(null);
      setIsLoading(false);
    }
  };

  const cancelPendingAction = () => {
    setPendingAction(null);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Action cancelled. No changes were made to your CRM pipeline.'
    }]);
  };

  const quickPrompts = [
    "Analyze my pipeline",
    "What is my total pipeline value?",
    "Which deal is the biggest?",
    "What is my weighted pipeline?",
    "Which deals are at risk?",
    "Who should I follow up with?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendPrompt = async (promptText) => {
    if (!promptText.trim() || isLoading) return;

    const userMessage = promptText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const msgLower = userMessage.toLowerCase();

    // ── ACTION MUTATION COMMANDS (with Confirmation Guard) ───────────────
    if (msgLower.includes("move ") || msgLower.includes("change stage") || msgLower.includes("update stage") || msgLower.includes("set stage")) {
      const matchedDeal = deals.find(d => 
        msgLower.includes(d.title.toLowerCase()) || 
        msgLower.includes(d.company.toLowerCase()) ||
        d.title.toLowerCase().split(' ').some(word => word.length > 3 && msgLower.includes(word))
      );

      let targetStage = null;
      let targetStageTitle = null;

      if (msgLower.includes("proposal")) {
        targetStage = "proposal";
        targetStageTitle = "Proposal Sent";
      } else if (msgLower.includes("qualified") || msgLower.includes("contacted")) {
        targetStage = "qualified";
        targetStageTitle = "Qualified";
      } else if (msgLower.includes("negotiation")) {
        targetStage = "negotiation";
        targetStageTitle = "Negotiation";
      } else if (msgLower.includes("won") || msgLower.includes("closed won")) {
        targetStage = "won";
        targetStageTitle = "Closed Won";
      } else if (msgLower.includes("lost") || msgLower.includes("closed lost")) {
        targetStage = "lost";
        targetStageTitle = "Closed Lost";
      } else if (msgLower.includes("lead")) {
        targetStage = "lead_in";
        targetStageTitle = "Lead In";
      }

      if (matchedDeal && targetStage) {
        setPendingAction({
          type: 'stage',
          deal: matchedDeal,
          targetStage,
          targetStageTitle
        });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I can move **${matchedDeal.title}** (${matchedDeal.company}) to stage **${targetStageTitle}**. Would you like to confirm this pipeline update?`
        }]);
        setIsLoading(false);
        return;
      }
    }

    if (msgLower.includes("value to") || msgLower.includes("change value") || msgLower.includes("update value")) {
      const matchedDeal = deals.find(d => 
        msgLower.includes(d.title.toLowerCase()) || 
        msgLower.includes(d.company.toLowerCase()) ||
        d.title.toLowerCase().split(' ').some(word => word.length > 3 && msgLower.includes(word))
      );

      const valMatch = msgLower.match(/\$?(\d[\d,]*)/);
      if (matchedDeal && valMatch) {
        const newVal = parseFloat(valMatch[1].replace(/,/g, ''));
        if (!isNaN(newVal)) {
          setPendingAction({
            type: 'value',
            deal: matchedDeal,
            newVal
          });
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I can update the value of **${matchedDeal.title}** to **$${newVal.toLocaleString()}**. Would you like to confirm this change?`
          }]);
          setIsLoading(false);
          return;
        }
      }
    }

    if (msgLower.includes("delete deal") || msgLower.includes("remove deal")) {
      const matchedDeal = deals.find(d => 
        msgLower.includes(d.title.toLowerCase()) || 
        msgLower.includes(d.company.toLowerCase())
      );

      if (matchedDeal) {
        setPendingAction({
          type: 'delete',
          deal: matchedDeal
        });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Warning: I can delete **${matchedDeal.title}** from your CRM. Would you like to confirm this deletion?`
        }]);
        setIsLoading(false);
        return;
      }
    }

    if (msgLower.startsWith("create deal") || msgLower.startsWith("create a deal") || msgLower.startsWith("add deal")) {
      const valMatch = msgLower.match(/\$?(\d[\d,]*)/);
      const dealVal = valMatch ? parseFloat(valMatch[1].replace(/,/g, '')) : 35000;
      const cleanTitle = userMessage.replace(/create (a )?deal/i, '').replace(/for \$?[\d,]+/i, '').trim() || 'New Copilot Opportunity';
      
      addDeal({
        title: cleanTitle,
        company: 'New Enterprise Lead',
        value: dealVal,
        stage: 'lead_in',
        probability: 40,
        nextAction: 'Schedule Qualification Call',
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Successfully created new deal **${cleanTitle}** valued at **$${dealVal.toLocaleString()}** in stage **Lead In**.`
      }]);
      setIsLoading(false);
      return;
    }

    if (msgLower.includes("delete database") || msgLower.includes("drop table") || msgLower.includes("export server logs")) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "That CRM action isn't currently supported."
      }]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/ai/chat', {
        message: userMessage,
        conversation_id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        crm_context: deals,
      });

      const aiResponse = response.data.message;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.content }]);
    } catch (error) {
      console.warn('Backend API connection issue, using client-side live CRM analytics:', error);
      const fallbackAnalysis = computeClientPipelineAnalytics(userMessage, deals);
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackAnalysis }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={inline
        ? "w-full h-full bg-[#0E0E10] border-l border-white/10 flex flex-col overflow-hidden"
        : `fixed ${isMinimized ? 'bottom-6 right-6 w-80 h-16' : 'bottom-6 right-6 w-96 h-150'} bg-[#0E0E10] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-100 transition-all duration-300`
      }
    >
      {/* Header */}
      <div className="h-14 border-b border-white/10 bg-white/5 flex items-center justify-between px-4 cursor-pointer shrink-0" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
               SalesPilot Copilot <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </h3>
            <p className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live CRM Context ({deals.length} deals active)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               setMessages([{ role: 'assistant', content: 'Conversation history cleared. How can I assist with your CRM pipeline now?' }]);
             }} 
             className="hover:text-white transition-colors cursor-pointer border-none bg-transparent"
             title="Clear Conversation History"
           >
              <RotateCcw className="w-3.5 h-3.5" />
           </button>
           <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-white transition-colors cursor-pointer border-none bg-transparent">
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
           </button>
           {onClose && (
             <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="hover:text-white transition-colors cursor-pointer border-none bg-transparent">
                <X className="w-4 h-4" />
             </button>
           )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-transparent to-black/30 custom-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}
                >
                  {msg.role === 'assistant' && (
                     <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 mt-1">
                        <Bot className="w-3.5 h-3.5 text-blue-400" />
                     </div>
                  )}
                  
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm shadow-md font-medium' 
                      : 'bg-white/5 text-gray-200 rounded-tl-sm border border-white/10 shadow-lg'
                  }`}>
                    {msg.role === 'user' ? msg.content : formatMessageText(msg.content)}
                  </div>

                  {msg.role === 'user' && (
                     <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-3.5 h-3.5 text-gray-300" />
                     </div>
                  )}
                </motion.div>
              ))}
              
              {pendingAction && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="p-3 bg-blue-950/50 border border-blue-500/40 rounded-xl space-y-2.5 shadow-lg"
                >
                  <p className="text-xs font-bold text-blue-300">Confirmation Required for Pipeline Mutation</p>
                  <div className="flex gap-2">
                    <button
                      onClick={confirmPendingAction}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
                    >
                      [Confirm Action]
                    </button>
                    <button
                      onClick={cancelPendingAction}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      [Cancel]
                    </button>
                  </div>
                </motion.div>
              )}
              
              {isLoading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 mt-1">
                       <Bot className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 rounded-tl-sm border border-white/10 flex items-center gap-2 text-xs text-gray-400">
                       <span className="animate-pulse font-mono text-blue-400">Analyzing live CRM data...</span>
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-black/40 border-t border-white/5 overflow-x-auto flex gap-1.5 text-[11px] custom-scrollbar shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(p)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-blue-600/30 text-gray-300 hover:text-white border border-white/10 transition-colors whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white/5 border-t border-white/10 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask Copilot or run commands (e.g. 'Change Acme value to $100000')..." 
                className="w-full bg-black/60 border border-white/15 rounded-full py-2.5 pl-4 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-medium"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors border-none cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </motion.div>
  );
};
