import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Paperclip, Zap, Clock, Save, Eye, Bold, Italic, Underline, Link, List, ListOrdered, Image as ImageIcon } from 'lucide-react';

const MessageComposer = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'whatsapp'
  const [aiMode, setAiMode] = useState(true);

  // AI Inputs
  const [customerName, setCustomerName] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('Professional');

  // Manual Inputs
  const [to, setTo] = useState('');
  const [_cc, _setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-bg-primary w-full max-w-5xl rounded-[32px] shadow-2xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh]"
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-bg-secondary/30">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Composer
            </h2>
            <div className="flex bg-bg-primary border border-border rounded-xl p-1">
              <button 
                onClick={() => setActiveTab('email')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeTab === 'email' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}
              >
                Email
              </button>
              <button 
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeTab === 'whatsapp' ? 'bg-green-500 text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}
              >
                WhatsApp
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-xl text-text-muted hover:text-text-main transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: AI Generator */}
          {aiMode && (
            <div className="w-full md:w-1/3 bg-bg-secondary/20 border-r border-border p-6 overflow-y-auto custom-scrollbar flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-6">AI Parameters</h3>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Customer Name</label>
                  <input type="text" className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-text-main" placeholder="e.g. John Doe" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Company</label>
                  <input type="text" className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-text-main" placeholder="e.g. TechNova" value={company} onChange={e => setCompany(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Purpose / Context</label>
                  <textarea rows={3} className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-text-main resize-none" placeholder="e.g. Follow up on the website proposal discussed last Tuesday." value={purpose} onChange={e => setPurpose(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-main mb-1">Tone</label>
                  <select className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 text-text-main" value={tone} onChange={e => setTone(e.target.value)}>
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Formal</option>
                    <option>Casual</option>
                    <option>Persuasive</option>
                  </select>
                </div>
              </div>

              <button className={`w-full py-3.5 mt-6 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 ${activeTab === 'email' ? 'btn-primary shadow-primary/30' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'}`}>
                <Zap className="w-4 h-4" />
                Generate {activeTab === 'email' ? 'Email' : 'Message'}
              </button>
            </div>
          )}

          {/* Right Panel: Editor */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">Compose</h3>
               <button onClick={() => setAiMode(!aiMode)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${aiMode ? 'bg-primary/10 text-primary border-primary/20' : 'bg-bg-secondary text-text-muted border-border hover:text-text-main'}`}>
                 {aiMode ? 'Hide AI Panel' : 'Show AI Panel'}
               </button>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              
              <div className="flex items-center gap-4 border-b border-border pb-2">
                <span className="text-sm font-bold text-text-muted w-16">To:</span>
                <input type="text" className="flex-1 bg-transparent text-sm text-text-main focus:outline-none" placeholder="recipients..." value={to} onChange={e => setTo(e.target.value)} />
                <button className="text-xs font-bold text-text-muted hover:text-primary transition-colors">Cc/Bcc</button>
              </div>

              {activeTab === 'email' && (
                <div className="flex items-center gap-4 border-b border-border pb-2">
                  <span className="text-sm font-bold text-text-muted w-16">Subject:</span>
                  <input type="text" className="flex-1 bg-transparent text-sm text-text-main focus:outline-none font-medium" placeholder="Email subject..." value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
              )}

              {/* Rich Text Toolbar (Visual Mock) */}
              {activeTab === 'email' && (
                <div className="flex items-center gap-1 py-2 border-b border-border">
                  <ToolbarBtn icon={<Bold className="w-4 h-4" />} />
                  <ToolbarBtn icon={<Italic className="w-4 h-4" />} />
                  <ToolbarBtn icon={<Underline className="w-4 h-4" />} />
                  <div className="w-[1px] h-4 bg-border mx-2"></div>
                  <ToolbarBtn icon={<Link className="w-4 h-4" />} />
                  <ToolbarBtn icon={<ImageIcon className="w-4 h-4" />} />
                  <div className="w-[1px] h-4 bg-border mx-2"></div>
                  <ToolbarBtn icon={<List className="w-4 h-4" />} />
                  <ToolbarBtn icon={<ListOrdered className="w-4 h-4" />} />
                </div>
              )}

              {/* Editor Body */}
              <div className="flex-1 py-4">
                <textarea 
                  className="w-full h-full bg-transparent text-sm text-text-main focus:outline-none resize-none" 
                  placeholder={activeTab === 'email' ? 'Write your email here...' : 'Write your WhatsApp message here...'}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                />
              </div>

            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 md:p-6 border-t border-border bg-bg-secondary/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-muted hover:text-text-main hover:bg-bg-secondary rounded-xl transition-colors" title="Attach Files">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-text-muted hover:text-text-main hover:bg-bg-secondary rounded-xl transition-colors" title="Preview">
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold text-text-main bg-bg-secondary border border-border hover:bg-bg-secondary/80 transition-colors flex justify-center items-center gap-2">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold text-text-main bg-bg-secondary border border-border hover:bg-bg-secondary/80 transition-colors flex justify-center items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule
            </button>
            <button className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg flex justify-center items-center gap-2 transition-transform hover:-translate-y-0.5 ${activeTab === 'email' ? 'btn-primary shadow-primary/30' : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'}`}>
              <Send className="w-4 h-4" />
              Send Now
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const ToolbarBtn = ({ icon }) => (
  <button className="p-1.5 text-text-muted hover:text-text-main hover:bg-bg-secondary rounded-md transition-colors">
    {icon}
  </button>
);

export default MessageComposer;
