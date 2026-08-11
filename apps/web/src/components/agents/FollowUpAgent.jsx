import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { AIService } from '../../services/ai/AIService';
import { AlertCircle, CheckCircle2, Clock, Calendar, Mail, Send, ShieldCheck, CheckCheck, XCircle, ArrowUpRight } from 'lucide-react';

export default function FollowUpAgent() {
  const { deals, updateDeal } = useCRM();

  const [approvedIds, setApprovedIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate automated follow-up recommendations grounded in CRM deals
  const recommendations = useMemo(() => {
    return AIService.generateFollowUpRecommendations(deals);
  }, [deals]);

  const activeRecs = recommendations.filter(r => !approvedIds.includes(r.id) && !rejectedIds.includes(r.id));

  const handleApprove = (rec) => {
    setApprovedIds(prev => [...prev, rec.id]);
    
    // Execute mutation on deal
    if (rec.dealId) {
      updateDeal(rec.dealId, {
        nextAction: `Follow-up approved: ${rec.suggestedMessage.slice(0, 35)}...`,
        activityTime: 'Just now',
      });
    }

    showToast(`Approved follow-up action for ${rec.company}. CRM task created & activity logged.`);
  };

  const handleReject = (recId) => {
    setRejectedIds(prev => [...prev, recId]);
    showToast('Follow-up recommendation dismissed.');
  };

  const handleApproveAll = () => {
    const ids = activeRecs.map(r => r.id);
    setApprovedIds(prev => [...prev, ...ids]);
    showToast(`Approved all ${ids.length} pending follow-up recommendations.`);
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar font-sans text-white bg-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span>AI Follow-up Agent</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
              Approval Queue
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Detects stale deals, overdue tasks, and no-response accounts. Generates ready-to-approve recommendations.
          </p>
        </div>

        {activeRecs.length > 0 && (
          <button
            onClick={handleApproveAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer border-none"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Approve All ({activeRecs.length})</span>
          </button>
        )}
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pending Follow-up Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Pending Follow-Up Recommendations ({activeRecs.length})
        </h3>

        <div className="space-y-4">
          {activeRecs.length > 0 ? (
            activeRecs.map((rec) => {
              const isHigh = rec.priority === 'HIGH';
              return (
                <div 
                  key={rec.id}
                  className="p-5 rounded-2xl bg-white/3 border border-white/10 hover:border-blue-500/30 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-400">{rec.company}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">${rec.value.toLocaleString()}</span>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight">{rec.dealTitle}</h4>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      isHigh ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Detection Reason</span>
                    <p className="text-gray-300">{rec.reason}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      <span>Suggested Action ({rec.channel})</span>
                      <span>Target Date: {rec.recommendedDate}</span>
                    </div>
                    <p className="text-white font-medium italic">"{rec.suggestedMessage}"</p>
                    <span className="text-[11px] text-gray-400 block pt-1 border-t border-white/5">
                      Expected Outcome: <strong className="text-emerald-300">{rec.expectedOutcome}</strong>
                    </span>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Approval triggers CRM task & activity log
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(rec.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-300 border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(rec)}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/25 cursor-pointer border-none flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Execute</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-xs text-gray-500 italic bg-white/2 rounded-2xl border border-white/5">
              All follow-up recommendations have been reviewed and approved!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
