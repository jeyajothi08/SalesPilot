import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { CustomerDetailsModal } from './CustomerDetailsModal';

export default function CustomerTable() {
  const { deals, loading } = useCRM();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Group deals by company/contact to derive live customer records from the CRM single source of truth
  const customerMap = {};
  deals.forEach(d => {
    const key = (d.company || d.title || 'Unknown').trim();
    if (!customerMap[key]) {
      customerMap[key] = {
        id: `cust_${key.toLowerCase().replace(/\s+/g, '_')}`,
        name: key,
        company: key,
        contact: d.contact || 'Primary Contact',
        role: d.role || 'Decision Maker',
        email: d.email || `${d.contact ? d.contact.toLowerCase().replace(/\s+/g, '.') : 'contact'}@${key.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: d.phone || '+1 (555) 392-1049',
        status: d.stage === 'won' ? 'active' : d.stage === 'lost' ? 'churn_risk' : 'lead',
        healthScore: d.score || (d.stage === 'won' ? 95 : d.probability || 70),
        deals: [d],
        dealCount: 1,
        totalValue: Number(d.value) || 0,
      };
    } else {
      customerMap[key].deals.push(d);
      customerMap[key].dealCount += 1;
      customerMap[key].totalValue += (Number(d.value) || 0);
    }
  });

  const customersList = Object.values(customerMap);

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

  if (loading) return <div className="p-8 text-white">Loading Customer Directory...</div>;

  return (
    <div className="w-full overflow-x-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl relative">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 font-medium">Company / Customer</th>
            <th className="px-6 py-4 font-medium">Primary Contact</th>
            <th className="px-6 py-4 font-medium">Active Deals</th>
            <th className="px-6 py-4 font-medium">Total Value</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">AI Health Score</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customersList.map((c, i) => {
            const healthScore = c.healthScore;
            return (
              <motion.tr 
                key={c.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCustomer(c)}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-white group-hover:text-blue-300 transition-colors">
                  {c.company}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{c.contact}</span>
                    <span className="text-xs text-gray-400">{c.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-blue-400">
                  {c.dealCount} deal{c.dealCount > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                  ${c.totalValue.toLocaleString()}
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
                    <span className="text-xs text-gray-400 font-mono">{healthScore}/100</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedCustomer(c); }}
                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer"
                  >
                    View Profile
                  </button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
