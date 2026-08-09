import React from 'react';
import { Zap, Play, Mail, MessageSquare, Clock, Plus, Settings, CheckCircle2, ChevronRight, Handshake, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultFlow = [
  { id: 1, type: 'trigger', label: 'If Meeting Booked', icon: <Play className="w-5 h-5 text-purple-500" />, color: 'border-purple-500/30 bg-purple-500/5' },
  { id: 2, type: 'action', label: 'Send Confirmation Email', icon: <Mail className="w-5 h-5 text-blue-500" />, color: 'border-blue-500/30 bg-blue-500/5' },
  { id: 3, type: 'action', label: 'Send WhatsApp Confirmation', icon: <MessageSquare className="w-5 h-5 text-green-500" />, color: 'border-green-500/30 bg-green-500/5' },
  { id: 4, type: 'delay', label: 'Wait 24 Hours', icon: <Clock className="w-5 h-5 text-orange-500" />, color: 'border-orange-500/30 bg-orange-500/5' },
  { id: 5, type: 'action', label: '24-hour Reminder Email', icon: <Mail className="w-5 h-5 text-blue-500" />, color: 'border-blue-500/30 bg-blue-500/5' },
  { id: 6, type: 'delay', label: 'Wait until 1 hr before', icon: <Clock className="w-5 h-5 text-orange-500" />, color: 'border-orange-500/30 bg-orange-500/5' },
  { id: 7, type: 'action', label: '1-hour WhatsApp Reminder', icon: <MessageSquare className="w-5 h-5 text-green-500" />, color: 'border-green-500/30 bg-green-500/5' },
  { id: 8, type: 'delay', label: 'After Meeting Completes', icon: <CheckCircle2 className="w-5 h-5 text-primary" />, color: 'border-primary/30 bg-primary/5' },
  { id: 9, type: 'action', label: 'Thank You Message', icon: <Handshake className="w-5 h-5 text-pink-500" />, color: 'border-pink-500/30 bg-pink-500/5' },
  { id: 10, type: 'action', label: 'Proposal Email', icon: <FileText className="w-5 h-5 text-yellow-500" />, color: 'border-yellow-500/30 bg-yellow-500/5' },
];

const AutomationFlowBuilder = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Automation Rules
          </h2>
          <p className="text-sm text-text-muted mt-1">Design multi-channel communication sequences automatically triggered by events.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 border border-border rounded-xl font-bold text-sm bg-bg-secondary hover:bg-bg-secondary/80 text-text-main transition-colors flex items-center gap-2 shadow-sm">
             <Settings className="w-4 h-4" />
             Flow Settings
           </button>
           <button className="px-4 py-2 btn-primary flex items-center gap-2 font-bold text-sm shadow-md">
             <Plus className="w-4 h-4" />
             Create New Rule
           </button>
        </div>
      </div>

      <div className="flex gap-6 min-h-[600px]">
         
         {/* Left Sidebar: Templates & Triggers */}
         <div className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-4">
            <div className="glass-card bg-bg-secondary/30 rounded-3xl border border-border p-4 flex-1">
               <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Rule Templates</h3>
               <div className="space-y-2">
                  {['Meeting Booking', 'New Lead Signup', 'Payment Failed', 'Contract Signed', 'Trial Expiring'].map((t, i) => (
                    <div key={i} className={`p-3 rounded-xl border cursor-pointer text-sm font-bold transition-all ${i === 0 ? 'bg-primary/10 border-primary/30 text-primary shadow-sm' : 'bg-bg-primary border-border text-text-muted hover:border-primary/50'}`}>
                      {t}
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Main Builder Canvas */}
         <div className="flex-1 glass-card bg-bg-secondary/10 relative rounded-3xl border border-border overflow-hidden flex flex-col">
            
            {/* Canvas Header */}
            <div className="p-4 border-b border-border bg-bg-primary/50 backdrop-blur-md flex justify-between items-center z-10">
               <div>
                 <h3 className="font-bold text-text-main">Meeting Booking Flow</h3>
                 <p className="text-xs text-text-muted">Status: <span className="text-green-500 font-bold">Active</span></p>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-text-muted">Auto-Save On</span>
                 <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                 </div>
               </div>
            </div>

            {/* Canvas Area with Nodes */}
            <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center custom-scrollbar">
               
               {/* Background Grid Pattern */}
               <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

               <div className="relative z-10 flex flex-col items-center w-full max-w-lg pb-10">
                 
                 {defaultFlow.map((node, index) => (
                   <React.Fragment key={node.id}>
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.05 }}
                       className={`w-full glass-card p-4 rounded-2xl border flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all ${node.color}`}
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white dark:bg-bg-primary shadow-sm flex items-center justify-center border border-border/50">
                             {node.icon}
                           </div>
                           <div>
                             <p className="text-xs font-bold uppercase tracking-wider text-text-muted opacity-70 mb-0.5">{node.type}</p>
                             <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{node.label}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-text-muted transition-colors"><Settings className="w-4 h-4" /></button>
                        </div>
                     </motion.div>

                     {/* Connector Line */}
                     {index < defaultFlow.length - 1 && (
                        <div className="h-8 w-[2px] bg-border my-1 relative flex justify-center">
                          {/* Animated particle flowing down */}
                          <motion.div 
                            animate={{ y: [0, 32], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-primary absolute top-0"
                          />
                        </div>
                     )}
                   </React.Fragment>
                 ))}

                 <button className="mt-6 w-12 h-12 rounded-full bg-bg-secondary border border-dashed border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary hover:bg-primary/5 transition-all shadow-sm">
                   <Plus className="w-6 h-6" />
                 </button>

               </div>
            </div>

         </div>

      </div>

    </div>
  );
};

export default AutomationFlowBuilder;
