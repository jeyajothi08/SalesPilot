import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, Phone } from 'lucide-react';

const meetings = [
  { id: 1, name: 'Acme Corp Demo', time: '14:00', duration: '30m', type: 'video', status: 'upcoming' },
  { id: 2, name: 'StartupInc Discovery', time: '15:30', duration: '45m', type: 'video', status: 'upcoming' },
  { id: 3, name: 'GlobalTech Proposal', time: '17:00', duration: '60m', type: 'phone', status: 'upcoming' },
  { id: 4, name: 'TechSolutions Sync', time: '09:00', duration: '30m', type: 'video', status: 'completed' },
];

const CalendarWidget = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card bg-bg-primary p-6 relative h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-main flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
            Upcoming Meetings
          </h2>
          <p className="text-sm text-text-muted mt-1">Today's schedule</p>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">View Calendar</button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {meetings.map((meeting) => (
          <div 
            key={meeting.id} 
            className={`p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${
              meeting.status === 'completed' 
                ? 'bg-bg-secondary/50 border-border/50 opacity-70' 
                : 'bg-white dark:bg-bg-secondary border-border hover:border-primary/30'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-semibold text-sm ${meeting.status === 'completed' ? 'text-text-muted line-through' : 'text-text-main'}`}>
                {meeting.name}
              </h4>
              <div className={`p-1.5 rounded-lg ${meeting.type === 'video' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20' : 'bg-purple-100 text-purple-600 dark:bg-purple-500/20'}`}>
                {meeting.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-text-muted font-medium">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {meeting.time}
              </span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>{meeting.duration}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-3 btn-secondary text-sm font-medium rounded-xl flex justify-center items-center">
        + Schedule Meeting
      </button>
    </motion.div>
  );
};

export default CalendarWidget;
