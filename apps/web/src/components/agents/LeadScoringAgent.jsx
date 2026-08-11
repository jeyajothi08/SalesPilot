import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { CRMContextBuilder } from '../../services/ai/CRMContextBuilder';
import { AIService } from '../../services/ai/AIService';
import { Sparkles, TrendingUp, CheckCircle2, Award, Clock, ArrowUpRight, Filter, ChevronRight } from 'lucide-react';

export default function LeadScoringAgent() {
  const { deals } = useCRM();
  const [selectedCompany, setSelectedCompany] = useState('Acme Health Systems');

  // Customer context & score calculation
  const customerContext = useMemo(() => {
    return CRMContextBuilder.getCustomerContext(selectedCompany, deals);
  }, [selectedCompany, deals]);

  const scoreData = useMemo(() => {
    return AIService.calculateLeadScore(customerContext);
  }, [customerContext]);

  // Score History Mock Log
  const scoreHistory = [
    { date: 'Today at 2:15 PM', score: scoreData.score, category: scoreData.category, reason: 'High intent: Requested pricing proposal and opened demo 4 times.' },
    { date: 'Yesterday at 11:00 AM', score: Math.max(20, scoreData.score - 18), category: 'HIGH', reason: 'Qualified decision maker identified during inbound call.' },
    { date: '3 days ago', score: Math.max(10, scoreData.score - 35), category: 'MEDIUM', reason: 'Inbound demo request form submitted.' }
  ];

  const getBadgeStyle = (category) => {
    switch (category) {
      case 'VERY HIGH': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'HIGH': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar font-sans text-white bg-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>AI Predictive Lead Scoring</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
              Machine Learning Model
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Scores leads from 0 to 100 based on contract size, engagement frequency, buying signals, and stage velocity.
          </p>
        </div>

        {/* Target Customer Dropdown */}
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
        >
          {deals.map(d => (
            <option key={d.id} value={d.company} className="bg-[#121214]">
              {d.company} (${Number(d.value).toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-600/15 via-black to-black border border-amber-500/30 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">AI Lead Score</span>
          
          <div className="relative flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-amber-500/30 flex items-center justify-center bg-black/60 shadow-2xl">
              <span className="text-4xl font-extrabold text-white font-mono">{scoreData.score}</span>
              <span className="text-xs text-gray-400 font-mono absolute bottom-4">/ 100</span>
            </div>
          </div>

          <span className={`px-4 py-1 rounded-full text-xs font-extrabold border ${getBadgeStyle(scoreData.category)}`}>
            {scoreData.category} INTENT
          </span>

          <p className="text-xs text-gray-400 max-w-xs">
            Calculated for <strong className="text-white">{customerContext.company}</strong> ({customerContext.contact})
          </p>
        </div>

        {/* Score Rationale & Recommended Action */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/3 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Score Rationale & Engagement Signals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scoreData.reasons.map((reason, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Recommended AI Action</span>
              <p className="text-xs font-bold text-white mt-0.5">{scoreData.recommendedAction}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer border-none shrink-0">
              Execute Action
            </button>
          </div>
        </div>

      </div>

      {/* Score History Timeline */}
      <div className="p-5 rounded-2xl bg-white/3 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Historical Score Changes for {customerContext.company}</span>
        </h3>

        <div className="space-y-3 pl-3 border-l border-white/10">
          {scoreHistory.map((item, i) => (
            <div key={i} className="relative pl-4 text-xs space-y-0.5">
              <div className="absolute -left-4.5 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-black" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Score: <strong className="text-amber-300 font-mono">{item.score}/100</strong> ({item.category})</span>
                <span className="text-[10px] text-gray-500 font-mono">{item.date}</span>
              </div>
              <p className="text-gray-400 text-[11px]">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
