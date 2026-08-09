import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Users, FileText, Phone, Settings, Sparkles, LayoutDashboard, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette = ({ onOpenApp }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-200 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Command Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-2xl bg-ds-surface/90 border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
          >
             <Command 
               className="w-full flex flex-col text-ds-text-primary"
               onKeyDown={(e) => {
                 if (e.key === 'Escape') setOpen(false);
               }}
             >
                <div className="flex items-center px-4 py-4 border-b border-white/5">
                   <Search className="w-5 h-5 text-ds-text-secondary mr-3" />
                   <Command.Input 
                     autoFocus
                     value={inputValue}
                     onValueChange={setInputValue}
                     placeholder="Type a command or search..." 
                     className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-ds-text-tertiary"
                   />
                   <div className="flex items-center gap-1 text-[10px] font-bold text-ds-text-tertiary uppercase">
                      <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">ESC</span>
                      <span>to close</span>
                   </div>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                   <Command.Empty className="py-12 text-center text-ds-text-secondary">
                      No results found for "{inputValue}".
                   </Command.Empty>

                   <Command.Group heading={<span className="text-xs font-bold text-ds-text-tertiary uppercase px-2 mb-2 block">AI Commands</span>}>
                     <Command.Item 
                       onSelect={() => { onOpenApp('copilot'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-ds-accent/10 hover:text-ds-accent transition-colors data-[selected=true]:bg-ds-accent/10 data-[selected=true]:text-ds-accent"
                     >
                        <Sparkles className="w-4 h-4 text-ds-accent" />
                        <span>Ask AI Copilot</span>
                     </Command.Item>
                   </Command.Group>

                   <div className="w-full h-px bg-white/5 my-2"></div>

                   <Command.Group heading={<span className="text-xs font-bold text-ds-text-tertiary uppercase px-2 mb-2 block">Applications</span>}>
                     <Command.Item 
                       onSelect={() => { onOpenApp('crm'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <Users className="w-4 h-4 text-blue-400" />
                        <span>Open CRM Pipeline</span>
                     </Command.Item>
                     <Command.Item 
                       onSelect={() => { onOpenApp('voice'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <Phone className="w-4 h-4 text-green-400" />
                        <span>Launch Voice Agent</span>
                     </Command.Item>
                     <Command.Item 
                       onSelect={() => { onOpenApp('billing'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>Open Billing & Subscription</span>
                     </Command.Item>
                     <Command.Item 
                       onSelect={() => { onOpenApp('marketing'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Launch Marketing Engine</span>
                     </Command.Item>
                     <Command.Item 
                       onSelect={() => { onOpenApp('proposals'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <FileText className="w-4 h-4 text-orange-400" />
                        <span>Generate Proposal</span>
                     </Command.Item>
                     <Command.Item 
                       onSelect={() => { onOpenApp('analytics'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span>Open Analytics</span>
                     </Command.Item>
                     <Command.Item 
                       onSelect={() => { onOpenApp('workflow'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <Network className="w-4 h-4 text-indigo-400" />
                        <span>Open Workflow Builder</span>
                     </Command.Item>
                     <Command.Item 
                       onSelect={() => { onOpenApp('settings'); setOpen(false); }}
                       className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors data-[selected=true]:bg-white/5"
                     >
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>Open Settings</span>
                     </Command.Item>
                   </Command.Group>
                </Command.List>
             </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
