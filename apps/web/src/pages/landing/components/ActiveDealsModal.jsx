import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STAGE_CONFIG } from '../../../data/crmShowcaseData';

export const ActiveDealsModal = ({ isOpen, onClose, deals, onSelectDeal }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');

  if (!isOpen) return null;

  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contact.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage =
      selectedStageFilter === 'all' || deal.stage === selectedStageFilter;

    return matchesSearch && matchesStage;
  });

  const totalFilteredValue = filteredDeals.reduce((sum, d) => sum + (d.numericValue || 0), 0);

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
          className="relative w-full max-w-3xl bg-[#0E0E10] border border-white/10 rounded-2xl text-white shadow-2xl overflow-hidden z-10 my-8 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                {deals.length}
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Active Pipeline Opportunities</h3>
                <p className="text-xs text-gray-400">Live active deals managed by SalesPilot AI</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="px-6 py-3 border-b border-white/10 bg-white/1 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search active deals or contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-gray-500">Stage:</span>
              {['all', 'lead_in', 'contacted', 'proposal', 'won'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setSelectedStageFilter(stg)}
                  className={`px-2.5 py-1 rounded-md text-xs capitalize font-medium transition-colors cursor-pointer border ${
                    selectedStageFilter === stg
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                      : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                  }`}
                >
                  {stg.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Deals List */}
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar flex-1">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal) => {
                const stageInfo = STAGE_CONFIG[deal.stage] || STAGE_CONFIG.lead_in;

                return (
                  <div
                    key={deal.id}
                    onClick={() => {
                      onClose();
                      onSelectDeal(deal);
                    }}
                    className="p-4 rounded-xl bg-white/2 border border-white/5 hover:bg-white/6 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${deal.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {deal.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-white group-hover:text-blue-300 transition-colors text-sm">
                            {deal.company}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${stageInfo.badge}`}>
                            {stageInfo.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{deal.title}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-emerald-400 font-mono text-sm block">
                        {deal.value}
                      </span>
                      <div className="flex items-center justify-end gap-1 text-[11px] text-blue-400">
                        <Sparkles className="w-3 h-3" />
                        <span>{deal.score}% score</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-gray-500 text-xs">
                No active deals matching current filters.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/2 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">
              Filtered Value: <strong className="text-emerald-400">${totalFilteredValue.toLocaleString()}</strong>
            </span>

            <button
              onClick={() => { onClose(); navigate('/app'); }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer border-none"
            >
              <span>Launch OS Pipeline</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
