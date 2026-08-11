import React, { useState } from 'react';
import {  Search, Calendar, Filter, Download } from 'lucide-react';
// import { motion } from 'framer-motion';

export default function AuditLogViewer() {
  const [logs] = useState([
    { id: 1, action: 'user_login', resource: 'session', user: 'john@salespilot.ai', ip: '192.168.1.1', time: '10:45 AM, Today', status: 'success' },
    { id: 2, action: 'role_updated', resource: 'role_id: 2', user: 'admin@salespilot.ai', ip: '10.0.0.45', time: '09:12 AM, Today', status: 'success' },
    { id: 3, action: 'customer_deleted', resource: 'cust_id: 8821', user: 'jane@salespilot.ai', ip: '192.168.1.5', time: 'Yesterday', status: 'warning' },
    { id: 4, action: 'failed_login', resource: 'session', user: 'unknown', ip: '114.12.55.90', time: 'Yesterday', status: 'danger' },
    { id: 5, action: 'campaign_launched', resource: 'camp_id: 11', user: 'marketing@salespilot.ai', ip: '192.168.1.12', time: 'Oct 15, 2025', status: 'success' },
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 mt-1">Enterprise compliance and security event monitoring.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Download size={16} className="mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-3 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search events, users, or IPs..." 
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative w-48">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
                 <option>This Month</option>
                 <option>Custom Range</option>
              </select>
            </div>
            <button className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-500 transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-medium">
                <th className="px-6 py-4">Event Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Actor / User</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors font-mono text-xs">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <span className={`w-2 h-2 rounded-full mr-3 ${
                         log.status === 'success' ? 'bg-green-500' :
                         log.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                       }`} />
                       <span className="text-gray-900 font-semibold">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 font-sans text-sm">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-sm text-gray-500">
           <span>Showing 1 to 5 of 2,491 entries</span>
           <div className="flex space-x-1">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
