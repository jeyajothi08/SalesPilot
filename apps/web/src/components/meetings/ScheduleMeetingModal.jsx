import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar as CalIcon, Users, Video, Globe, Sparkles } from 'lucide-react';

const ScheduleMeetingModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card bg-bg-primary w-full max-w-3xl rounded-[32px] border border-border shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/50">
          <div>
            <h2 className="text-xl font-bold text-text-main">Schedule New Meeting</h2>
            <p className="text-sm text-text-muted mt-1 font-medium">Manually override AI and book an appointment.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white dark:bg-bg-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-border">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8 flex-1">
          
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Select Customer</label>
               <div className="relative">
                 <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                 <select className="w-full pl-9 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:border-primary font-medium appearance-none">
                   <option>Michael Scott (Dunder Mifflin)</option>
                   <option>Jim Halpert (Athlead)</option>
                   <option>New Customer...</option>
                 </select>
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Meeting Type</label>
               <div className="relative">
                 <Video className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                 <select className="w-full pl-9 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:border-primary font-medium appearance-none">
                   <option>Zoom Video Call</option>
                   <option>Google Meet</option>
                   <option>Phone Call</option>
                   <option>In-Person Visit</option>
                 </select>
               </div>
            </div>
          </div>

          {/* AI Smart Time Suggestions */}
          <div>
             <div className="flex items-center justify-between mb-3">
               <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Date & Time</label>
               <span className="flex items-center text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                 <Sparkles className="w-3 h-3 mr-1" /> AI Suggested
               </span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer">
                   <p className="text-sm font-bold text-primary mb-1">Tomorrow, Oct 25</p>
                   <p className="text-xs font-medium text-text-muted">10:00 AM - 10:45 AM</p>
                   <p className="text-[10px] font-bold text-green-500 mt-2 bg-green-500/10 inline-block px-2 py-0.5 rounded">Optimal Time</p>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-bg-secondary hover:border-primary/50 transition-colors cursor-pointer">
                   <p className="text-sm font-bold text-text-main mb-1">Friday, Oct 27</p>
                   <p className="text-xs font-medium text-text-muted">2:00 PM - 2:45 PM</p>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-bg-secondary hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                   <CalIcon className="w-5 h-5 text-text-muted mb-1" />
                   <p className="text-xs font-bold text-text-main">Custom Date</p>
                </div>
             </div>

             <div className="flex items-center text-xs text-text-muted font-medium bg-bg-secondary p-3 rounded-xl border border-border">
               <Globe className="w-4 h-4 mr-2" />
               Timezone: America/New_York (EST). Customer is in same timezone. No conflicts detected.
             </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1">Meeting Agenda / Notes</label>
             <textarea 
               rows="3" 
               className="w-full p-4 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:border-primary font-medium custom-scrollbar"
               placeholder="Enter agenda items to automatically include in the calendar invite..."
               defaultValue="1. Introduction to SalesPilot AI&#10;2. Product Demonstration&#10;3. Pricing discussion"
             ></textarea>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-bg-secondary/50 flex justify-end space-x-3">
           <button onClick={onClose} className="px-6 py-3 bg-white dark:bg-bg-primary border border-border rounded-xl font-bold text-sm text-text-main hover:bg-gray-50 transition-colors">
             Cancel
           </button>
           <button className="px-6 py-3 btn-primary rounded-xl font-bold text-sm shadow-md flex items-center">
             <CalendarIcon className="w-4 h-4 mr-2" /> Send Calendar Invite
           </button>
        </div>

      </motion.div>
    </div>
  );
};

// Extracted to avoid naming conflict with lucide Calendar
const CalendarIcon = CalIcon; 

export default ScheduleMeetingModal;
