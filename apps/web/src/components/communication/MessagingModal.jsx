import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, AlertTriangle, ShieldCheck, User, Building2, Clock, CheckCheck, Loader2 } from 'lucide-react';
import { communicationAPI } from '../../api/communication';

export const MessagingModal = ({ isOpen, onClose, recipientContact = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [providerStatus, setProviderStatus] = useState(null); // null | 'unconfigured' | 'success'
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (recipientContact) {
      // Load initial message history for contact
      setMessages([
        {
          id: 'msg_1',
          sender: 'contact',
          text: `Hi! We received your SalesPilot inquiry for ${recipientContact.company || 'our team'}. Could you send over more details?`,
          time: 'Yesterday 3:45 PM',
        },
        {
          id: 'msg_2',
          sender: 'user',
          text: `Hi ${recipientContact.contact || recipientContact.name || 'there'}! Absolutely. I am attaching our automated pipeline documentation.`,
          time: 'Yesterday 4:10 PM',
        }
      ]);
    }
    setInputText('');
    setProviderStatus(null);
    setStatusMessage('');
  }, [recipientContact, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);
    setProviderStatus(null);

    // Optimistic UI push
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };
    setMessages(prev => [...prev, newMsg]);

    try {
      // Call backend campaign / whatsapp endpoint
      const res = await communicationAPI.sendCampaign(recipientContact?.id || 'cust_1', 'whatsapp', 'instant_msg');
      if (res?.success) {
        setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
        setProviderStatus('success');
      } else {
        setProviderStatus('unconfigured');
        setStatusMessage("Messaging provider isn't configured yet. Connect WhatsApp Meta Cloud API to send real messages.");
        setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'failed' } : m));
      }
    } catch (err) {
      console.error("Messaging error:", err);
      setProviderStatus('unconfigured');
      setStatusMessage("Messaging provider isn't configured yet. Connect WhatsApp Meta Cloud API to send real messages.");
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'failed' } : m));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#070B18] border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-137.5"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-[#0F172A]/70 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  {recipientContact?.contact || recipientContact?.name || 'Messaging Workspace'}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    WhatsApp / SMS
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  <span>{recipientContact?.company || 'Company N/A'}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-300">{recipientContact?.phone || '+1 (555) 019-2834'}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Provider Unconfigured Status Notice */}
          {providerStatus === 'unconfigured' && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 px-6 text-xs text-amber-300 flex items-center space-x-2 shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#050816] custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs max-w-[80%] space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-end space-x-1 text-[10px] opacity-75 pt-1">
                    <span>{m.time}</span>
                    {m.sender === 'user' && (
                      m.status === 'failed' ? (
                        <span className="text-red-300 font-bold ml-1">✕ Failed</span>
                      ) : (
                        <CheckCheck className="w-3 h-3 ml-1" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#0F172A]/70 border-t border-slate-800 flex items-center gap-3 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send WhatsApp/SMS message to ${recipientContact?.contact || 'contact'}...`}
              className="flex-1 bg-[#050816] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all cursor-pointer shrink-0"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>[ Send ]</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MessagingModal;
