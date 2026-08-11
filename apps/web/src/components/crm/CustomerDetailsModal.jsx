import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, Mail, Phone, ShieldCheck, DollarSign, Activity, Briefcase } from 'lucide-react';

export const CustomerDetailsModal = ({ customer, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;

  const healthScore = customer.healthScore ?? customer.health_score ?? customer.ai_score ?? 85;
  const statusBadgeColor = customer.status === 'active' || customer.status === 'Active'
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : customer.status === 'churn_risk'
    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    : 'bg-blue-500/20 text-blue-300 border-blue-500/30';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-1000 flex justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl h-full bg-[#0E0E10] border-l border-white/10 text-white shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-lg flex items-center justify-center shadow-lg">
                {(customer.name || customer.company || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBadgeColor}`}>
                    {String(customer.status || 'Active').toUpperCase()}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-400 font-mono">Health Score: {healthScore}/100</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{customer.name || customer.company}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Quick Overview Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                <span className="text-[11px] text-gray-400 mb-1">Total Pipeline Value</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${(customer.totalValue || 0).toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                <span className="text-[11px] text-gray-400 mb-1">Active Deals</span>
                <span className="text-base font-bold text-blue-400">
                  {customer.dealCount || 0} deal(s)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                <span className="text-[11px] text-gray-400 mb-1">AI Health</span>
                <span className="text-base font-bold text-purple-400">
                  {healthScore >= 80 ? 'Excellent' : healthScore >= 50 ? 'Moderate' : 'At Risk'}
                </span>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Contact Profile
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block mb-0.5">Primary Contact</span>
                  <span className="text-white font-medium">{customer.contact || customer.name || 'Sarah Jenkins'}</span>
                  <span className="text-gray-400 text-[11px] block">{customer.role || 'Decision Maker'}</span>
                </div>

                <div>
                  <span className="text-gray-500 block mb-0.5">Company</span>
                  <span className="text-white font-medium">{customer.company || customer.name}</span>
                </div>

                <div>
                  <span className="text-gray-500 block mb-0.5">Email</span>
                  <span className="text-blue-400 font-mono">{customer.email || 'contact@company.com'}</span>
                </div>

                <div>
                  <span className="text-gray-500 block mb-0.5">Phone</span>
                  <span className="text-gray-300 font-mono">{customer.phone || '+1 (555) 392-1049'}</span>
                </div>
              </div>
            </div>

            {/* Attached Deals Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Attached Active Deals ({customer.deals?.length || customer.dealCount || 0})
              </h4>

              <div className="space-y-2">
                {customer.deals && customer.deals.length > 0 ? (
                  customer.deals.map((d, i) => (
                    <div key={d.id || i} className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{d.title}</span>
                        <span className="text-gray-400 text-[11px]">Stage: {d.stageTitle || d.stage} • Prob: {d.probability}%</span>
                      </div>
                      <span className="font-bold text-emerald-400 font-mono">${(Number(d.value) || 0).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-gray-500 italic bg-white/2 rounded-xl border border-white/5">
                    No active deals currently associated with this account.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/10 bg-white/2 flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified CRM Customer Profile
            </span>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer border-none"
            >
              Close Drawer
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
