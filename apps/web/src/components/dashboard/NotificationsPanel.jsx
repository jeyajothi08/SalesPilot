import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, MessageSquare, Mail, Calendar } from 'lucide-react';

const notifications = [
  { id: 1, title: 'Meeting Booked', desc: 'Sarah Jenkins scheduled a call', time: '5m ago', icon: <Calendar className="w-4 h-4 text-primary" />, read: false },
  { id: 2, title: 'Customer Replied', desc: 'Michael Scott responded to email', time: '12m ago', icon: <MessageSquare className="w-4 h-4 text-green-500" />, read: false },
  { id: 3, title: 'Email Delivered', desc: 'Campaign "Q3 Outreach" finished', time: '1h ago', icon: <Mail className="w-4 h-4 text-orange-500" />, read: true },
  { id: 4, title: 'Call Completed', desc: 'AI agent finished call with Dwight', time: '2h ago', icon: <CheckCircle className="w-4 h-4 text-purple-500" />, read: true },
];

const NotificationsPanel = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile closing, or clicking outside */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 sm:right-8 w-80 sm:w-96 glass-card bg-bg-primary shadow-2xl rounded-2xl z-50 border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border flex justify-between items-center bg-bg-secondary/50">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-text-main" />
                <h3 className="font-bold text-text-main">Notifications</h3>
              </div>
              <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
            </div>
            
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 border-b border-border hover:bg-bg-secondary transition-colors cursor-pointer flex items-start space-x-3 ${!notif.read ? 'bg-primary/5' : ''}`}>
                  <div className="p-2 bg-white dark:bg-bg-secondary rounded-full shadow-sm shrink-0 border border-border">
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className={`text-sm ${!notif.read ? 'font-bold text-text-main' : 'font-semibold text-text-main'}`}>{notif.title}</h4>
                      <span className="text-xs text-text-muted font-medium">{notif.time}</span>
                    </div>
                    <p className="text-xs text-text-muted">{notif.desc}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-bg-secondary/50 text-center border-t border-border hover:bg-bg-secondary transition-colors cursor-pointer">
              <span className="text-sm text-primary font-medium">View all notifications</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
