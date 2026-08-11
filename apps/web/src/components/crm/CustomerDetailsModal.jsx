import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, User, Mail, Phone, ShieldCheck, DollarSign, Activity, Briefcase,
  Sparkles, FileText, CheckSquare, PhoneCall, Plus, Trash2, Edit3, MessageSquare
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CustomerDetailsModal = ({ customer, isOpen, onClose }) => {
  const { addDeal } = useCRM();

  const [activeTab, setActiveTab] = useState('overview'); // overview | deals | timeline | notes | tasks | ai
  const [newNoteText, setNewNoteText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealValue, setNewDealValue] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  if (!isOpen || !customer) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const healthScore = customer.leadScore || customer.healthScore || customer.health_score || customer.ai_score || 85;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    customer.notes = [
      { id: `n_${Date.now()}`, author: 'Sales Rep', date: 'Just now', text: newNoteText.trim() },
      ...(customer.notes || [])
    ];
    setNewNoteText('');
    showToast('Note added to customer profile');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (!customer.tasks) customer.tasks = [];
    customer.tasks.unshift({
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      dueDate: 'Tomorrow at 10:00 AM',
      status: 'Pending'
    });
    setNewTaskTitle('');
    showToast('Task created successfully');
  };

  const handleCreateAssociatedDeal = (e) => {
    e.preventDefault();
    if (!newDealTitle.trim() || !newDealValue) return;

    addDeal({
      title: newDealTitle.trim(),
      company: customer.company,
      contact: customer.contact,
      email: customer.email,
      phone: customer.phone,
      value: Number(newDealValue),
      stage: 'lead_in',
      probability: 40,
      nextAction: 'Initial Discovery Walkthrough',
    });

    setNewDealTitle('');
    setNewDealValue('');
    setShowAddDealModal(false);
    showToast(`Associated deal "${newDealTitle}" created`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-1000 flex justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl h-full bg-[#0E0E10] border-l border-white/10 text-white shadow-2xl flex flex-col z-10 overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-lg flex items-center justify-center shadow-lg shrink-0">
                {(customer.company || customer.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    {customer.status || 'Active Account'}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-400 font-mono">Lead Score: {healthScore}/100</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{customer.company}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddDealModal(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors flex items-center gap-1 cursor-pointer border-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Deal</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast Banner */}
          {toastMessage && (
            <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex bg-white/3 border-b border-white/10 px-6 gap-1 text-xs font-medium overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Building2 },
              { id: 'deals', label: `Deals (${customer.deals?.length || 0})`, icon: Briefcase },
              { id: 'timeline', label: 'Activities', icon: Activity },
              { id: 'notes', label: 'Notes', icon: FileText },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'ai', label: 'AI Insights', icon: Sparkles }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'border-blue-500 text-white font-bold' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400 mb-1">Total Account Value</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      ${(customer.totalValue || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400 mb-1">Industry</span>
                    <span className="text-xs font-bold text-blue-300 truncate">
                      {customer.industry || 'Technology'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                    <span className="text-[11px] text-gray-400 mb-1">Company Size</span>
                    <span className="text-xs font-bold text-purple-300">
                      {customer.companySize || '50-250 employees'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    Contact & Account Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 block mb-0.5">Primary Contact</span>
                      <span className="text-white font-semibold">{customer.contact}</span>
                      <span className="text-gray-400 text-[11px] block">{customer.role || 'Decision Maker'}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block mb-0.5">Account Owner</span>
                      <span className="text-white font-semibold">{customer.owner || 'Alex Rivera (AI SDR)'}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block mb-0.5">Email Address</span>
                      <span className="text-blue-400 font-mono">{customer.email}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block mb-0.5">Phone Number</span>
                      <span className="text-gray-300 font-mono">{customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                    Next Recommended Follow-Up
                  </span>
                  <p className="text-sm font-semibold text-white">{customer.nextFollowUp}</p>
                </div>
              </div>
            )}

            {/* DEALS TAB */}
            {activeTab === 'deals' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Associated Opportunities</h4>
                  <button
                    onClick={() => setShowAddDealModal(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer border-none bg-transparent"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Deal
                  </button>
                </div>

                <div className="space-y-2">
                  {customer.deals && customer.deals.length > 0 ? (
                    customer.deals.map((d, i) => (
                      <div key={d.id || i} className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white text-sm block mb-1">{d.title}</span>
                          <span className="text-gray-400 text-[11px]">
                            Stage: <strong className="text-blue-300">{d.stageTitle || d.stage}</strong> • Win Prob: {d.probability}%
                          </span>
                        </div>
                        <span className="font-bold text-emerald-400 font-mono text-sm">${(Number(d.value) || 0).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-xs text-gray-500 italic bg-white/2 rounded-xl border border-white/5 text-center">
                      No active deals associated with this customer yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Activities & Communications</h4>
                <div className="space-y-3 pl-3 border-l border-white/10">
                  {customer.activities && customer.activities.length > 0 ? (
                    customer.activities.map((ev, i) => (
                      <div key={ev.id || i} className="relative pl-4 text-xs">
                        <div className="absolute -left-4.5 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0E0E10]" />
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-semibold text-white">{ev.title}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{ev.time || 'Recently'}</span>
                        </div>
                        <p className="text-gray-400 text-[11px]">{ev.desc || 'Logged CRM event.'}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic">No recent activity log found for this customer.</div>
                  )}
                </div>
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2 bg-white/3 p-3 rounded-xl border border-white/10">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add a internal note about this customer..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg cursor-pointer border-none">
                      Save Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {customer.notes && customer.notes.length > 0 ? (
                    customer.notes.map((n, i) => (
                      <div key={n.id || i} className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-xs">
                        <div className="flex justify-between items-center mb-1 text-[11px]">
                          <span className="font-bold text-blue-300">{n.author || 'Sales Rep'}</span>
                          <span className="text-gray-500">{n.date || 'Recently'}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic p-4 text-center">No notes added yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* TASKS TAB */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New task title (e.g. Schedule follow up meeting)..."
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl cursor-pointer border-none">
                    Add Task
                  </button>
                </form>

                <div className="space-y-2">
                  {customer.tasks && customer.tasks.length > 0 ? (
                    customer.tasks.map((t, i) => (
                      <div key={t.id || i} className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-white">{t.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">{t.dueDate}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic p-4 text-center">No tasks pending for this customer.</div>
                  )}
                </div>
              </div>
            )}

            {/* AI INSIGHTS TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-linear-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/15 border border-blue-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Copilot Health & Intent Rationale</h4>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    Account health score is currently rated at <strong className="text-emerald-400 font-mono">{healthScore}/100</strong> based on rapid response times, high contract values, and ongoing executive engagement.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/10">
                    <div>
                      <span className="text-gray-400 block">Buying Signals</span>
                      <span className="text-emerald-400 font-medium">• 3+ proposal views this week</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Risk Category</span>
                      <span className="text-blue-300 font-medium">• Low Risk (Active engagement)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/10 bg-white/2 flex items-center justify-between">
            <span className="text-xs text-gray-400">Customer Account ID: {customer.id}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer border-none"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>

      {/* Associated Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-1100 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create Deal for {customer.company}</h3>
            <form onSubmit={handleCreateAssociatedDeal} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={newDealTitle}
                  onChange={(e) => setNewDealTitle(e.target.value)}
                  placeholder="e.g. Annual Renewal & Seat Expansion"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Opportunity Value ($) *</label>
                <input
                  type="number"
                  required
                  value={newDealValue}
                  onChange={(e) => setNewDealValue(e.target.value)}
                  placeholder="45000"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 shadow-md"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
