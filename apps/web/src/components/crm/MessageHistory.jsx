import React, { useState } from 'react';
import { Mail, MessageSquare, Check, CheckCheck } from 'lucide-react';

const mockMessages = [
  { id: 1, type: 'email', subject: 'Your AI Sales Strategy', content: 'Hi Michael, thanks for the great call today. Here is the proposal we discussed...', time: 'Today, 3:00 PM', status: 'Opened' },
  { id: 2, type: 'whatsapp', content: 'Hi Michael, checking in to see if you had any questions about the proposal?', time: 'Yesterday, 10:00 AM', status: 'Read' },
  { id: 3, type: 'whatsapp', content: 'Yes, looking good. Let us sync on Friday.', time: 'Yesterday, 11:30 AM', status: 'Received', isCustomer: true },
];

const MessageHistory = () => {
  const [filter, setFilter] = useState('all'); // all, email, whatsapp

  return (
    <div className="glass-card bg-bg-primary p-6 md:p-8 rounded-3xl border border-border">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-text-main">Message History</h3>
        
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-border">
           <button 
             onClick={() => setFilter('all')}
             className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             All
           </button>
           <button 
             onClick={() => setFilter('email')}
             className={`flex items-center px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'email' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             <Mail className="w-3.5 h-3.5 mr-1.5" /> Email
           </button>
           <button 
             onClick={() => setFilter('whatsapp')}
             className={`flex items-center px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'whatsapp' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> WhatsApp
           </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {mockMessages.filter(m => filter === 'all' || m.type === filter).map((msg) => (
          <div key={msg.id} className={`p-4 md:p-5 rounded-2xl border flex flex-col ${msg.isCustomer ? 'bg-bg-secondary/50 border-border/50 ml-8' : 'bg-bg-secondary border-border mr-8'}`}>
            
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-md ${msg.type === 'email' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20'}`}>
                  {msg.type === 'email' ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  {msg.isCustomer ? 'Customer Replied' : msg.type === 'email' ? 'Automated Email' : 'Automated WhatsApp'}
                </span>
              </div>
              <span className="text-xs font-medium text-text-muted">{msg.time}</span>
            </div>

            {msg.subject && <h4 className="text-sm font-bold text-text-main mb-1">{msg.subject}</h4>}
            <p className="text-sm text-text-main/90 bg-white/50 dark:bg-bg-primary/50 p-3 rounded-xl border border-border/50">
               {msg.content}
            </p>

            {!msg.isCustomer && (
              <div className="mt-3 flex justify-end items-center text-xs font-medium text-text-muted">
                 {msg.status === 'Read' || msg.status === 'Opened' ? (
                   <span className="flex items-center text-green-500"><CheckCheck className="w-3.5 h-3.5 mr-1" /> {msg.status}</span>
                 ) : (
                   <span className="flex items-center"><Check className="w-3.5 h-3.5 mr-1" /> {msg.status}</span>
                 )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;
