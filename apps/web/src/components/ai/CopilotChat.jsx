import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import apiClient from '../../api/apiClient';

export const CopilotChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am SalesPilot AI. I can check your pipeline, draft emails, book meetings, or search our knowledge base. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // We pass the message to our AI Chat endpoint
      // Using a static conversation_id for this session context
      const response = await apiClient.post('/ai/chat', {
        message: userMessage,
        conversation_id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0'
      });
      
      const aiResponse = response.data.message;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorDetail = error.response?.data?.detail;
      const errorMessage = typeof errorDetail === 'string' 
        ? errorDetail 
        : (errorDetail?.message || error.message || 'I encountered an error connecting to the AI Brain. Please try again later.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Connection issue: ${errorMessage}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80 h-16' : 'bottom-6 right-6 w-96 h-150'} bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-100 transition-all duration-300`}
    >
      {/* Header */}
      <div className="h-14 border-b border-white/10 bg-white/5 flex items-center justify-between px-4 cursor-pointer shrink-0" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm flex items-center gap-2">
               SalesPilot Copilot <Sparkles className="w-3 h-3 text-yellow-400" />
            </h3>
            <p className="text-green-400 text-xs">Online • GPT-4o-mini</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
           <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-white transition-colors">
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
           </button>
           {onClose && (
             <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="hover:text-white transition-colors">
                <X className="w-4 h-4" />
             </button>
           )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linear-to-b from-transparent to-black/20">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.role === 'assistant' && (
                     <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 mt-1">
                        <Bot className="w-3 h-3 text-blue-400" />
                     </div>
                  )}
                  
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                  }`}>
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                     <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-3 h-3 text-gray-300" />
                     </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 mt-1">
                       <Bot className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 rounded-tl-sm border border-white/5 flex gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SalesPilot AI..." 
                className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
            <div className="text-center mt-2">
               <span className="text-[10px] text-gray-600">AI can make mistakes. Verify CRM updates.</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
