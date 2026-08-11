import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, User, Sparkles, Clock, 
  Calendar, CheckCircle2, ArrowUpRight, Plus, 
  FileText, ShieldCheck, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STAGE_CONFIG } from '../../../data/crmShowcaseData';

export const DealDetailsModal = ({ deal, isOpen, onClose, onUpdateDeal, onDeleteDeal }) => {
  const navigate = useNavigate();
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editValue, setEditValue] = useState(deal?.value || 0);
  const [editProb, setEditProb] = useState(deal?.probability || 50);
  const [isEditingProb, setIsEditingProb] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  if (!isOpen || !deal) return null;

  const stageInfo = STAGE_CONFIG[deal.stage] || STAGE_CONFIG.lead_in;

  const showNotification = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleStageChange = (newStage) => {
    const updated = {
      ...deal,
      stage: newStage,
      stageTag: STAGE_CONFIG[newStage]?.title || newStage,
      activity: `Stage updated to ${STAGE_CONFIG[newStage]?.title || newStage}`,
      activityTime: 'Just now',
      timeline: [
        {
          id: `t_${Date.now()}`,
          title: `Stage Changed to ${STAGE_CONFIG[newStage]?.title || newStage}`,
          time: 'Just now',
          type: 'system',
          desc: `Pipeline stage updated by sales rep.`,
        },
        ...(deal.timeline || []),
      ],
    };
    onUpdateDeal(updated);
    showNotification(`Deal stage updated to ${STAGE_CONFIG[newStage]?.title || newStage}`);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNoteObj = {
      id: `n_${Date.now()}`,
      author: 'You (Sales Rep)',
      date: 'Just now',
      text: newNoteText.trim(),
    };

    const updated = {
      ...deal,
      notes: [newNoteObj, ...(deal.notes || [])],
      activity: `Added note: "${newNoteText.trim().slice(0, 30)}..."`,
      activityTime: 'Just now',
    };

    onUpdateDeal(updated);
    setNewNoteText('');
    setIsAddingNote(false);
    showNotification('Note added successfully');
  };

  const handleScheduleFollowup = () => {
    const updated = {
      ...deal,
      nextAction: 'Follow-up Call & System Demo',
      activity: 'Follow-up scheduled for tomorrow 10:00 AM',
      activityTime: 'Just now',
      timeline: [
        {
          id: `t_${Date.now()}`,
          title: 'Follow-up Scheduled',
          time: 'Just now',
          type: 'call',
          desc: 'Calendar invite created for tomorrow at 10:00 AM EST.',
        },
        ...(deal.timeline || []),
      ],
    };
    onUpdateDeal(updated);
    showNotification('Follow-up call scheduled for tomorrow 10:00 AM');
  };

  const handleSaveValue = (e) => {
    e.preventDefault();
    const valNum = Number(editValue);
    if (isNaN(valNum) || valNum < 0) return;
    onUpdateDeal({ ...deal, value: valNum, numericValue: valNum });
    setIsEditingValue(false);
    showNotification(`Deal value updated to $${valNum.toLocaleString()}`);
  };

  const handleSaveProbability = (e) => {
    e.preventDefault();
    const probNum = Number(editProb);
    if (isNaN(probNum) || probNum < 0 || probNum > 100) return;
    onUpdateDeal({ ...deal, probability: probNum, score: probNum });
    setIsEditingProb(false);
    showNotification(`Win probability updated to ${probNum}%`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      if (onDeleteDeal) onDeleteDeal(deal.id);
      onClose();
    }
  };

  const handleNavigateToOS = () => {
    onClose();
    navigate('/app');
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl h-full bg-[#0E0E10] border-l border-white/10 text-white shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${deal.avatarBg} text-white font-bold text-sm flex items-center justify-center shadow-lg`}>
                {deal.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {deal.company}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-400">{deal.stageTag}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{deal.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-xs font-semibold text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Delete Deal"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Notification Toast */}
          {actionNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2.5 text-xs text-emerald-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {actionNotice}
              </span>
              <span className="text-[10px] text-emerald-400/70 font-mono">Live State Updated</span>
            </motion.div>
          )}

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col justify-between">
                <span className="text-[11px] text-gray-400 mb-1">Deal Value</span>
                {isEditingValue ? (
                  <form onSubmit={handleSaveValue} className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 bg-black/60 border border-emerald-500/50 rounded px-1.5 py-0.5 text-xs text-emerald-400 font-mono"
                      autoFocus
                    />
                    <button type="submit" className="text-[10px] bg-emerald-600 px-1.5 py-0.5 rounded text-white font-bold">Save</button>
                  </form>
                ) : (
                  <span 
                    onClick={() => { setEditValue(deal.value); setIsEditingValue(true); }} 
                    className="text-lg font-bold text-emerald-400 font-mono cursor-pointer hover:underline"
                    title="Click to edit value"
                  >
                    ${typeof deal.value === 'number' ? deal.value.toLocaleString() : deal.value}
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col justify-between">
                <span className="text-[11px] text-gray-400 mb-1">Win Probability</span>
                {isEditingProb ? (
                  <form onSubmit={handleSaveProbability} className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editProb}
                      onChange={(e) => setEditProb(e.target.value)}
                      className="w-16 bg-black/60 border border-blue-500/50 rounded px-1.5 py-0.5 text-xs text-blue-400 font-mono"
                      autoFocus
                    />
                    <button type="submit" className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded text-white font-bold">Save</button>
                  </form>
                ) : (
                  <div 
                    onClick={() => { setEditProb(deal.probability || 50); setIsEditingProb(true); }}
                    className="flex items-center gap-1 text-lg font-bold text-blue-400 cursor-pointer hover:underline"
                    title="Click to edit win probability"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{deal.probability || deal.score || 50}%</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                <span className="text-[11px] text-gray-400 mb-1">Current Stage</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border w-fit mt-1 ${stageInfo.badge}`}>
                  {stageInfo.title}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/3 border border-white/5 flex flex-col">
                <span className="text-[11px] text-gray-400 mb-1">Intent Rating</span>
                <span className="text-xs font-semibold text-purple-300 capitalize mt-1">
                  {deal.intent} Intent
                </span>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="p-4 rounded-xl bg-linear-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 flex flex-wrap gap-2.5 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-300">Stage:</span>
                <select
                  value={deal.stage}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                >
                  <option value="lead_in">Lead In</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal">Proposal</option>
                  <option value="won">Closed Won</option>
                  <option value="lost">Closed Lost</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleScheduleFollowup}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Schedule Call
                </button>

                <button
                  onClick={() => handleStageChange('won')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Won
                </button>

                <button
                  onClick={() => handleStageChange('lost')}
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-xs font-semibold text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Mark Lost
                </button>
              </div>
            </div>

            {/* Contact & Company Details Card */}
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block mb-0.5">Primary Contact</span>
                  <span className="text-white font-medium">{deal.contact}</span>
                  <span className="text-gray-400 text-[11px] block">{deal.role}</span>
                </div>

                <div>
                  <span className="text-gray-500 block mb-0.5">Company</span>
                  <span className="text-white font-medium">{deal.company}</span>
                </div>

                <div>
                  <span className="text-gray-500 block mb-0.5">Email Address</span>
                  <span className="text-blue-400 font-mono">{deal.email || 'contact@company.com'}</span>
                </div>

                <div>
                  <span className="text-gray-500 block mb-0.5">Phone Number</span>
                  <span className="text-gray-300 font-mono">{deal.phone || '+1 (555) 000-0000'}</span>
                </div>
              </div>

              {deal.summary && (
                <div className="pt-3 border-t border-white/5 text-xs">
                  <span className="text-gray-500 block mb-1">Deal Summary & Context</span>
                  <p className="text-gray-300 font-light leading-relaxed">{deal.summary}</p>
                </div>
              )}
            </div>

            {/* Next Recommended Action */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  AI Recommended Next Action
                </span>
                <p className="text-sm font-semibold text-white">{deal.nextAction}</p>
              </div>
              <button
                onClick={handleScheduleFollowup}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shrink-0 transition-colors shadow-md cursor-pointer border-none"
              >
                Execute Action
              </button>
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Notes & Internal Comments ({deal.notes?.length || 0})
                </h4>
                <button
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer border-none bg-transparent"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Note
                </button>
              </div>

              {isAddingNote && (
                <form onSubmit={handleAddNote} className="space-y-2 bg-white/2 p-3 rounded-xl border border-white/10">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Write internal note about this deal..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1 rounded-md text-xs text-gray-400 hover:text-white cursor-pointer border-none bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-md bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer border-none"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {deal.notes && deal.notes.length > 0 ? (
                  deal.notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-xl bg-white/2 border border-white/5 text-xs">
                      <div className="flex justify-between items-center mb-1 text-[11px]">
                        <span className="font-semibold text-blue-300">{note.author}</span>
                        <span className="text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 italic p-3">No internal notes added yet.</div>
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Activity Timeline & Audit Log
              </h4>

              <div className="space-y-3 pl-2 border-l border-white/10">
                {deal.timeline && deal.timeline.length > 0 ? (
                  deal.timeline.map((event) => (
                    <div key={event.id} className="relative pl-4 text-xs">
                      <div className="absolute -left-4.25 top-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#0E0E10]" />
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-white">{event.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{event.time}</span>
                      </div>
                      <p className="text-gray-400 text-[11px] font-light">{event.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 italic">No historical timeline events recorded.</div>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-white/2 flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Synced with SalesPilot OS
            </span>

            <button
              onClick={handleNavigateToOS}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer border-none"
            >
              <span>View Customer in OS Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
