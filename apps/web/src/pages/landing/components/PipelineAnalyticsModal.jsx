import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, BarChart3, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PipelineAnalyticsModal = ({ isOpen, onClose, deals }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const totalValue = deals.reduce((sum, d) => sum + (d.numericValue || 0), 0);
  const totalCount = deals.length;
  const avgDealSize = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;

  const stageBreakdown = {
    lead_in: deals.filter(d => d.stage === 'lead_in').reduce((s, d) => s + (d.numericValue || 0), 0),
    contacted: deals.filter(d => d.stage === 'contacted').reduce((s, d) => s + (d.numericValue || 0), 0),
    proposal: deals.filter(d => d.stage === 'proposal').reduce((s, d) => s + (d.numericValue || 0), 0),
    won: deals.filter(d => d.stage === 'won').reduce((s, d) => s + (d.numericValue || 0), 0),
  };

  const topDeals = [...deals].sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0)).slice(0, 3);

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
          {/* Top Bar */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Pipeline Analytics & Revenue Forecast</h3>
                <p className="text-xs text-gray-400">Real-time pipeline breakdown by stage and valuation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-emerald-300 block mb-1">Total Pipeline Valuation</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">
                  ${totalValue.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400/70 block mt-1">Across active deal pipeline</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs text-blue-300 block mb-1">Active Deal Opportunities</span>
                <span className="text-2xl font-bold text-blue-400 font-mono">{totalCount} Deals</span>
                <span className="text-[10px] text-blue-400/70 block mt-1">Managed by SalesPilot AI</span>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-xs text-purple-300 block mb-1">Average Deal Size</span>
                <span className="text-2xl font-bold text-purple-400 font-mono">
                  ${avgDealSize.toLocaleString()}
                </span>
                <span className="text-[10px] text-purple-400/70 block mt-1">High conversion velocity</span>
              </div>
            </div>

            {/* Stage Value Breakdown */}
            <div className="space-y-4 p-5 rounded-xl bg-white/2 border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Pipeline Value Distribution by Stage
              </h4>

              <div className="space-y-3">
                {[
                  { key: 'lead_in', title: 'Lead In', val: stageBreakdown.lead_in, color: 'bg-blue-500' },
                  { key: 'contacted', title: 'Contacted', val: stageBreakdown.contacted, color: 'bg-purple-500' },
                  { key: 'proposal', title: 'Proposal Sent', val: stageBreakdown.proposal, color: 'bg-amber-500' },
                  { key: 'won', title: 'Closed Won', val: stageBreakdown.won, color: 'bg-emerald-500' },
                ].map((item) => {
                  const pct = totalValue > 0 ? Math.round((item.val / totalValue) * 100) : 0;
                  return (
                    <div key={item.key} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-gray-300">
                        <span className="font-medium">{item.title}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-white font-bold">${item.val.toLocaleString()}</span>
                          <span className="text-gray-500">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top High-Value Opportunities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Top High-Value Enterprise Opportunities
              </h4>

              <div className="space-y-2">
                {topDeals.map((deal) => (
                  <div key={deal.id} className="p-3 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{deal.company}</span>
                      <span className="text-gray-400 text-[11px]">{deal.title}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400 font-mono block">{deal.value}</span>
                      <span className="text-[10px] text-gray-500 capitalize">{deal.stage.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-white/2 flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Live Financial Projection
            </span>

            <button
              onClick={() => { onClose(); navigate('/app'); }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer border-none"
            >
              <span>Open Full OS Analytics</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
