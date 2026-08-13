import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, User, Mail, Phone, ShieldCheck, Activity, Briefcase,
  Sparkles, FileText, CheckSquare, Plus, MessageSquare, ArrowRight
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import EmailComposerModal from '../communication/EmailComposerModal';
import MessagingModal from '../communication/MessagingModal';

export const CustomerDetailsModal = ({ customer, isOpen, onClose, onOpenCallWorkspace }) => {
  const { addDeal } = useCRM();

  const [activeTab, setActiveTab] = useState('overview'); // overview | deals | timeline | notes | tasks | ai
  const [newNoteText, setNewNoteText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealValue, setNewDealValue] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals for One-Click Actions
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  if (!isOpen || !customer) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const healthScore = customer.leadScore || customer.healthScore || customer.health_score || customer.ai_score || 85;

  // Handle One-Click Call Action
  const handleCallAction = () => {
    if (onOpenCallWorkspace) {
      onOpenCallWorkspace(customer);
    } else {
      // Dispatch global custom event for OS layout
      window.dispatchEvent(new CustomEvent('open-call-workspace', { detail: { contact: customer } }));
      showToast(`Opening Calling Workspace for ${customer.contact || customer.company}...`);
    }
  };

  // Handle One-Click Email Action
  const handleEmailAction = () => {
    setShowEmailModal(true);
  };

  // Handle One-Click Message Action
  const handleMessageAction = () => {
    setShowMessageModal(true);
  };

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

  // AI Recommendation Logic based on CRM context
  const getAIRecommendation = () => {
    const stage = (customer.stage || customer.status || '').toLowerCase();
    if (stage.includes('won') || stage.includes('active')) {
      return {
        action: 'Schedule Quarterly Account Review',
        reason: 'Customer account is active with strong health score. Check in on feature adoption.',
        buttonLabel: 'Draft Follow-up Email',
        type: 'email'
      };
    } else if (stage.includes('proposal') || stage.includes('negot')) {
      return {
        action: 'Follow up via Outbound Call',
        reason: 'Proposal view detected recently. Confirm decision-maker alignment on Q3 budget.',
        buttonLabel: 'Call Now',
        type: 'call'
      };
    } else {
      return {
        action: 'Send Sales Intro & Demo Request',
        reason: 'New prospect. Recommend introducing SalesPilot AI capabilities with a personalized email.',
        buttonLabel: 'Draft Intro Email',
        type: 'email'
      };
    }
  };

  const aiRec = getAIRecommendation();

  // Unified Chronological Communication History Timeline
  const unifiedActivities = [
    ...(customer.activities || []),
    { id: 'act_1', type: 'email', title: 'Follow-up Email Sent', desc: 'Outbound email sent via SalesPilot', time: '10:32 AM', status: 'Sent' },
    { id: 'act_2', type: 'call', title: 'Outbound Discovery Call', desc: 'Call duration: 12 mins. Discussed Enterprise seat tiering.', time: '9:15 AM', status: 'Completed' },
    { id: 'act_3', type: 'message', title: 'WhatsApp Message Reply', desc: 'Customer confirmed availability for Thursday demo.', time: 'Yesterday 4:20 PM', status: 'Delivered' }
  ];

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
          className="relative w-full max-w-2xl h-full bg-[#070B18] border-l border-slate-800 text-white shadow-2xl flex flex-col z-10 overflow-hidden font-sans"
        >
          {/* Header Bar */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#0F172A]/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold text-lg flex items-center justify-center shadow-lg shrink-0">
                {(customer.company || customer.contact || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    {customer.status || 'Active Prospect'}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">Lead Score: <strong className="text-white">{healthScore}/100</strong></span>
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">{customer.company || customer.contact}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddDealModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors flex items-center gap-1 cursor-pointer border-none shadow-md shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Deal</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── PRIMARY ONE-CLICK ACTION BAR ─────────────────────────────────── */}
          <div className="bg-[#0F172A] border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Quick Actions:
            </span>
            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Primary Call Action */}
              <button
                onClick={handleCallAction}
                className="flex-1 max-w-35 py-2 px-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>[ Call ]</span>
              </button>

              {/* Primary Email Action */}
              <button
                onClick={handleEmailAction}
                className="flex-1 max-w-35 py-2 px-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>[ Email ]</span>
              </button>

              {/* Primary Message Action */}
              <button
                onClick={handleMessageAction}
                className="flex-1 max-w-35 py-2 px-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>[ Message ]</span>
              </button>
            </div>
          </div>

          {/* Toast Banner */}
          {toastMessage && (
            <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2 text-xs text-emerald-300 flex items-center gap-2 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex bg-[#070B18] border-b border-slate-800 px-6 gap-1 text-xs font-semibold overflow-x-auto shrink-0">
            {[
              { id: 'overview', label: '360 Overview', icon: Building2 },
              { id: 'deals', label: `Deals (${customer.deals?.length || 0})`, icon: Briefcase },
              { id: 'timeline', label: 'Activity Timeline', icon: Activity },
              { id: 'notes', label: 'Notes', icon: FileText },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'ai', label: 'AI Copilot', icon: Sparkles }
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
                      : 'border-transparent text-slate-400 hover:text-slate-200'
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
                
                {/* ── AI NEXT BEST ACTION CARD ───────────────────────────────── */}
                <div className="bg-linear-to-r from-purple-950/40 via-blue-950/40 to-indigo-950/40 border border-purple-500/30 p-4.5 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI Recommended Next Best Action
                    </span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                      High Confidence
                    </span>
                  </div>

                  <p className="text-sm font-extrabold text-white">{aiRec.action}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiRec.reason}</p>

                  <div className="pt-1">
                    {aiRec.type === 'call' ? (
                      <button
                        onClick={handleCallAction}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all border-none"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>[ Call Now ]</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    ) : (
                      <button
                        onClick={handleEmailAction}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all border-none"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>[ Draft Follow-up Email ]</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#0F172A]/60 border border-slate-800 flex flex-col">
                    <span className="text-[11px] text-slate-400 mb-1">Total Account Value</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      ${(customer.totalValue || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0F172A]/60 border border-slate-800 flex flex-col">
                    <span className="text-[11px] text-slate-400 mb-1">Industry</span>
                    <span className="text-xs font-bold text-blue-300 truncate">
                      {customer.industry || 'Enterprise SaaS'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0F172A]/60 border border-slate-800 flex flex-col">
                    <span className="text-[11px] text-slate-400 mb-1">Company Size</span>
                    <span className="text-xs font-bold text-purple-300">
                      {customer.companySize || '50-250 employees'}
                    </span>
                  </div>
                </div>

                {/* Contact & Account Info */}
                <div className="p-4.5 rounded-2xl bg-[#0F172A]/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    Customer & Decision Maker Info
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Primary Contact</span>
                      <span className="text-white font-bold">{customer.contact || 'Primary Contact'}</span>
                      <span className="text-slate-400 text-[11px] block">{customer.role || 'Decision Maker'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5">Account Owner</span>
                      <span className="text-white font-bold">{customer.owner || 'Alex Rivera (AI SDR)'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5">Email Address</span>
                      <span className="text-blue-400 font-mono">{customer.email || 'email@company.com'}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5">Phone Number</span>
                      <span className="text-slate-300 font-mono">{customer.phone || '+1 (555) 019-2834'}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* DEALS TAB */}
            {activeTab === 'deals' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Associated Deals</h4>
                  <button
                    onClick={() => setShowAddDealModal(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer border-none bg-transparent"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Deal
                  </button>
                </div>

                <div className="space-y-2">
                  {customer.deals && customer.deals.length > 0 ? (
                    customer.deals.map((d, i) => (
                      <div key={d.id || i} className="p-4 rounded-2xl bg-[#0F172A]/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white text-sm block mb-1">{d.title}</span>
                          <span className="text-slate-400 text-[11px]">
                            Stage: <strong className="text-blue-300">{d.stageTitle || d.stage}</strong> • Win Prob: {d.probability}%
                          </span>
                        </div>
                        <span className="font-bold text-emerald-400 font-mono text-sm">${(Number(d.value) || 0).toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-xs text-slate-500 italic bg-[#0F172A]/30 rounded-2xl border border-slate-800 text-center">
                      No active deals associated with this customer yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Unified Communication & Activity Timeline</h4>
                <div className="space-y-3 pl-3 border-l border-slate-800">
                  {unifiedActivities.map((ev, i) => (
                    <div key={ev.id || i} className="relative pl-4 text-xs">
                      <div className={`absolute -left-4.5 top-1 w-2.5 h-2.5 rounded-full border-2 border-[#070B18] ${
                        ev.type === 'call' ? 'bg-emerald-400' : ev.type === 'email' ? 'bg-blue-400' : 'bg-purple-400'
                      }`} />
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {ev.type === 'call' ? <Phone className="w-3.5 h-3.5 text-emerald-400" /> :
                           ev.type === 'email' ? <Mail className="w-3.5 h-3.5 text-blue-400" /> :
                           <MessageSquare className="w-3.5 h-3.5 text-purple-400" />}
                          {ev.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{ev.time || 'Recently'}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{ev.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2 bg-[#0F172A]/60 p-3.5 rounded-2xl border border-slate-800">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an internal note about this customer..."
                    className="w-full bg-[#050816] border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans"
                  />
                  <div className="flex justify-end">
                    <button type="submit" className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl cursor-pointer border-none">
                      Save Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {customer.notes && customer.notes.length > 0 ? (
                    customer.notes.map((n, i) => (
                      <div key={n.id || i} className="p-3.5 rounded-2xl bg-[#0F172A]/40 border border-slate-800 text-xs">
                        <div className="flex justify-between items-center mb-1 text-[11px]">
                          <span className="font-bold text-blue-300">{n.author || 'Sales Rep'}</span>
                          <span className="text-slate-500 font-mono">{n.date || 'Recently'}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic p-4 text-center">No notes added yet.</div>
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
                    placeholder="New task title (e.g. Schedule follow-up demo call)..."
                    className="flex-1 bg-[#050816] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl cursor-pointer border-none">
                    Add Task
                  </button>
                </form>

                <div className="space-y-2">
                  {customer.tasks && customer.tasks.length > 0 ? (
                    customer.tasks.map((t, i) => (
                      <div key={t.id || i} className="p-3 rounded-2xl bg-[#0F172A]/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                          <span className="font-bold text-white">{t.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{t.dueDate}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic p-4 text-center">No tasks pending for this customer.</div>
                  )}
                </div>
              </div>
            )}

            {/* AI INSIGHTS TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="p-4.5 rounded-2xl bg-linear-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border border-blue-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Copilot Health & Intent Rationale</h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Account health score is currently rated at <strong className="text-emerald-400 font-mono">{healthScore}/100</strong> based on rapid response times, high contract values, and ongoing executive engagement.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-[#0F172A]/50 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 font-mono">Account ID: {customer.id}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer border-none"
            >
              Close Workspace
            </button>
          </div>

        </motion.div>
      </div>

      {/* Associated Modals for One-Click Actions */}
      <EmailComposerModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        recipientContact={customer}
      />

      <MessagingModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        recipientContact={customer}
      />
    </AnimatePresence>
  );
};

export default CustomerDetailsModal;
