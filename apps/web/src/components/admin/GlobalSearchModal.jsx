import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, PhoneCall, FileText, Settings, X, Calendar } from 'lucide-react';

const mockResults = [
  { id: 1, type: 'Customer', title: 'Acme Corp', subtitle: 'Enterprise Tier', icon: <User className="w-4 h-4" /> },
  { id: 2, type: 'Meeting', title: 'Q4 Strategy Review', subtitle: 'Oct 15, 2:00 PM', icon: <Calendar className="w-4 h-4" /> },
  { id: 3, type: 'Call', title: 'Outbound: John Doe', subtitle: 'Completed • 5m 22s', icon: <PhoneCall className="w-4 h-4" /> },
  { id: 4, type: 'Invoice', title: 'INV-2026-10', subtitle: '$999.00 • Paid', icon: <FileText className="w-4 h-4" /> },
  { id: 5, type: 'Setting', title: 'API Configurations', subtitle: 'System > Integrations', icon: <Settings className="w-4 h-4" /> },
];

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-bg-secondary/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
           {/* Search Input */}
           <div className="flex items-center px-4 py-4 border-b border-border bg-bg-primary/50">
             <Search className="w-6 h-6 text-primary mr-3" />
             <input 
               autoFocus
               type="text" 
               placeholder="Search customers, users, meetings, invoices..."
               className="flex-1 bg-transparent border-none focus:outline-none text-lg text-text-main font-medium placeholder-text-muted"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
             <button onClick={onClose} className="p-1 text-text-muted hover:text-text-main hover:bg-bg-secondary rounded-lg transition-colors">
               <X className="w-5 h-5" />
             </button>
           </div>

           {/* Results Area */}
           <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              
              {query.length === 0 ? (
                <div className="p-8 text-center text-text-muted">
                  <p className="text-sm font-medium">Type to start searching across the platform...</p>
                  <div className="flex justify-center gap-2 mt-4 text-xs">
                     <span className="px-2 py-1 bg-bg-secondary border border-border rounded-md font-bold">CMD</span>
                     <span className="px-2 py-1 bg-bg-secondary border border-border rounded-md font-bold">K</span>
                     <span className="ml-2">to open search anywhere</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="px-3 py-2 text-xs font-bold text-text-muted uppercase tracking-wider">Top Results for "{query}"</p>
                  {mockResults.map(res => (
                    <div key={res.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer group">
                      <div className="p-2 bg-bg-secondary rounded-lg border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                        {res.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-sm group-hover:text-primary transition-colors">{res.title}</h4>
                        <p className="text-xs text-text-muted">{res.type} • {res.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

           </div>

           {/* Footer */}
           <div className="px-4 py-3 bg-bg-primary/50 border-t border-border flex items-center justify-between text-xs text-text-muted">
             <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-bg-secondary rounded border border-border font-bold">↑</kbd><kbd className="px-1.5 py-0.5 bg-bg-secondary rounded border border-border font-bold">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-bg-secondary rounded border border-border font-bold">Enter</kbd> to select</span>
             </div>
             <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-bg-secondary rounded border border-border font-bold">ESC</kbd> to dismiss</span>
           </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

export default GlobalSearchModal;
