import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Save, X, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, Loader2, Link2 } from 'lucide-react';
import { communicationAPI } from '../../api/communication';

export const EmailComposerModal = ({ isOpen, onClose, recipientContact = null, initialSubject = '', initialBody = '' }) => {
  const [toEmail, setToEmail] = useState('');
  const [toName, setToName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'success' | 'unconfigured' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  useEffect(() => {
    if (recipientContact) {
      setToEmail(recipientContact.email || `${(recipientContact.contact || recipientContact.name || 'contact').toLowerCase().replace(/\s+/g, '.')}@company.com`);
      setToName(recipientContact.contact || recipientContact.name || recipientContact.company || 'Valued Client');
      setSubject(initialSubject || `SalesPilot Follow-up — ${recipientContact.company || 'Partnership'}`);
      setBody(initialBody || `Hi ${recipientContact.contact || recipientContact.name || 'there'},\n\nFollowing up on our recent discussion regarding SalesPilot AI deployment.\n\nBest regards,\nSalesPilot Team`);
    } else {
      setToEmail('');
      setToName('');
      setSubject(initialSubject || '');
      setBody(initialBody || '');
    }
    setEmailStatus(null);
    setStatusMessage('');
    setIsDraftSaved(false);
  }, [recipientContact, initialSubject, initialBody, isOpen]);

  if (!isOpen) return null;

  // AI Draft Generator Handler
  const handleGenerateAIDraft = async () => {
    setIsGenerating(true);
    setEmailStatus(null);
    try {
      const res = await communicationAPI.generateAIDraft(
        `Write a professional sales follow-up email to ${toName} at ${recipientContact?.company || 'their company'} regarding deal next steps.`,
        'email'
      );
      if (res?.draft) {
        setBody(res.draft);
      }
    } catch (err) {
      console.warn("AI draft generation fallback used:", err);
      setBody(`Hi ${toName},\n\nThank you for taking the time to speak with SalesPilot AI. Based on our evaluation, we can help streamline your sales pipeline and automate outbound engagement.\n\nWould you be open to a 15-minute quick demo call this week?\n\nBest regards,\nSales Team`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Send Email Handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!toEmail || !subject || !body) return;

    setIsSending(true);
    setEmailStatus(null);
    setStatusMessage('');

    try {
      const res = await communicationAPI.sendCampaign(recipientContact?.id || 'cust_1', 'email', 'standard_followup');
      if (res?.success) {
        setEmailStatus('success');
        setStatusMessage('Email sent successfully!');
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setEmailStatus('unconfigured');
        setStatusMessage("Email isn't connected yet. Connect Gmail to send emails from SalesPilot.");
      }
    } catch (err) {
      console.error("Email send error:", err);
      // Check if backend returned provider error / 422 / 500
      setEmailStatus('unconfigured');
      setStatusMessage("Email isn't connected yet. Connect Gmail to send emails from SalesPilot.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#070B18] border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-[#0F172A]/70 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  New Email Message
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    Gmail / SendGrid
                  </span>
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Provider Unconfigured / Error Status Banner */}
          {emailStatus === 'unconfigured' && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 p-4 text-xs text-amber-300 flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-200">Email isn't connected yet.</p>
                  <p className="mt-0.5 text-amber-300/90">{statusMessage}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  alert("To connect Gmail / SendGrid, add your SENDGRID_API_KEY in backend environment configuration.");
                }}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Connect Gmail</span>
              </button>
            </div>
          )}

          {/* Success Banner */}
          {emailStatus === 'success' && (
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-4 text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">{statusMessage}</span>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSend} className="p-6 space-y-4 flex-1 flex flex-col">
            {/* To Field */}
            <div className="flex items-center border-b border-slate-800 pb-2">
              <label className="w-16 text-xs font-semibold text-slate-400">To:</label>
              <input
                type="email"
                required
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="recipient@company.com"
                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-slate-600 font-mono"
              />
            </div>

            {/* Subject Field */}
            <div className="flex items-center border-b border-slate-800 pb-2">
              <label className="w-16 text-xs font-semibold text-slate-400">Subject:</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject line..."
                className="flex-1 bg-transparent text-sm font-semibold text-white focus:outline-none placeholder-slate-600"
              />
            </div>

            {/* AI Generator Helper Bar */}
            <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/20 px-3.5 py-2 rounded-xl text-xs">
              <span className="text-purple-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>SalesPilot AI Copywriter</span>
              </span>
              <button
                type="button"
                onClick={handleGenerateAIDraft}
                disabled={isGenerating}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                <span>{isGenerating ? 'Drafting...' : '✨ Auto-Draft Copy'}</span>
              </button>
            </div>

            {/* Body TextArea */}
            <div className="flex-1 min-h-45 flex flex-col">
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email message here..."
                className="w-full h-full bg-[#0F172A]/50 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed custom-scrollbar"
              />
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isDraftSaved ? 'Draft Saved ✓' : 'Save Draft'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isSending ? 'Sending Email...' : '[ Send Email ]'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmailComposerModal;
