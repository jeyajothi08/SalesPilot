import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MoreVertical, Search, Filter, Send, PhoneCall, Paperclip, CheckCircle, Clock } from 'lucide-react';
// import { motion } from 'framer-motion';

const mockThreads = [
  {
    id: 1,
    customer: 'Acme Corp',
    contact: 'john@acme.com',
    channel: 'email',
    lastMessage: 'We are ready to proceed with the Enterprise plan.',
    time: '10:42 AM',
    unread: true,
    intent: 'buying',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    contact: '+1 555-0192',
    channel: 'whatsapp',
    lastMessage: 'Can you send the pricing PDF again?',
    time: 'Yesterday',
    unread: false,
    intent: 'support',
  },
  {
    id: 3,
    customer: 'TechFlow',
    contact: '+1 555-9988',
    channel: 'voice',
    lastMessage: 'Missed call from TechFlow',
    time: 'Yesterday',
    unread: false,
    intent: 'unknown',
  },
  {
    id: 4,
    customer: 'Web Visitor #842',
    contact: 'Live Chat',
    channel: 'livechat',
    lastMessage: 'I have a question about API limits.',
    time: 'Monday',
    unread: false,
    intent: 'support',
  }
];

export default function UnifiedInbox() {
  const [activeThread, setActiveThread] = useState(mockThreads[0]);
  const [message, setMessage] = useState('');

  const ChannelIcon = ({ type, className }) => {
    switch (type) {
      case 'email': return <Mail className={className} />;
      case 'whatsapp': return <MessageSquare className={className} />;
      case 'voice': return <Phone className={className} />;
      case 'livechat': return <MessageSquare className={className} />;
      default: return <Mail className={className} />;
    }
  };

  return (
    <div className="flex h-full bg-black text-white rounded-xl overflow-hidden border border-white/10">
      
      {/* Threads List Sidebar */}
      <div className="w-80 border-r border-white/10 bg-white/5 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-medium text-white flex items-center justify-between">
            Unified Inbox
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">3 New</span>
          </h2>
          <div className="mt-4 flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-400">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockThreads.map((thread) => (
            <div 
              key={thread.id}
              onClick={() => setActiveThread(thread)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                activeThread.id === thread.id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    thread.channel === 'email' ? 'bg-blue-500/20 text-blue-400' :
                    thread.channel === 'whatsapp' ? 'bg-green-500/20 text-green-400' :
                    thread.channel === 'voice' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    <ChannelIcon type={thread.channel} className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm font-medium ${thread.unread ? 'text-white' : 'text-gray-300'}`}>
                    {thread.customer}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{thread.time}</span>
              </div>
              <p className={`text-xs mt-2 truncate ${thread.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                {thread.lastMessage}
              </p>
              {thread.intent === 'buying' && (
                <div className="mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  High Intent
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Conversation Thread */}
      <div className="flex-1 flex flex-col bg-black relative">
        {/* Header */}
        <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-white/5">
          <div>
            <h3 className="text-lg font-medium text-white">{activeThread.customer}</h3>
            <p className="text-xs text-gray-400 flex items-center mt-0.5">
              <span className="capitalize mr-2">{activeThread.channel}</span> • <span className="ml-2">{activeThread.contact}</span>
            </p>
          </div>
          <div className="flex space-x-3 text-gray-400">
             <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><PhoneCall size={18} /></button>
             <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><CheckCircle size={18} /></button>
             <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* AI Insight Bar */}
        {activeThread.intent === 'buying' && (
           <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3 flex items-start space-x-3">
              <div className="mt-0.5"><CheckCircle size={16} className="text-emerald-400" /></div>
              <div>
                 <p className="text-sm font-medium text-emerald-400">AI Intent Detected: Buying Readiness</p>
                 <p className="text-xs text-emerald-400/70 mt-0.5">The customer expressed readiness to proceed. AI recommends proposing a meeting or sending the payment link.</p>
              </div>
           </div>
        )}

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col items-center mb-8">
            <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">Today</span>
          </div>

          <div className="flex justify-start">
            <div className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] border border-white/10">
              <p className="text-sm">Hi team, we reviewed the proposal and it looks great. We are ready to proceed with the Enterprise plan.</p>
              <div className="flex items-center justify-end mt-2 text-[10px] text-gray-400">
                10:42 AM
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm">That's wonderful news! I will generate the contract and send it over right away. Would you like a quick onboarding call this week?</p>
              <div className="flex items-center justify-end mt-2 text-[10px] text-blue-200">
                10:45 AM • Auto-drafted by AI
              </div>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="bg-black border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Reply via ${activeThread.channel}...`}
              className="w-full bg-transparent border-none p-4 text-sm text-white resize-none h-20 focus:outline-none"
            />
            <div className="flex justify-between items-center px-4 py-2 border-t border-white/5 bg-white/[0.02]">
              <div className="flex space-x-2 text-gray-400">
                <button className="p-1.5 hover:text-white transition-colors rounded"><Paperclip size={16} /></button>
                <button className="p-1.5 hover:text-white transition-colors rounded"><Clock size={16} /></button>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors">
                Send <Send size={14} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
