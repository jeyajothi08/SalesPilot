import React, { useEffect, useState, useMemo } from 'react';
import { Command } from 'cmdk';
import { Search, Users, FileText, Phone, Mail, MessageSquare, Settings, Sparkles, LayoutDashboard, Network, Building2, Plus, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCRM } from '../context/CRMContext';
import EmailComposerModal from '../components/communication/EmailComposerModal';
import MessagingModal from '../components/communication/MessagingModal';

export const CommandPalette = ({ onOpenApp }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { deals } = useCRM();

  // Selected contact for email/message modal
  const [emailContact, setEmailContact] = useState(null);
  const [messageContact, setMessageContact] = useState(null);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Filter CRM contacts matching search query
  const matchingContacts = useMemo(() => {
    if (!inputValue.trim()) return deals.slice(0, 4);
    const q = inputValue.toLowerCase();
    return deals.filter(d => 
      (d.contact && d.contact.toLowerCase().includes(q)) || 
      (d.company && d.company.toLowerCase().includes(q)) ||
      (d.email && d.email.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [deals, inputValue]);

  // Handle Quick Call
  const handleQuickCall = (c) => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('open-call-workspace', { detail: { contact: c } }));
    onOpenApp('voice');
  };

  // Handle Quick Email
  const handleQuickEmail = (c) => {
    setOpen(false);
    setEmailContact(c);
  };

  // Handle Quick Message
  const handleQuickMessage = (c) => {
    setOpen(false);
    setMessageContact(c);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-200 flex items-start justify-center pt-[12vh] font-sans">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            
            {/* Command Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-2xl bg-[#070B18] border border-slate-800 shadow-2xl rounded-2xl overflow-hidden"
            >
               <Command 
                 className="w-full flex flex-col text-white"
                 onKeyDown={(e) => {
                   if (e.key === 'Escape') setOpen(false);
                 }}
               >
                  {/* Search Input Bar */}
                  <div className="flex items-center px-4 py-4 border-b border-slate-800 bg-[#0F172A]/80">
                     <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                     <Command.Input 
                       autoFocus
                       value={inputValue}
                       onValueChange={setInputValue}
                       placeholder="Search contact name, company, or type command..." 
                       className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder:text-slate-500"
                     />
                     <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase font-mono">
                        <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">ESC</span>
                        <span>close</span>
                     </div>
                  </div>

                  <Command.List className="max-h-[60vh] overflow-y-auto p-3 space-y-3 custom-scrollbar">
                     <Command.Empty className="py-10 text-center text-slate-500 text-sm">
                        No CRM contacts or commands matching "{inputValue}".
                     </Command.Empty>

                     {/* ── QUICK CONTACT ACTION SEARCH RESULTS ──────────────── */}
                     <Command.Group heading={<span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider px-2 mb-2 block font-mono">Quick Contact Actions</span>}>
                       {matchingContacts.map((c) => (
                         <Command.Item 
                           key={c.id}
                           value={`${c.contact} ${c.company} ${c.email}`}
                           onSelect={() => {}}
                           className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-[#0F172A]/50 border border-slate-800 hover:border-slate-700 mb-2 transition-all"
                         >
                           <div className="flex items-center space-x-3">
                             <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                               {(c.contact || c.company || 'C').charAt(0).toUpperCase()}
                             </div>
                             <div>
                               <div className="text-xs font-bold text-white flex items-center gap-2">
                                 <span>{c.contact || 'Primary Contact'}</span>
                                 <span className="text-[10px] text-slate-400 font-normal">({c.company})</span>
                               </div>
                               <div className="text-[10px] text-slate-500 font-mono">
                                 {c.phone || '+1 (555) 019-2834'} • {c.email}
                               </div>
                             </div>
                           </div>

                           {/* Instant Communication Buttons */}
                           <div className="flex items-center space-x-1.5 shrink-0">
                             <button
                               onClick={(e) => { e.stopPropagation(); handleQuickCall(c); }}
                               className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                             >
                               <Phone className="w-3 h-3" />
                               <span>Call</span>
                             </button>

                             <button
                               onClick={(e) => { e.stopPropagation(); handleQuickEmail(c); }}
                               className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                             >
                               <Mail className="w-3 h-3" />
                               <span>Email</span>
                             </button>

                             <button
                               onClick={(e) => { e.stopPropagation(); handleQuickMessage(c); }}
                               className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                             >
                               <MessageSquare className="w-3 h-3" />
                               <span>Message</span>
                             </button>
                           </div>
                         </Command.Item>
                       ))}
                     </Command.Group>

                     <div className="w-full h-px bg-slate-800 my-2"></div>

                     {/* ── GLOBAL OS NAVIGATION COMMANDS ───────────────────── */}
                     <Command.Group heading={<span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-2 mb-2 block font-mono">SalesPilot Applications</span>}>
                       <Command.Item 
                         onSelect={() => { onOpenApp('crm'); setOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                       >
                          <Users className="w-4 h-4 text-blue-400" />
                          <span>Open CRM Engine & Pipelines</span>
                       </Command.Item>
                       <Command.Item 
                         onSelect={() => { onOpenApp('voice'); setOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                       >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>Open Calling Workspace</span>
                       </Command.Item>
                       <Command.Item 
                         onSelect={() => { onOpenApp('communication'); setOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                       >
                          <Mail className="w-4 h-4 text-amber-400" />
                          <span>Open Email & Messaging Hub</span>
                       </Command.Item>
                       <Command.Item 
                         onSelect={() => { onOpenApp('agents'); setOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                       >
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>Launch AI Agent Center</span>
                       </Command.Item>
                       <Command.Item 
                         onSelect={() => { onOpenApp('analytics'); setOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                       >
                          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                          <span>Open BI Analytics</span>
                       </Command.Item>
                       <Command.Item 
                         onSelect={() => { onOpenApp('workflow'); setOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                       >
                          <Network className="w-4 h-4 text-cyan-400" />
                          <span>Open Workflow Builder</span>
                       </Command.Item>
                       <Command.Item 
                         onSelect={() => { onOpenApp('settings'); setOpen(false); }}
                         className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                       >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Open Settings</span>
                       </Command.Item>
                     </Command.Group>
                  </Command.List>
               </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Quick Action Modals */}
      <EmailComposerModal
        isOpen={!!emailContact}
        onClose={() => setEmailContact(null)}
        recipientContact={emailContact}
      />

      <MessagingModal
        isOpen={!!messageContact}
        onClose={() => setMessageContact(null)}
        recipientContact={messageContact}
      />
    </>
  );
};
