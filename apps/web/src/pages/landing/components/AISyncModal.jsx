import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, CheckCircle2, ShieldCheck, Database, ArrowUpRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_INTEGRATIONS } from '../../../data/crmShowcaseData';

export const AISyncModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [syncingId, setSyncingId] = useState(null);
  const [notice, setNotice] = useState(null);

  if (!isOpen) return null;

  const triggerSync = (id, name) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setIntegrations(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, lastSync: 'Just now', dealsSynced: item.dealsSynced + 1 }
            : item
        )
      );
      setNotice(`Successfully synced ${name}`);
      setTimeout(() => setNotice(null), 3000);
    }, 1200);
  };

  const toggleConnect = (id, name) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.isConnected;
          return {
            ...item,
            isConnected: nextState,
            status: nextState ? 'Connected' : 'Available to Connect',
            lastSync: nextState ? 'Just now' : 'Never',
          };
        }
        return item;
      })
    );
    setNotice(`Updated integration status for ${name}`);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0E0E10] border border-white/10 rounded-2xl text-white shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">CRM Integration & Live AI Sync</h3>
                <p className="text-xs text-gray-400">Bi-directional synchronization status with external CRM engines</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification */}
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/20 border-b border-blue-500/30 px-6 py-2 text-xs text-blue-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                {notice}
              </span>
              <span className="text-[10px] text-blue-400/70 font-mono font-medium">Sync Active</span>
            </motion.div>
          )}

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

            {/* Sync Banner */}
            <div className="p-4 rounded-xl bg-linear-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-white block">Real-time Bi-directional Sync Active</span>
                  <span className="text-[11px] text-gray-400">SalesPilot AI updates contacts, stages, and transcripts instantly</span>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                0 Latency
              </span>
            </div>

            {/* Integrations List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                Connected CRM Platforms
              </h4>

              <div className="space-y-3">
                {integrations.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${item.iconColor} border flex items-center justify-center font-bold text-xs`}>
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{item.name}</h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              item.isConnected
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-400 gap-2">
                      <div className="flex gap-4 font-mono text-[11px]">
                        <span>Last Sync: <strong className="text-gray-200">{item.lastSync}</strong></span>
                        <span>Deals Synced: <strong className="text-emerald-400">{item.dealsSynced}</strong></span>
                      </div>

                      <div className="flex gap-2">
                        {item.isConnected && (
                          <button
                            onClick={() => triggerSync(item.id, item.name)}
                            disabled={syncingId === item.id}
                            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 text-blue-400 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                            <span>{syncingId === item.id ? 'Syncing...' : 'Sync Now'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => toggleConnect(item.id, item.name)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                            item.isConnected
                              ? 'bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/20'
                              : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
                          }`}
                        >
                          {item.isConnected ? 'Disconnect' : 'Connect Integration'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Audit Log */}
            <div className="space-y-2 p-4 rounded-xl bg-white/2 border border-white/5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Recent Automated Sync Events
              </h4>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-gray-300">
                  <span className="text-emerald-400">[Salesforce] Updated 8 deals stage from Voice qualification</span>
                  <span className="text-gray-500">2m ago</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-amber-400">[HubSpot] Attached AI call transcript for Apex Cloud</span>
                  <span className="text-gray-500">5m ago</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-blue-400">[SalesPilot Engine] Synced lead score 98% for GlobalMedia</span>
                  <span className="text-gray-500">12m ago</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/2 flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SOC2 Type II Compliant Sync
            </span>

            <button
              onClick={() => { onClose(); navigate('/app'); }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer border-none"
            >
              <span>Manage Integrations in OS</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
