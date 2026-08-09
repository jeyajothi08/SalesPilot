import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, CornerDownLeft } from 'lucide-react';

const mockChat = [
  { id: 1, sender: 'ai', text: 'Hello! I am Alpha, your AI Sales Employee. I have just been trained on your latest company data. What would you like to test?', time: 'Just now' }
];

const LiveAITest = () => {
  const [messages, setMessages] = useState(mockChat);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message
    const newUserMsg = { id: Date.now(), sender: 'user', text: input, time: 'Just now' };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      let aiResponse = "I'm sorry, I don't have information about that in my knowledge base.";
      const lowerInput = newUserMsg.text.toLowerCase();

      if (lowerInput.includes('cost') || lowerInput.includes('price')) {
        aiResponse = "Based on the Pricing_Tiers_Q4.csv, our custom websites start at $2,500. The AI Chatbot integration starts at $5,000.";
      } else if (lowerInput.includes('react')) {
        aiResponse = "Yes! According to our Services Manager, we specialize in React and Next.js development for modern web applications.";
      } else if (lowerInput.includes('days') || lowerInput.includes('timeline') || lowerInput.includes('how long')) {
        aiResponse = "According to our FAQs, a standard AI chatbot takes about 2 weeks to develop and integrate.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponse, time: 'Just now' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-text-main">Live Testing Interface</h2>
        <p className="text-sm text-text-muted mt-1 font-medium max-w-lg mx-auto">
          Chat with the AI to verify it is correctly answering questions based on your uploaded documents and services.
        </p>
      </div>

      <div className="flex-1 glass-card bg-bg-primary border border-border rounded-3xl overflow-hidden flex flex-col shadow-sm">
        
        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-bg-secondary/30">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-end space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'ai' ? 'bg-primary text-white' : 'bg-bg-secondary border border-border text-text-main'}`}>
                  {msg.sender === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                
                <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm border ${
                  msg.sender === 'user' 
                    ? 'bg-text-main text-bg-primary border-transparent rounded-br-sm' 
                    : 'bg-white dark:bg-bg-primary text-text-main border-border rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white dark:bg-bg-primary border border-border p-4 rounded-2xl rounded-bl-sm flex space-x-1 shadow-sm">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-text-muted" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-text-muted" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-text-muted" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-bg-primary border-t border-border">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question to test the AI..." 
              className="w-full pl-6 pr-16 py-4 bg-bg-secondary border border-border rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors font-medium shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-colors shadow-sm"
            >
              <CornerDownLeft className="w-4 h-4 font-bold" />
            </button>
          </form>
          <div className="mt-3 flex gap-2 justify-center">
            <TestSuggestion text="How much does a website cost?" onClick={() => setInput('How much does a website cost?')} />
            <TestSuggestion text="Do you provide React Development?" onClick={() => setInput('Do you provide React Development?')} />
          </div>
        </div>

      </div>
    </div>
  );
};

const TestSuggestion = ({ text, onClick }) => (
  <button onClick={onClick} className="px-3 py-1.5 bg-bg-secondary border border-border rounded-full text-xs font-bold text-text-muted hover:text-primary hover:border-primary/50 transition-colors">
    {text}
  </button>
);

export default LiveAITest;
