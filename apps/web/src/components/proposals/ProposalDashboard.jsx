import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, FileText, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const mockProposals = [
  { id: 'PRP-2026-001', client: 'Acme Corp', amount: '$45,000', status: 'Accepted', date: 'Oct 12, 2026' },
  { id: 'PRP-2026-002', client: 'TechNova', amount: '$12,500', status: 'Sent', date: 'Oct 14, 2026' },
  { id: 'PRP-2026-003', client: 'Global Industries', amount: '$85,000', status: 'Viewed', date: 'Oct 15, 2026' },
  { id: 'PRP-2026-004', client: 'Local Startup', amount: '$4,200', status: 'Draft', date: 'Today' },
  { id: 'PRP-2026-005', client: 'Mega Retail', amount: '$120,000', status: 'Rejected', date: 'Oct 01, 2026' },
];

const ProposalDashboard = ({ onCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search proposals by client or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button className="p-2.5 border border-border rounded-xl hover:bg-bg-secondary text-text-muted hover:text-text-main transition-colors shadow-sm">
             <Filter className="w-4 h-4" />
           </button>
           <button 
             onClick={onCreate}
             className="px-6 py-2.5 btn-primary flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 flex-1 md:flex-none transition-all hover:-translate-y-0.5"
           >
             <Plus className="w-4 h-4" />
             Create Proposal
           </button>
        </div>
      </div>

      {/* Proposal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 overflow-y-auto custom-scrollbar pb-4">
         {mockProposals.map((proposal, idx) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.05 }}
             key={proposal.id} 
             className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-5 hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
           >
              <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-bg-primary rounded-xl border border-border shadow-sm group-hover:bg-primary/5 group-hover:border-primary/30 transition-colors">
                    <FileText className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                 </div>
                 <button className="p-2 text-text-muted hover:bg-bg-primary rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex-1">
                 <h3 className="font-bold text-text-main text-lg mb-1 group-hover:text-primary transition-colors">{proposal.client}</h3>
                 <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">{proposal.id}</p>
              </div>

              <div className="flex justify-between items-end mt-4 pt-4 border-t border-border/50">
                 <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Value</p>
                    <p className="font-extrabold text-text-main">{proposal.amount}</p>
                 </div>
                 <div className="text-right">
                    <StatusBadge status={proposal.status} />
                    <p className="text-[10px] font-medium text-text-muted mt-1">{proposal.date}</p>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    Accepted: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> },
    Sent: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Clock className="w-3 h-3 mr-1" /> },
    Viewed: { color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <AlertCircle className="w-3 h-3 mr-1" /> },
    Rejected: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle className="w-3 h-3 mr-1" /> },
    Draft: { color: 'text-text-muted', bg: 'bg-bg-primary', border: 'border-border', icon: <FileText className="w-3 h-3 mr-1" /> },
  };

  const { color, bg, border, icon } = config[status] || config.Draft;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${color} ${bg} ${border}`}>
       {icon}
       {status}
    </span>
  );
};

export default ProposalDashboard;
