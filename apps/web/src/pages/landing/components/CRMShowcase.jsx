import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Clock, CheckCircle2, PhoneCall, Mail, Sparkles, Filter, RefreshCw, TrendingUp } from 'lucide-react';
import { INITIAL_SHOWCASE_DEALS, STAGE_CONFIG } from '../../../data/crmShowcaseData';
import { DealDetailsModal } from './DealDetailsModal';
import { PipelineAnalyticsModal } from './PipelineAnalyticsModal';
import { AISyncModal } from './AISyncModal';
import { ActiveDealsModal } from './ActiveDealsModal';

export const CRMShowcase = () => {
  const [deals, setDeals] = useState(INITIAL_SHOWCASE_DEALS);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStageHeader, setSelectedStageHeader] = useState('all');

  // Modals state
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isActiveDealsOpen, setIsActiveDealsOpen] = useState(false);

  // Deal Update Handler
  const handleUpdateDeal = (updatedDeal) => {
    setDeals((prevDeals) =>
      prevDeals.map((d) => (d.id === updatedDeal.id ? updatedDeal : d))
    );
    if (selectedDeal && selectedDeal.id === updatedDeal.id) {
      setSelectedDeal(updatedDeal);
    }
  };

  // Filter Deals based on active view tab & stage header
  const getFilteredDeals = () => {
    return deals.filter((deal) => {
      // Stage Header Filter
      if (selectedStageHeader !== 'all' && deal.stage !== selectedStageHeader) {
        return false;
      }

      // View Tab Filter
      if (activeTab === 'high-intent') {
        return deal.intent === 'high' || deal.score >= 90;
      }
      if (activeTab === 'enterprise') {
        return deal.isEnterprise || deal.numericValue >= 50000;
      }

      return true;
    });
  };

  const filteredDeals = getFilteredDeals();

  // Calculated totals
  const totalPipelineVal = deals.reduce((acc, d) => acc + (d.numericValue || 0), 0);
  const activeDealsCount = deals.length;

  const columns = [
    { id: 'lead_in', title: 'Lead In', config: STAGE_CONFIG.lead_in },
    { id: 'contacted', title: 'Contacted', config: STAGE_CONFIG.contacted },
    { id: 'proposal', title: 'Proposal', config: STAGE_CONFIG.proposal },
    { id: 'won', title: 'Won', config: STAGE_CONFIG.won },
  ];

  return (
    <section id="crm" className="py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Pipeline Operations
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Built-in CRM Engine
        </h2>
        <p className="text-lg text-gray-400 font-light leading-relaxed mb-4">
          Manage deals seamlessly inside SalesPilot or sync bi-directionally with Salesforce, HubSpot, and Pipedrive.
        </p>

        {/* Integration Quick Tags */}
        <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
          <span className="text-gray-500">Supported CRMs:</span>
          {['Salesforce', 'HubSpot', 'Pipedrive'].map((crmName) => (
            <button
              key={crmName}
              onClick={() => setIsSyncOpen(true)}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium transition-colors cursor-pointer"
            >
              {crmName}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Mock Window */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Top Browser Toolbar */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 bg-white/2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-gray-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            pipeline.salespilot.ai/live-deals
          </div>

          {/* Top Interactive Metric Badges */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <button
              onClick={() => setIsActiveDealsOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer text-gray-300"
            >
              <Filter className="w-3 h-3 text-blue-400" />
              <span>{activeDealsCount} Active Deals</span>
            </button>

            <button
              onClick={() => setIsAnalyticsOpen(true)}
              className="font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <TrendingUp className="w-3 h-3" />
              <span>${totalPipelineVal.toLocaleString()} Total Pipeline</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-white/1 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Filter View:</span>
            {[
              { id: 'all', label: 'All Deals' },
              { id: 'high-intent', label: 'High Intent' },
              { id: 'enterprise', label: 'Enterprise' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {selectedStageHeader !== 'all' && (
              <button
                onClick={() => setSelectedStageHeader('all')}
                className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium cursor-pointer"
              >
                Stage: {STAGE_CONFIG[selectedStageHeader]?.title} ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setIsSyncOpen(true)}
            className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs transition-colors cursor-pointer border-none bg-transparent"
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Sync: Real-time active</span>
            <RefreshCw className="w-3 h-3 text-emerald-400" />
          </button>
        </div>

        {/* Kanban Board Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-linear-to-b from-white/2 to-transparent overflow-x-auto">
          {columns.map((col) => {
            const colDeals = filteredDeals.filter((d) => d.stage === col.id);
            const columnTotal = colDeals.reduce(
              (acc, d) => acc + (d.numericValue || 0),
              0
            );

            const isStageSelected = selectedStageHeader === col.id;

            return (
              <div key={col.id} className="flex flex-col gap-4 min-w-62.5">
                {/* Column Header - Clickable Filter */}
                <button
                  onClick={() =>
                    setSelectedStageHeader(
                      selectedStageHeader === col.id ? 'all' : col.id
                    )
                  }
                  className={`flex items-center justify-between pb-2 border-b transition-colors cursor-pointer text-left ${
                    isStageSelected
                      ? 'border-blue-400 text-blue-300 font-bold'
                      : 'border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{col.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.config.badge}`}
                    >
                      {colDeals.length}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-400 font-mono">
                    ${(columnTotal / 1000).toFixed(0)}k
                  </span>
                </button>

                {/* Deal Cards Container */}
                <div className="flex flex-col gap-3">
                  {colDeals.length > 0 ? (
                    colDeals.map((deal) => (
                      <motion.div
                        key={deal.id}
                        onClick={() => setSelectedDeal(deal)}
                        whileHover={{ y: -3, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-xl bg-white/4 border ${col.config.border} hover:bg-white/8 hover:border-blue-500/50 transition-all shadow-lg flex flex-col justify-between gap-3 group relative overflow-hidden cursor-pointer`}
                      >
                        {/* Top Row: Company & Value */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1">
                              <Building2 className="w-3 h-3 text-blue-400" />
                              {deal.company}
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                              {deal.title}
                            </h4>
                          </div>
                          <div className="px-2 py-1 rounded-lg bg-white/10 text-xs font-bold text-emerald-400 border border-emerald-500/20 shrink-0 font-mono">
                            {deal.value}
                          </div>
                        </div>

                        {/* Middle Row: Contact Info & AI Score */}
                        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full ${deal.avatarBg} text-white font-bold text-[10px] flex items-center justify-center`}
                            >
                              {deal.initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-300 font-medium leading-none">
                                {deal.contact}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {deal.role}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            <Sparkles className="w-3 h-3" />
                            <span>{deal.score}%</span>
                          </div>
                        </div>

                        {/* Bottom Row: Stage Tag & Activity Log */}
                        <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                            {deal.stageTag}
                          </span>
                          <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                            {col.id === 'won' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : col.id === 'contacted' ? (
                              <PhoneCall className="w-3 h-3 text-purple-400" />
                            ) : col.id === 'proposal' ? (
                              <Mail className="w-3 h-3 text-amber-400" />
                            ) : (
                              <Clock className="w-3 h-3 text-blue-400" />
                            )}
                            <span className="truncate max-w-27.5">
                              {deal.activityTime}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-gray-600 italic rounded-xl border border-dashed border-white/5">
                      No deals in {col.title} view
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Interactive Modals */}
      <DealDetailsModal
        deal={selectedDeal}
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onUpdateDeal={handleUpdateDeal}
      />

      <PipelineAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        deals={deals}
      />

      <AISyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
      />

      <ActiveDealsModal
        isOpen={isActiveDealsOpen}
        onClose={() => setIsActiveDealsOpen(false)}
        deals={deals}
        onSelectDeal={(deal) => setSelectedDeal(deal)}
      />
    </section>
  );
};
