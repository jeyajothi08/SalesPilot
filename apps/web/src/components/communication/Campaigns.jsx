import React, { useState } from 'react';
// import { motion } from 'framer-motion';
import { Target, Plus, Calendar, Users, BarChart2, Play, Pause, MoreVertical } from 'lucide-react';

const mockCampaigns = [
  { id: 1, name: 'Q3 Enterprise Outreach', status: 'Running', audience: 'Enterprise Leads', sent: 1250, open: 64, click: 22 },
  { id: 2, name: 'Inactive Users Reactivation', status: 'Scheduled', audience: 'Churn Risk', sent: 0, open: 0, click: 0 },
  { id: 3, name: 'Webinar Follow-up', status: 'Completed', audience: 'Webinar Attendees', sent: 840, open: 72, click: 45 },
  { id: 4, name: 'New Feature Announcement', status: 'Draft', audience: 'All Customers', sent: 0, open: 0, click: 0 },
];

const Campaigns = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Running', 'Scheduled', 'Draft', 'Completed'];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Campaigns
          </h2>
          <p className="text-sm text-text-muted mt-1">Manage and track your multi-channel outreach campaigns.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 border border-border rounded-xl font-bold text-sm bg-bg-secondary hover:bg-bg-secondary/80 text-text-main transition-colors flex items-center gap-2 shadow-sm">
             <Calendar className="w-4 h-4" />
             Schedule
           </button>
           <button className="px-4 py-2 btn-primary flex items-center gap-2 font-bold text-sm shadow-md">
             <Plus className="w-4 h-4" />
             New Campaign
           </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === filter 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-bg-secondary text-text-muted hover:text-text-main border border-border hover:border-primary/30'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatBadge label="Total Campaigns" value="12" />
        <StatBadge label="Active" value="3" color="text-green-500" />
        <StatBadge label="Total Sent (This Month)" value="14,250" />
        <StatBadge label="Avg Conversion" value="4.2%" highlight />
      </div>

      <div className="glass-card bg-bg-secondary/50 rounded-3xl border border-border overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border bg-bg-primary/30">
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Campaign Name</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Target Audience</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Performance</th>
                 <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {mockCampaigns.map((camp) => (
                 <tr key={camp.id} className="hover:bg-bg-primary/50 transition-colors group">
                   <td className="px-6 py-4">
                     <p className="font-bold text-sm text-text-main group-hover:text-primary transition-colors">{camp.name}</p>
                   </td>
                   <td className="px-6 py-4">
                     <StatusBadge status={camp.status} />
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-sm text-text-muted">
                       <Users className="w-4 h-4" />
                       {camp.audience}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                      {camp.status !== 'Scheduled' && camp.status !== 'Draft' ? (
                        <div className="flex gap-4 text-xs font-medium text-text-muted">
                           <div><span className="font-bold text-text-main">{camp.sent.toLocaleString()}</span> Sent</div>
                           <div><span className="font-bold text-green-500">{camp.open}%</span> Open</div>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted italic">No data yet</span>
                      )}
                   </td>
                   <td className="px-6 py-4 text-right">
                     <div className="flex justify-end items-center gap-2">
                       {camp.status === 'Running' ? (
                         <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Pause className="w-4 h-4" /></button>
                       ) : (
                         <button className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"><Play className="w-4 h-4" /></button>
                       )}
                       <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"><BarChart2 className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-bg-secondary rounded-lg text-text-muted transition-colors"><MoreVertical className="w-4 h-4" /></button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

    </div>
  );
};

const StatBadge = ({ label, value, color, highlight }) => (
  <div className={`p-4 rounded-2xl border ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-bg-secondary border-border'}`}>
    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color || (highlight ? 'text-primary' : 'text-text-main')}`}>{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    Running: 'bg-green-500/10 text-green-500 border-green-500/20',
    Scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    Completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${colors[status] || colors.Draft}`}>
      {status}
    </span>
  );
};

export default Campaigns;
