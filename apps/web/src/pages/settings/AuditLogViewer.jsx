import React, { useState } from 'react';
import { Search, Calendar, Filter, Download } from 'lucide-react';

export default function AuditLogViewer() {
  const [logs] = useState([
    { id: 1, action: 'user_login', resource: 'session', user: 'john@salespilot.ai', ip: '192.168.1.1', time: '10:45 AM, Today', status: 'success' },
    { id: 2, action: 'role_updated', resource: 'role_id: 2', user: 'admin@salespilot.ai', ip: '10.0.0.45', time: '09:12 AM, Today', status: 'success' },
    { id: 3, action: 'customer_deleted', resource: 'cust_id: 8821', user: 'jane@salespilot.ai', ip: '192.168.1.5', time: 'Yesterday', status: 'warning' },
    { id: 4, action: 'failed_login', resource: 'session', user: 'unknown', ip: '114.12.55.90', time: 'Yesterday', status: 'danger' },
    { id: 5, action: 'campaign_launched', resource: 'camp_id: 11', user: 'marketing@salespilot.ai', ip: '192.168.1.12', time: 'Oct 15, 2025', status: 'success' },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans text-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Audit Logs</h1>
          <p className="text-[#94A3B8] mt-1 text-sm">Enterprise compliance and security event monitoring.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#0F172A] border border-[#263247] hover:bg-[#1E293B] text-[#F8FAFC] text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer">
          <Download size={16} className="mr-2 text-[#3B82F6]" /> Export CSV
        </button>
      </div>

      <div className="bg-[#0F172A] rounded-2xl border border-[#1E293B] overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#070B14]">
          <div className="flex items-center space-x-3 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
              <input 
                type="text" 
                placeholder="Search events, users, or IPs..." 
                className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-[#263247] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#3B82F6] outline-none"
              />
            </div>
            <div className="relative w-48">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
              <select className="w-full pl-10 pr-3 py-2 bg-[#0F172A] border border-[#263247] rounded-xl text-sm text-[#F8FAFC] focus:border-[#3B82F6] outline-none appearance-none cursor-pointer">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
                 <option>This Month</option>
                 <option>Custom Range</option>
              </select>
            </div>
            <button className="p-2 border border-[#263247] rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] transition-colors cursor-pointer">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#070B14] text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">
                <th className="px-6 py-4">Event Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Actor / User</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1E293B]/40 transition-colors font-mono text-xs">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <span className={`w-2 h-2 rounded-full mr-3 ${
                         log.status === 'success' ? 'bg-emerald-400' :
                         log.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                       }`} />
                       <span className="text-[#F8FAFC] font-semibold">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#CBD5E1]">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 text-[#60A5FA] hover:underline cursor-pointer">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-[#94A3B8]">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 text-right text-[#64748B] font-sans text-sm">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[#1E293B] bg-[#070B14] flex items-center justify-between text-sm text-[#94A3B8]">
           <span>Showing 1 to 5 of 2,491 entries</span>
           <div className="flex space-x-2">
              <button className="px-3 py-1 bg-[#0F172A] border border-[#263247] rounded-lg hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer" disabled>Prev</button>
              <button className="px-3 py-1 bg-[#0F172A] border border-[#263247] rounded-lg hover:bg-[#1E293B] cursor-pointer">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
