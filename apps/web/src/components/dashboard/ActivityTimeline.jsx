import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Mail, MessageSquare, CalendarCheck, FileText, CheckCircle } from 'lucide-react';

const activities = [
  { id: 1, title: 'AI Called Customer', desc: 'Speaking with Sarah from TechCorp', time: 'Just now', icon: <PhoneCall className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-100 dark:bg-blue-500/20' },
  { id: 2, title: 'Meeting Booked', desc: 'Discovery call with GrowthGen', time: '15 mins ago', icon: <CalendarCheck className="w-4 h-4 text-green-500" />, bg: 'bg-green-100 dark:bg-green-500/20' },
  { id: 3, title: 'WhatsApp Sent', desc: 'Follow-up message sent to 45 leads', time: '1 hour ago', icon: <MessageSquare className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  { id: 4, title: 'Proposal Sent', desc: 'Custom pricing sent to Innovate LLC', time: '2 hours ago', icon: <FileText className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-100 dark:bg-purple-500/20' },
  { id: 5, title: 'Email Delivered', desc: 'Cold outreach campaign finished', time: '3 hours ago', icon: <Mail className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-100 dark:bg-orange-500/20' },
  { id: 6, title: 'Lead Converted', desc: 'Michael Scott signed the contract', time: '5 hours ago', icon: <CheckCircle className="w-4 h-4 text-primary" />, bg: 'bg-primary/10' },
];

const ActivityTimeline = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card bg-bg-primary p-6 relative h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-main tracking-tight">Recent Activities</h2>
          <p className="text-sm text-text-muted mt-1">Live timeline of AI actions</p>
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto custom-scrollbar pr-4">
        {/* Vertical Line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-border"></div>

        <div className="space-y-6 relative">
          {activities.map((activity, _index) => (
            <div key={activity.id} className="flex items-start group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-bg-primary ${activity.bg} transition-transform group-hover:scale-110`}>
                {activity.icon}
              </div>
              <div className="ml-4 pt-1 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm text-text-main">{activity.title}</h4>
                  <span className="text-xs text-text-muted font-medium bg-bg-secondary px-2 py-1 rounded-md">{activity.time}</span>
                </div>
                <p className="text-xs text-text-muted">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityTimeline;
