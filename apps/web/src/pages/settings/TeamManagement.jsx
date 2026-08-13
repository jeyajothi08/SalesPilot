import React, { useState } from 'react';
import { UserPlus, MoreVertical, Search, Filter, Shield, Briefcase } from 'lucide-react';

export default function TeamManagement() {
  const [members] = useState([
    { id: 1, name: 'John Doe', email: 'john@salespilot.ai', role: 'Super Admin', department: 'Executive', status: 'active', joined: 'Oct 12, 2025' },
    { id: 2, name: 'Jane Smith', email: 'jane@salespilot.ai', role: 'Sales Exec', department: 'Sales', status: 'active', joined: 'Nov 04, 2025' },
    { id: 3, name: 'Mike Ross', email: 'mike@salespilot.ai', role: 'Support Agent', department: 'Customer Success', status: 'invited', joined: 'Pending' }
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans text-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Team Management</h1>
          <p className="text-[#94A3B8] mt-1 text-sm">Manage users, departments, and organization structure.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
          <UserPlus size={16} className="mr-2" /> Invite Member
        </button>
      </div>

      <div className="bg-[#0F172A] rounded-2xl border border-[#1E293B] overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#070B14]">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
              <input 
                type="text" 
                placeholder="Search members..." 
                className="w-64 pl-9 pr-3 py-2 bg-[#0F172A] border border-[#263247] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] outline-none"
              />
            </div>
            <button className="p-2 border border-[#263247] rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] transition-colors cursor-pointer">
              <Filter size={16} />
            </button>
          </div>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">3 Total Users</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">1 Pending Invite</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#070B14] text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-[#1E293B]/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-[#F8FAFC]">{member.name}</p>
                        <p className="text-xs text-[#94A3B8]">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-[#CBD5E1]">
                      <Shield size={14} className="mr-2 text-[#64748B]" />
                      {member.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-[#CBD5E1]">
                      <Briefcase size={14} className="mr-2 text-[#64748B]" />
                      {member.department}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      member.status === 'active' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {member.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />}
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">
                    {member.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#64748B] hover:text-[#F8FAFC] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
