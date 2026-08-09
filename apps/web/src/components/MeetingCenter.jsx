import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Users, Activity, Plus } from 'lucide-react';

import InteractiveCalendar from './meetings/InteractiveCalendar';
import MeetingDetails from './meetings/MeetingDetails';
import ScheduleMeetingModal from './meetings/ScheduleMeetingModal';

const mockMeetingStats = [
  { label: "Today's Meetings", value: "8", icon: <Clock className="w-4 h-4 text-primary" />, bg: "bg-blue-100 dark:bg-blue-500/20" },
  { label: "Upcoming (This Week)", value: "24", icon: <CalendarIcon className="w-4 h-4 text-purple-500" />, bg: "bg-purple-100 dark:bg-purple-500/20" },
  { label: "Completed", value: "142", icon: <CheckCircle className="w-4 h-4 text-green-500" />, bg: "bg-green-100 dark:bg-green-500/20" },
  { label: "Cancelled", value: "12", icon: <XCircle className="w-4 h-4 text-red-500" />, bg: "bg-red-100 dark:bg-red-500/20" },
  { label: "Success Rate", value: "92%", icon: <Activity className="w-4 h-4 text-orange-500" />, bg: "bg-orange-100 dark:bg-orange-500/20" },
  { label: "Avg Duration", value: "34m", icon: <Users className="w-4 h-4 text-emerald-500" />, bg: "bg-emerald-100 dark:bg-emerald-500/20" },
];

const MeetingCenter = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto pb-12 relative"
    >
      
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3 text-primary" />
            Meeting Center
          </h1>
          <p className="text-sm text-text-muted mt-2 max-w-3xl font-medium">
            Manage AI-scheduled meetings, customer appointments, and calendar events from one beautiful dashboard.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 btn-primary flex justify-center items-center gap-2 font-bold text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>

      {/* Conditional Rendering: Calendar vs Detail View */}
      <AnimatePresence mode="wait">
        
        {selectedMeeting ? (
          
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MeetingDetails meeting={selectedMeeting} onBack={() => setSelectedMeeting(null)} />
          </motion.div>

        ) : (

          <motion.div 
            key="calendar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Top Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {mockMeetingStats.map((stat, idx) => (
                 <div key={idx} className="glass-card bg-bg-primary border border-border p-4 rounded-2xl flex flex-col justify-center transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                       <div className={`p-1.5 rounded-lg ${stat.bg}`}>{stat.icon}</div>
                       <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted truncate">{stat.label}</p>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-text-main">{stat.value}</h3>
                 </div>
               ))}
            </div>

            {/* Interactive Calendar UI */}
            <div className="glass-card bg-bg-primary rounded-[32px] border border-border shadow-sm p-6 overflow-hidden">
               <InteractiveCalendar onMeetingClick={(meeting) => setSelectedMeeting(meeting)} />
            </div>
          </motion.div>

        )}

      </AnimatePresence>

      {/* Schedule Meeting Modal */}
      <AnimatePresence>
        {isModalOpen && <ScheduleMeetingModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>

    </motion.div>
  );
};

export default MeetingCenter;
