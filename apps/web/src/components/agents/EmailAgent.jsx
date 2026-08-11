import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { CRMContextBuilder } from '../../services/ai/CRMContextBuilder';
import { AIService } from '../../services/ai/AIService';
import { Mail, Send, Sparkles, CheckCircle2, AlertCircle, RefreshCw, FileEdit, Archive, MessageSquare, ShieldCheck, User } from 'lucide-react';

export default function EmailAgent() {
  const { deals, updateDeal, addDeal } = useCRM();

  const [selectedCompany, setSelectedCompany] = useState('Acme Health Systems');
  const [emailPurpose, setEmailPurpose] = useState('follow-up');
  const [emailState, setEmailState] = useState('Draft'); // Draft | Pending Approval | Approved | Sent | Failed
  const [editableEmail, setEditableEmail] = useState(null);
  const [incomingEmailText, setIncomingEmailText] = useState('Can you send the final pricing proposal for Acme Enterprise?');
  const [intentAnalysis, setIntentAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('composer'); // composer | inbox | thread
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get active customer context for selected company
  const customerContext = useMemo(() => {
    return CRMContextBuilder.getCustomerContext(selectedCompany, deals);
  }, [selectedCompany, deals]);

  // Generate contextual email
  const handleGenerateEmail = () => {
    const generated = AIService.generateEmail(customerContext, emailPurpose);
    setEditableEmail(generated);
    setEmailState('Draft');
    showToast('AI Email generated using live CRM context.');
  };

  // Initialize email on load or company change
  useMemo(() => {
    if (!editableEmail || editableEmail.to !== customerContext.email) {
      const initial = AIService.generateEmail(customerContext, emailPurpose);
      setEditableEmail(initial);
      setEmailState('Draft');
    }
  }, [selectedCompany, customerContext, emailPurpose]);

  // Intent Analysis for incoming email
  const handleAnalyzeIncomingEmail = () => {
    const analysis = AIService.analyzeEmail(incomingEmailText);
    setIntentAnalysis(analysis);
    showToast('Incoming email analyzed for intent and buying signals.');
  };

  // Send & Log Activity Approval Flow
  const handleSendEmail = () => {
    setEmailState('Pending Approval');
    
    setTimeout(() => {
      setEmailState('Sent');
      
      // Log activity to CRM
      if (customerContext.activeDeal) {
        const updatedTimeline = [
          {
            id: `email_${Date.now()}`,
            title: `Email Sent: ${editableEmail.subject}`,
            time: 'Just now',
            type: 'email',
            desc: `Approved and sent by sales rep to ${editableEmail.to}`,
          },
          ...(customerContext.activeDeal.timeline || []),
        ];

        updateDeal(customerContext.activeDeal.id, {
          timeline: updatedTimeline,
          lastActivityAt: new Date().toISOString(),
        });
      }

      showToast(`Email successfully approved & sent to ${editableEmail.to}. Activity logged in CRM.`);
    }, 800);
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-5 overflow-y-auto custom-scrollbar font-sans text-white bg-black">
      
      {/* Agent Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-400" />
            <span>AI Email Agent</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
              Human-in-the-Loop
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Generates personalized contextual emails from CRM data. Requires explicit user review before sending.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          {[
            { id: 'composer', label: 'Email Composer' },
            { id: 'inbox', label: 'Intent Detector' },
            { id: 'thread', label: 'Conversation Thread' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer border-none ${
                activeTab === t.id 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TAB 1: EMAIL COMPOSER */}
      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Context Controls */}
          <div className="p-5 rounded-2xl bg-white/3 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              CRM Target Context
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Select Customer Account</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
              >
                {deals.map(d => (
                  <option key={d.id} value={d.company} className="bg-[#121214]">
                    {d.company} — ${Number(d.value).toLocaleString()} ({d.stageTitle || d.stage})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Purpose / Goal</label>
              <select
                value={emailPurpose}
                onChange={(e) => setEmailPurpose(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
              >
                <option value="follow-up">Follow-up on Pipeline Stage</option>
                <option value="pricing">Send Enterprise Pricing Proposal</option>
                <option value="demo">Schedule Technical Demo</option>
                <option value="contract">Send Contract & SLA</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Context Overview</span>
              <div className="space-y-1 text-gray-300 text-[11px]">
                <p>• <strong>Contact:</strong> {customerContext.contact}</p>
                <p>• <strong>Deal Stage:</strong> {customerContext.stage}</p>
                <p>• <strong>Probability:</strong> {customerContext.probability}%</p>
                <p>• <strong>Next Action:</strong> {customerContext.nextAction}</p>
              </div>
            </div>

            <button
              onClick={handleGenerateEmail}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate AI Email</span>
            </button>
          </div>

          {/* Right Editor & Approval Card */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white/3 border border-white/10 space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">AI Email Preview & Review</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  emailState === 'Sent' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  Status: {emailState}
                </span>
              </div>
            </div>

            {editableEmail && (
              <div className="space-y-3 flex-1 flex flex-col">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">To</label>
                  <input
                    type="email"
                    value={editableEmail.to}
                    onChange={(e) => setEditableEmail({ ...editableEmail, to: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={editableEmail.subject}
                    onChange={(e) => setEditableEmail({ ...editableEmail, subject: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white font-bold"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">Email Body</label>
                  <textarea
                    rows={8}
                    value={editableEmail.fullMessage}
                    onChange={(e) => setEditableEmail({ ...editableEmail, fullMessage: e.target.value })}
                    className="w-full h-56 bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-gray-200 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none"
                  />
                </div>

                {/* Approval Action Bar */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Human approval required before delivery
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateEmail}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
                    >
                      Regenerate
                    </button>
                    
                    <button
                      onClick={handleSendEmail}
                      disabled={emailState === 'Sent'}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer border-none"
                    >
                      <Send className="w-4 h-4" />
                      <span>{emailState === 'Sent' ? 'Sent & Logged' : 'Approve & Send Email'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: INCOMING EMAIL INTENT DETECTOR */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white/3 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Incoming Prospect Email</h3>
            <textarea
              rows={6}
              value={incomingEmailText}
              onChange={(e) => setIncomingEmailText(e.target.value)}
              placeholder="Paste incoming prospect email text here..."
              className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none font-sans"
            />
            <button
              onClick={handleAnalyzeIncomingEmail}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Email Intent & Signals</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white/3 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Intent & Signal Analysis</h3>
            {intentAnalysis ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Detected Intent</span>
                    <span className="font-bold text-purple-300">{intentAnalysis.intent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Buying Signal</span>
                    <span className="font-bold text-emerald-400">{intentAnalysis.buyingSignal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sentiment</span>
                    <span className="font-bold text-blue-300">{intentAnalysis.sentiment}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Recommended AI Action</span>
                  <p className="text-white font-medium">{intentAnalysis.recommendedAction}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 italic">
                Click "Analyze Email Intent & Signals" to evaluate incoming text.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONVERSATION THREAD VIEW */}
      {activeTab === 'thread' && (
        <div className="p-5 rounded-2xl bg-white/3 border border-white/10 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">{selectedCompany} Email Thread</h3>
              <p className="text-xs text-gray-400">Subject: Re: SalesPilot AI Deployment Proposal</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              Active Thread
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-xs space-y-1">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span className="font-bold text-blue-300">Dr. Aris Thorne (Chief Medical Officer)</span>
                <span>Yesterday at 4:15 PM</span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                "Hi Alex, we reviewed the initial demo. Can you confirm if SalesPilot AI voice receptionist supports HIPAA-compliant audit logging for patient appointments?"
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-xs space-y-1">
              <div className="flex justify-between text-gray-400 text-[11px]">
                <span className="font-bold text-blue-400">Alex Rivera (AI SDR)</span>
                <span>Today at 9:30 AM</span>
              </div>
              <p className="text-white leading-relaxed">
                "Hello Dr. Thorne! Yes, SalesPilot AI includes full BAA agreements and HIPAA-compliant encrypted voice logging for healthcare deployments."
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
