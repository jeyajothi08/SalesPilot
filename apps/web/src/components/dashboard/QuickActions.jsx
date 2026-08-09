import React from 'react';
import { motion } from 'framer-motion';
import { Play, UserPlus, CalendarPlus, FileText, UploadCloud } from 'lucide-react';

const actions = [
  { id: 1, title: 'Start AI Calling', icon: <Play className="w-5 h-5" />, bg: 'bg-primary text-white hover:bg-primary-hover shadow-primary/30', border: 'border-transparent' },
  { id: 2, title: 'Add Customer', icon: <UserPlus className="w-5 h-5" />, bg: 'bg-white dark:bg-bg-secondary text-text-main hover:bg-bg-secondary dark:hover:bg-bg-primary shadow-sm', border: 'border-border' },
  { id: 3, title: 'Schedule Meeting', icon: <CalendarPlus className="w-5 h-5" />, bg: 'bg-white dark:bg-bg-secondary text-text-main hover:bg-bg-secondary dark:hover:bg-bg-primary shadow-sm', border: 'border-border' },
  { id: 4, title: 'Generate Proposal', icon: <FileText className="w-5 h-5" />, bg: 'bg-white dark:bg-bg-secondary text-text-main hover:bg-bg-secondary dark:hover:bg-bg-primary shadow-sm', border: 'border-border' },
  { id: 5, title: 'Upload Knowledge Base', icon: <UploadCloud className="w-5 h-5" />, bg: 'bg-white dark:bg-bg-secondary text-text-main hover:bg-bg-secondary dark:hover:bg-bg-primary shadow-sm', border: 'border-border' },
];

const QuickActions = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass-card bg-bg-primary p-6 relative col-span-1 lg:col-span-3 mb-8"
    >
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-main tracking-tight">Quick Actions</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {actions.map((action) => (
          <button 
            key={action.id}
            className={`flex-1 min-w-[180px] flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg font-medium text-sm ${action.bg} ${action.border}`}
          >
            {action.icon}
            <span>{action.title}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
