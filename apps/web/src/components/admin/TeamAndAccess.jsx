import React, { useState } from 'react';
import { Users, Shield, Clock, Plus, Search, MoreHorizontal, UserCheck, Key, LogOut } from 'lucide-react';

const users = [
  { id: 1, name: 'Sarah Connor', email: 'sarah@salespilot.ai', role: 'Owner', lastActive: 'Just now', status: 'Active' },
  { id: 2, name: 'John Smith', email: 'john@salespilot.ai', role: 'Manager', lastActive: '2h ago', status: 'Active' },
  { id: 3, name: 'Emma Davis', email: 'emma@salespilot.ai', role: 'Sales Executive', lastActive: '1d ago', status: 'Inactive' },
];

const auditLogs = [
  { id: 1, user: 'Sarah Connor', action: 'Changed permissions for John Smith', module: 'User Management', time: '10:45 AM' },
  { id: 2, user: 'System', action: 'Auto-backup completed', module: 'Backup', time: '02:00 AM' },
  { id: 3, user: 'John Smith', action: 'Updated Knowledge Base', module: 'Knowledge Base', time: 'Yesterday' },
];

const TeamAndAccess = () => {
  const [activeTab, setActiveTab] = useState('users'); // users, permissions, logs

  return (
    <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 shadow-sm flex flex-col h-full overflow-hidden">
      
      {/* Header Tabs */}
      <div className="flex border-b border-border/60 bg-bg-primary/30 p-2">
        {[
          { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
          { id: 'permissions', label: 'Roles & Permissions', icon: <Shield className="w-4 h-4" /> },
          { id: 'logs', label: 'Audit Logs', icon: <Clock className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-text-muted hover:text-text-main hover:bg-bg-primary border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         
         {activeTab === 'users' && (
           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <div className="relative w-72">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                   <input type="text" placeholder="Search users..." className="w-full bg-bg-primary border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text-main focus:outline-none focus:border-primary/50" />
                 </div>
                 <button className="px-4 py-2 btn-primary flex items-center gap-2 font-bold text-sm shadow-md">
                   <Plus className="w-4 h-4" /> Invite User
                 </button>
              </div>

              <div className="border border-border/60 rounded-2xl overflow-hidden bg-bg-primary/30">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-bg-secondary/50">
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-bg-secondary/20 transition-colors group">
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm text-text-main group-hover:text-primary transition-colors">{u.name}</p>
                           <p className="text-xs text-text-muted">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-bg-secondary border border-border rounded-md text-xs font-bold text-text-muted">{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">{u.lastActive}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${u.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                             {u.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 hover:bg-bg-secondary rounded-lg text-text-muted transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
         )}

         {activeTab === 'permissions' && (
           <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <Shield className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Permission Matrix Visualization (Mock)</p>
           </div>
         )}

         {activeTab === 'logs' && (
           <div className="space-y-4">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 bg-bg-primary/50 border border-border/60 rounded-2xl flex items-start justify-between hover:bg-bg-primary transition-colors">
                  <div>
                    <p className="text-sm font-medium text-text-main"><span className="font-bold text-primary">{log.user}</span> {log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-secondary px-2 py-0.5 rounded-md border border-border">{log.module}</span>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted font-bold">{log.time}</span>
                </div>
              ))}
           </div>
         )}

      </div>

    </div>
  );
};

export default TeamAndAccess;
