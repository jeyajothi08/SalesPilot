import React, { useState, useMemo } from 'react';
import KanbanBoard from '../../components/crm/KanbanBoard';
import { useCRM } from '../../context/CRMContext';
import { Search, Filter, Plus, ArrowUpDown, DollarSign, TrendingUp, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function PipelinePage() {
  const crmContext = useCRM();
  const deals = useMemo(() => Array.isArray(crmContext?.deals) ? crmContext.deals : [], [crmContext?.deals]);
  const addDeal = crmContext?.addDeal || (() => {});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('value-desc');
  const [showModal, setShowModal] = useState(false);

  // New Deal Form State
  const [newDeal, setNewDeal] = useState({
    title: '',
    company: '',
    contact: '',
    email: '',
    phone: '',
    value: '',
    stage: 'lead_in',
    probability: 30,
    closingDate: 'End of Q3',
    source: 'Inbound Web',
    notes: '',
  });

  // Calculate Pipeline Summary Metrics
  const summaryMetrics = useMemo(() => {
    const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const target = activeDeals.length > 0 ? activeDeals : deals;

    const totalDeals = target.length;
    const totalValue = target.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const weightedPipeline = target.reduce((sum, d) => {
      const val = Number(d.value) || 0;
      const prob = Number(d.probability) || 50;
      return sum + (val * (prob / 100));
    }, 0);

    const avgProb = totalDeals > 0 
      ? Math.round(target.reduce((sum, d) => sum + (Number(d.probability) || 50), 0) / totalDeals) 
      : 0;

    return {
      totalDeals,
      totalValue,
      weightedPipeline,
      avgProb,
    };
  }, [deals]);

  // Filter and Sort Deals
  const processedDeals = useMemo(() => {
    return deals.filter(deal => {
      if (!deal) return false;
      // Search Filter
      const query = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (deal.title || '').toLowerCase().includes(query) ||
        (deal.company || '').toLowerCase().includes(query) ||
        (deal.contact || '').toLowerCase().includes(query);

      // Stage Filter
      const matchesStage = stageFilter === 'all' || deal.stage === stageFilter;

      return matchesSearch && matchesStage;
    }).sort((a, b) => {
      const valA = Number(a?.value) || 0;
      const valB = Number(b?.value) || 0;
      const probA = Number(a?.probability) || 0;
      const probB = Number(b?.probability) || 0;

      if (sortBy === 'value-desc') return valB - valA;
      if (sortBy === 'value-asc') return valA - valB;
      if (sortBy === 'prob-desc') return probB - probA;
      if (sortBy === 'prob-asc') return probA - probB;
      if (sortBy === 'title') return (a?.title || '').localeCompare(b?.title || '');
      return 0;
    });
  }, [deals, searchTerm, stageFilter, sortBy]);

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.value) return;

    addDeal({
      title: newDeal.title,
      company: newDeal.company || 'Enterprise Client',
      contact: newDeal.contact || 'Primary Contact',
      email: newDeal.email || 'contact@client.com',
      phone: newDeal.phone || '+1 (555) 000-0000',
      value: Number(newDeal.value),
      stage: newDeal.stage,
      probability: Number(newDeal.probability),
      closingDate: newDeal.closingDate,
      source: newDeal.source,
      nextAction: 'Schedule Discovery Call',
      summary: newDeal.notes || 'Created via Sales Pipeline management.',
    });

    setNewDeal({
      title: '',
      company: '',
      contact: '',
      email: '',
      phone: '',
      value: '',
      stage: 'lead_in',
      probability: 30,
      closingDate: 'End of Q3',
      source: 'Inbound Web',
      notes: '',
    });
    setShowModal(false);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 space-y-4 relative bg-black font-sans text-white overflow-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Sales Pipeline</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
              Live AI Pipeline
            </span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Drag and drop deals across stages. Copilot updates weighted revenue and forecast metrics in real-time.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer border-none self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Deal</span>
        </button>
      </div>

      {/* Pipeline Summary Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <div className="p-3.5 rounded-xl bg-white/3 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Active Deals</span>
            <span className="text-lg font-bold text-white">{summaryMetrics.totalDeals}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/3 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Total Pipeline Value</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              ${summaryMetrics.totalValue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/3 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Weighted Revenue</span>
            <span className="text-lg font-bold text-purple-300 font-mono">
              ${Math.round(summaryMetrics.weightedPipeline).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/3 border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Avg Win Probability</span>
            <span className="text-lg font-bold text-amber-300">{summaryMetrics.avgProb}%</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Sorting */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/3 border border-white/10 p-2.5 rounded-xl shrink-0">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deal title, company, contact..."
            className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          
          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent text-gray-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#121214]">All Stages</option>
              <option value="lead_in" className="bg-[#121214]">Lead In</option>
              <option value="qualified" className="bg-[#121214]">Qualified</option>
              <option value="proposal" className="bg-[#121214]">Proposal Sent</option>
              <option value="negotiation" className="bg-[#121214]">Negotiation</option>
              <option value="won" className="bg-[#121214]">Closed Won</option>
              <option value="lost" className="bg-[#121214]">Closed Lost</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-gray-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="value-desc" className="bg-[#121214]">Value: High to Low</option>
              <option value="value-asc" className="bg-[#121214]">Value: Low to High</option>
              <option value="prob-desc" className="bg-[#121214]">Probability: High to Low</option>
              <option value="prob-asc" className="bg-[#121214]">Probability: Low to High</option>
              <option value="title" className="bg-[#121214]">Alphabetical Title</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Kanban Board Container */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard dealsOverride={processedDeals} />
      </div>

      {/* Create New Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-200 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Create New Opportunity</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Deal Title *</label>
                  <input
                    type="text"
                    required
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                    placeholder="e.g. Acme Enterprise AI Suite"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newDeal.company}
                    onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Primary Contact</label>
                  <input
                    type="text"
                    value={newDeal.contact}
                    onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    value={newDeal.email}
                    onChange={(e) => setNewDeal({ ...newDeal, email: e.target.value })}
                    placeholder="john@acme.com"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Deal Value ($) *</label>
                  <input
                    type="number"
                    required
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                    placeholder="50000"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Initial Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="lead_in">Lead In</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal Sent</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Closed Won</option>
                    <option value="lost">Closed Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newDeal.probability}
                    onChange={(e) => setNewDeal({ ...newDeal, probability: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Notes & Details</label>
                <textarea
                  rows={2}
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  placeholder="Internal deal notes, prospect requirements..."
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25"
                >
                  Create Deal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
