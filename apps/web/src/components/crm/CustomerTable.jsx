import React, { useState, useEffect } from 'react';
import { crmAPI } from '../../api/crm';
import { motion } from 'framer-motion';

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmAPI.getCustomers()
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Failed to load customers:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    const safeStatus = (status || 'active').toLowerCase();
    const styles = {
      active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      lead: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      churn_risk: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };
    const style = styles[safeStatus] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
        {safeStatus.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-white">Loading Customers...</div>;

  return (
    <div className="w-full overflow-x-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 font-medium">Customer Name</th>
            <th className="px-6 py-4 font-medium">Contact</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">AI Health Score</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => {
            const customerName = c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unknown Customer';
            const healthScore = c.health_score ?? c.ai_score ?? 85;
            return (
              <motion.tr 
                key={c.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4 font-medium text-white">{customerName}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{c.email}</span>
                    <span className="text-xs text-gray-500">{c.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-white/10 rounded-full h-1.5 max-w-25">
                      <div 
                        className={`h-1.5 rounded-full ${healthScore > 70 ? 'bg-emerald-400' : healthScore > 40 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                        style={{ width: `${healthScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{healthScore}/100</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile
                  </button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
