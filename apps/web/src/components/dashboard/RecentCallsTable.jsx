import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, PhoneCall, Mail, MessageSquare } from 'lucide-react';

const RecentCallsTable = () => {
  const [filter, setFilter] = useState('All');

  const calls = [
    { id: 1, name: 'Michael Scott', phone: '+1 (555) 123-4567', service: 'SaaS Demo', score: 92, duration: '04:12', status: 'Converted', type: 'call' },
    { id: 2, name: 'Jim Halpert', phone: '+1 (555) 234-5678', service: 'Consulting', score: 85, duration: '12:45', status: 'Follow-up', type: 'call' },
    { id: 3, name: 'Pam Beesly', phone: '+1 (555) 345-6789', service: 'Web Design', score: 98, duration: '08:30', status: 'Converted', type: 'whatsapp' },
    { id: 4, name: 'Dwight Schrute', phone: '+1 (555) 456-7890', service: 'Agriculture AI', score: 45, duration: '02:15', status: 'Not Interested', type: 'email' },
    { id: 5, name: 'Stanley Hudson', phone: '+1 (555) 567-8901', service: 'Retirement Plan', score: 72, duration: '06:20', status: 'Voicemail', type: 'call' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Converted': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
      case 'Follow-up': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Voicemail': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
      case 'Not Interested': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'call': return <PhoneCall className="w-4 h-4 text-blue-500" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'email': return <Mail className="w-4 h-4 text-purple-500" />;
      default: return <PhoneCall className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card bg-bg-primary overflow-hidden flex flex-col lg:col-span-2 h-full"
    >
      <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-main tracking-tight">Recent Interactions</h2>
          <p className="text-sm text-text-muted mt-1">Latest AI conversations and automated messages.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <button className="px-3 py-2 bg-bg-secondary border border-border rounded-xl hover:bg-border transition-colors">
            <Filter className="w-4 h-4 text-text-main" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-bg-secondary/30 border-b border-border">
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Customer</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Service</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Score</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Duration</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Status</th>
              <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {calls.map((call) => (
              <tr key={call.id} className="hover:bg-bg-secondary/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/10 to-accent-purple/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                      {call.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-main group-hover:text-primary transition-colors">{call.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{call.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(call.type)}
                    <span className="text-sm text-text-main font-medium">{call.service}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-bg-secondary rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${call.score > 80 ? 'bg-green-500' : call.score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${call.score}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold">{call.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-text-muted font-medium">{call.duration}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(call.status)}`}>
                    {call.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted hover:text-primary">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentCallsTable;
