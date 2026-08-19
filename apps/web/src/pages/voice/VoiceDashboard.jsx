import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Grid, 
  Search, AlertTriangle, ShieldCheck, User, Building2, 
  History, Sparkles, ExternalLink, Settings, Info, CheckCircle2,
  Calendar, FileText, PauseCircle, PlayCircle, HelpCircle, X, ChevronRight,
  Zap, RefreshCw, Key, Lock, Check
} from 'lucide-react';
import { voiceAPI } from '../../api/voice';
import { useCRM } from '../../context/CRMContext';

export default function VoiceDashboard() {
  const crmContext = useCRM();
  const deals = Array.isArray(crmContext?.deals) ? crmContext.deals : [];

  // Provider & Setup State
  const [telephonyStatus, setTelephonyStatus] = useState({ configured: false, provider: null, phone_number: null, mode: 'simulation', message: '' });
  const [showLearnModal, setShowLearnModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  // Interactive Configuration Form State
  const [configForm, setConfigForm] = useState({
    provider: 'Demo Mode', // 'Demo Mode' | 'Twilio' | 'Vonage'
    mode: 'simulation', // 'simulation' | 'live'
    phone_number: '+1 (800) 555-0199',
    account_sid: '',
    auth_token: '',
  });
  const [testStatus, setTestStatus] = useState('IDLE'); // 'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'
  const [testErrorMessage, setTestErrorMessage] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'completed' | 'missed' | 'failed'
  const [selectedHistoryLog, setSelectedHistoryLog] = useState(null);
  
  // Call State Machine: 'IDLE' | 'READY' | 'CONNECTING' | 'RINGING' | 'CONNECTED' | 'ON_HOLD' | 'ENDING' | 'COMPLETED' | 'FAILED' | 'PROVIDER_UNAVAILABLE'
  const [callState, setCallState] = useState('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [callLogs, setCallLogs] = useState([]);
  const [manualPhoneInput, setManualPhoneInput] = useState('');

  // After-Call Form State
  const [afterCallOutcome, setAfterCallOutcome] = useState('Follow-up Needed');
  const [afterCallNotes, setAfterCallNotes] = useState('');
  const [afterCallNextAction, setAfterCallNextAction] = useState('Schedule Demo Call');
  const [afterCallFollowUpDate, setAfterCallFollowUpDate] = useState('Tomorrow 10:00 AM');
  const [isSavingOutcome, setIsSavingOutcome] = useState(false);

  // Fetch Telephony Provider Status on Mount & Register Event Listener
  const fetchStatus = async () => {
    try {
      const res = await voiceAPI.getStatus();
      setTelephonyStatus({
        configured: !!res?.configured,
        provider: res?.provider || 'Demo Mode',
        phone_number: res?.phone_number || '+1 (800) 555-0199',
        mode: res?.mode || 'simulation',
        message: res?.message || 'Telephony Provider Active',
      });
    } catch {
      setTelephonyStatus({
        configured: false,
        provider: null,
        phone_number: null,
        mode: 'simulation',
        message: 'Voice calling not configured.',
      });
    }
  };

  useEffect(() => {
    fetchStatus();

    const handleConfigUpdate = (e) => {
      if (e.detail) {
        setTelephonyStatus({
          configured: !!e.detail.configured,
          provider: e.detail.provider || 'Demo Mode',
          phone_number: e.detail.phone_number || '+1 (800) 555-0199',
          mode: e.detail.mode || 'simulation',
          message: `${e.detail.provider || 'Demo Mode'} Active`,
        });
      } else {
        fetchStatus();
      }
    };

    window.addEventListener('telephony-config-updated', handleConfigUpdate);
    return () => window.removeEventListener('telephony-config-updated', handleConfigUpdate);
  }, []);

  // Fetch Call History
  useEffect(() => {
    let mounted = true;
    const fetchHistory = async () => {
      try {
        const history = await voiceAPI.getCallHistory();
        if (mounted && Array.isArray(history)) {
          setCallLogs(history);
        }
      } catch (err) {
        console.warn('Call history fetch error:', err);
      }
    };
    fetchHistory();
    return () => { mounted = false; };
  }, [callState]);

  // Set default selected contact if available
  useEffect(() => {
    if (!selectedContact && deals.length > 0) {
      setSelectedContact(deals[0]);
    }
  }, [deals, selectedContact]);

  // Call timer increment when connected
  useEffect(() => {
    let interval = null;
    if (callState === 'CONNECTED' && !isOnHold) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [callState, isOnHold]);

  // Validate phone number
  const getPhoneValidation = () => {
    const phone = selectedContact?.phone || manualPhoneInput;
    if (!phone || !phone.trim()) {
      return { valid: false, reason: 'No phone number for selected contact.' };
    }
    const clean = phone.replace(/[\s\(\)\-\.]/g, '');
    if (clean.length < 7) {
      return { valid: false, reason: 'Invalid phone number format.' };
    }
    return { valid: true, phone };
  };

  const phoneValidation = getPhoneValidation();

  // Test Connection Handler
  const handleTestConnection = () => {
    setTestStatus('TESTING');
    setTestErrorMessage('');
    setTimeout(() => {
      if (configForm.provider === 'Twilio' && (!configForm.account_sid.trim() || !configForm.auth_token.trim())) {
        setTestStatus('ERROR');
        setTestErrorMessage('Account SID and Auth Token are required for Twilio connection.');
      } else {
        setTestStatus('SUCCESS');
      }
    }, 1000);
  };

  // Save Telephony Configuration Handler
  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await voiceAPI.saveConfig({
        provider: configForm.provider,
        phone_number: configForm.phone_number,
        mode: configForm.mode,
      });
      setIsSavingConfig(false);
      setShowConfigModal(false);
      setTestStatus('IDLE');
    } catch (err) {
      console.error("Save config error:", err);
      setIsSavingConfig(false);
    }
  };

  // Disconnect Provider Handler
  const handleDisconnect = async () => {
    await voiceAPI.clearConfig();
    setShowConfigModal(false);
    setTestStatus('IDLE');
  };

  // Start Call Handler
  const handleStartCall = async () => {
    setErrorMessage('');

    if (!telephonyStatus.configured) {
      setCallState('PROVIDER_UNAVAILABLE');
      return;
    }

    if (!phoneValidation.valid) {
      setErrorMessage(phoneValidation.reason);
      return;
    }

    setCallState('CONNECTING');
    try {
      const res = await voiceAPI.startCall(selectedContact?.id || 'manual_1', phoneValidation.phone);
      if (res?.status === 'initiated' || res?.status === 'in-progress' || res?.status === 'mock') {
        setCallState('RINGING');
        setTimeout(() => {
          setCallState('CONNECTED');
        }, 1800);
      } else {
        setCallState('FAILED');
        setErrorMessage(res?.message || "Call initiation failed. Please check provider connection.");
      }
    } catch (err) {
      console.error("Start call error:", err);
      setCallState('FAILED');
      setErrorMessage("Unable to establish call connection to backend service.");
    }
  };

  // End Call Handler (Transitions to AFTER-CALL COMPLETED state)
  const handleEndCall = () => {
    setCallState('ENDING');
    setTimeout(() => {
      setCallState('COMPLETED');
      setIsMuted(false);
      setIsOnHold(false);
      setIsSpeakerOn(false);
      setShowKeypad(false);
    }, 1000);
  };

  // Save Call Outcome Handler
  const handleSaveCallOutcome = () => {
    setIsSavingOutcome(true);
    setTimeout(() => {
      const newLog = {
        id: `call_${Date.now()}`,
        contact: selectedContact?.contact || selectedContact?.name || 'Contact',
        company: selectedContact?.company || 'Enterprise Client',
        to_number: phoneValidation.phone || '+1 (555) 019-2834',
        duration: callTimer || 45,
        status: 'Completed',
        outcome: afterCallOutcome,
        notes: afterCallNotes || 'Product demo and pricing scope reviewed.',
        created_at: new Date().toISOString(),
        direction: 'outbound',
        sentiment: afterCallOutcome.includes('Interested') || afterCallOutcome.includes('Demo') ? 'Positive' : 'Neutral',
        nextAction: afterCallNextAction,
      };

      setCallLogs(prev => [newLog, ...prev]);
      setIsSavingOutcome(false);
      setCallState('IDLE');
      setAfterCallNotes('');
    }, 800);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Status Label Display
  const getCallStateLabel = () => {
    switch (callState) {
      case 'IDLE': return selectedContact ? 'Ready to Call' : 'No Contact Selected';
      case 'CONNECTING': return 'Connecting...';
      case 'RINGING': return 'Ringing...';
      case 'CONNECTED': return `Connected • ${formatTimer(callTimer)}`;
      case 'ON_HOLD': return `On Hold • ${formatTimer(callTimer)}`;
      case 'ENDING': return 'Ending Call...';
      case 'COMPLETED': return 'Call Completed';
      case 'FAILED': return 'Call Failed';
      case 'PROVIDER_UNAVAILABLE': return 'Provider Unconfigured';
      default: return 'Ready';
    }
  };

  // Filter contacts by search query
  const filteredContacts = deals.filter(d => {
    const q = searchTerm.toLowerCase();
    return !searchTerm || 
      (d.contact && d.contact.toLowerCase().includes(q)) || 
      (d.company && d.company.toLowerCase().includes(q)) ||
      (d.phone && d.phone.includes(q)) ||
      (d.role && d.role.toLowerCase().includes(q)) ||
      (d.stageTitle && d.stageTitle.toLowerCase().includes(q));
  });

  // Filter history logs
  const filteredHistory = callLogs.filter(log => {
    if (historyFilter === 'completed') return log.status === 'Completed' || log.status === 'completed';
    if (historyFilter === 'missed') return log.status === 'Missed' || log.status === 'no-answer';
    if (historyFilter === 'failed') return log.status === 'Failed' || log.status === 'failed';
    return true;
  });

  return (
    <div className="w-full h-full bg-[#050816] text-[#F8FAFC] flex flex-col font-sans overflow-hidden">
      
      {/* ── TOP BAR: Compact Status Header ──────────────────────────────────── */}
      <header className="h-14 border-b border-slate-800 bg-[#070B18]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
              Voice Calling Workspace
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase font-bold border ${
                telephonyStatus.configured 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {telephonyStatus.configured ? 'READY' : 'NOT CONFIGURED'}
              </span>
            </h1>
          </div>
        </div>

        {/* Header Configuration Buttons */}
        <div className="flex items-center space-x-2">
          {!telephonyStatus.configured ? (
            <>
              <button
                onClick={() => setShowLearnModal(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-slate-700/80 flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Learn How It Works</span>
              </button>
              
              <button
                onClick={() => setShowConfigModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-none shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure Calling</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center space-x-2 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-bold transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{telephonyStatus.provider || 'Demo Mode'} Active ({telephonyStatus.phone_number || 'Connected'})</span>
                <Settings className="w-3 h-3 text-emerald-400/70 ml-1" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── 3-COLUMN WORKSPACE LAYOUT ────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ── LEFT COLUMN: Contacts / Call History List (3 cols) ───── */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-[#070B18]/50 flex flex-col overflow-hidden">
          
          {/* Tabs Switcher */}
          <div className="p-3.5 border-b border-slate-800 space-y-2.5 shrink-0">
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer border-none ${
                  activeTab === 'contacts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Contacts / Leads
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer border-none ${
                  activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Call History
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, company, phone..."
                className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer border-none bg-transparent"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Call History Filter */}
            {activeTab === 'history' && (
              <div className="flex gap-1 overflow-x-auto text-[10px] custom-scrollbar pt-0.5">
                {['all', 'completed', 'missed', 'failed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-mono cursor-pointer border-none ${
                      historyFilter === f ? 'bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold' : 'bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {activeTab === 'contacts' ? (
              filteredContacts.length > 0 ? (
                filteredContacts.map((c) => {
                  const isSelected = selectedContact?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-lg ring-1 ring-blue-500/40' 
                          : 'bg-[#0F172A]/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-white">{c.contact || c.company || 'CRM Contact'}</span>
                        <span className="text-[10px] text-blue-400 font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                          {c.stageTitle || 'Lead In'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{c.company}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400 truncate">{c.role || 'Decision Maker'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                        <span>{c.phone || '+1 (555) 019-2834'}</span>
                        <span className="text-emerald-400 font-bold">${(c.value || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs space-y-3 my-auto">
                  <User className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                  <div>
                    <p className="font-bold text-slate-300 text-sm">No contacts found</p>
                    <p className="mt-1 text-slate-500">Try adjusting your search query.</p>
                  </div>
                </div>
              )
            ) : (
              filteredHistory.length > 0 ? (
                filteredHistory.map((log, i) => (
                  <div 
                    key={log.id || i} 
                    onClick={() => setSelectedHistoryLog(log)}
                    className="p-3 bg-[#0F172A]/40 hover:bg-slate-800/50 border border-slate-800/80 rounded-xl space-y-1 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-white">
                      <span>{log.contact || log.to_number || 'Outbound Call'}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                        log.status === 'Completed' || log.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {log.status || 'Completed'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{log.company || 'Enterprise Client'}</span>
                      <span>{log.duration ? `${log.duration}s` : '45s'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs space-y-2 my-auto">
                  <History className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                  <div>
                    <p className="font-bold text-slate-300 text-sm">No call history logged</p>
                    <p className="mt-1 text-slate-500">Completed calls will appear here.</p>
                  </div>
                </div>
              )
            )}
          </div>

        </div>

        {/* ── CENTER COLUMN: Flexible Workspace Area (6 cols) ───────────────── */}
        <div className="lg:col-span-6 flex flex-col bg-[#050816] overflow-y-auto p-6 space-y-6 custom-scrollbar justify-center">
          
          {!telephonyStatus.configured ? (
            /* ── UNCONFIGURED EMPTY STATE CARD ───────────────────────────── */
            <div className="max-w-md mx-auto w-full bg-[#0F172A]/70 border border-slate-800 p-8 rounded-3xl text-center space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                <PhoneOff className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">Voice calling isn't configured</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Connect a telephony provider (Demo Simulation, Twilio, or Vonage) to enable voice dialing, call transcription, and AI assistance.
                </p>
              </div>

              <button
                onClick={() => setShowConfigModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none shadow-lg shadow-blue-500/25 inline-flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Configure Calling</span>
              </button>
            </div>
          ) : callState === 'COMPLETED' ? (
            /* ── AFTER CALL REVIEW PANEL ──────────────────────────────────── */
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0F172A]/80 border border-purple-500/30 p-6 rounded-3xl space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-extrabold text-white">After Call Summary & Outcome</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Duration: {formatTimer(callTimer || 45)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Call Outcome *</label>
                  <select
                    value={afterCallOutcome}
                    onChange={(e) => setAfterCallOutcome(e.target.value)}
                    className="w-full bg-[#070B18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Interested - Next Steps">Interested - Next Steps</option>
                    <option value="Demo Booked">Demo Booked</option>
                    <option value="Follow-up Needed">Follow-up Needed</option>
                    <option value="Left Voicemail">Left Voicemail</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Follow-up Schedule</label>
                  <input
                    type="text"
                    value={afterCallFollowUpDate}
                    onChange={(e) => setAfterCallFollowUpDate(e.target.value)}
                    placeholder="Tomorrow 10:00 AM"
                    className="w-full bg-[#070B18] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Call Notes & Key Takeaways</label>
                <textarea
                  rows={3}
                  value={afterCallNotes}
                  onChange={(e) => setAfterCallNotes(e.target.value)}
                  placeholder="Summarize prospect interest, objections, or next steps..."
                  className="w-full bg-[#070B18] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setCallState('IDLE')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer border-none"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveCallOutcome}
                  disabled={isSavingOutcome}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-none shadow-lg shadow-emerald-500/20"
                >
                  {isSavingOutcome ? 'Saving...' : 'Save Call Outcome'}
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── CONFIGURED ACTIVE CALL CONSOLE ───────────────────────────── */
            <div className="space-y-6">
              
              {/* Selected Contact Compact Header */}
              <div className="bg-[#0F172A]/70 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-xl">
                {selectedContact ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md">
                        <div className="w-full h-full bg-[#0A0E1A] rounded-[10px] flex items-center justify-center text-lg font-bold text-white">
                          {(selectedContact.contact || selectedContact.company || 'C').charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                          <span>{selectedContact.contact || 'Primary Contact'}</span>
                          <span className="text-[10px] text-blue-400 font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                            {selectedContact.stageTitle || 'Lead In'}
                          </span>
                        </h2>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-semibold text-slate-300">{selectedContact.company}</span>
                          <span>•</span>
                          <span className="text-slate-400">{selectedContact.role || 'Decision Maker'}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-300">{selectedContact.phone || '+1 (555) 019-2834'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                        ${(selectedContact.value || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 py-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">No contact selected</h2>
                      <p className="text-xs text-slate-400">Select a contact from the list to enable dialing.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Central Call Dialing Controls */}
              <div className="bg-[#0F172A]/50 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-5 shadow-2xl">
                
                {/* Visual Ring Indicator */}
                <div className="w-28 h-28 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center relative shadow-inner">
                  {callState === 'CONNECTED' || callState === 'ON_HOLD' ? (
                    <div className="w-full h-full rounded-full flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping" />
                      <div className="text-center z-10">
                        <Phone className="w-7 h-7 text-emerald-400 mx-auto mb-1 animate-bounce" />
                        <span className="text-xs font-mono font-bold text-white">{formatTimer(callTimer)}</span>
                      </div>
                    </div>
                  ) : callState === 'CONNECTING' || callState === 'RINGING' ? (
                    <div className="w-full h-full rounded-full flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping" />
                      <div className="text-center z-10">
                        <Phone className="w-7 h-7 text-blue-400 mx-auto mb-1" />
                        <span className="text-xs font-mono text-blue-300">Ringing...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Phone className="w-7 h-7 text-slate-600 mx-auto mb-1" />
                      <span className="text-xs text-slate-500 font-medium">{getCallStateLabel()}</span>
                    </div>
                  )}
                </div>

                {/* Primary CTA & Controls */}
                <div className="w-full max-w-xs space-y-3">
                  {callState === 'IDLE' || callState === 'FAILED' ? (
                    <>
                      <button
                        onClick={handleStartCall}
                        disabled={!selectedContact}
                        className={`w-full py-3 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all border-none ${
                          selectedContact
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 cursor-pointer active:scale-[0.98]'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span>Start Call</span>
                      </button>

                      <button
                        onClick={() => setShowKeypad(prev => !prev)}
                        className="text-xs text-slate-400 hover:text-white flex items-center justify-center space-x-1.5 py-1 mx-auto cursor-pointer border-none bg-transparent"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>{showKeypad ? 'Hide Keypad' : 'Show Keypad'}</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      {/* Active Call Controls */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setIsMuted(prev => !prev)}
                          className={`py-2 rounded-lg border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            isMuted ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          {isMuted ? <MicOff className="w-4 h-4 text-amber-400" /> : <Mic className="w-4 h-4 text-slate-300" />}
                          <span>{isMuted ? 'Muted' : 'Mute'}</span>
                        </button>

                        <button
                          onClick={() => setIsOnHold(prev => !prev)}
                          className={`py-2 rounded-lg border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            isOnHold ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          {isOnHold ? <PlayCircle className="w-4 h-4 text-amber-400" /> : <PauseCircle className="w-4 h-4 text-slate-300" />}
                          <span>{isOnHold ? 'On Hold' : 'Hold'}</span>
                        </button>

                        <button
                          onClick={() => setIsSpeakerOn(prev => !prev)}
                          className={`py-2 rounded-lg border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            isSpeakerOn ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          {isSpeakerOn ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
                          <span>Speaker</span>
                        </button>
                      </div>

                      {/* Red End Call Button */}
                      <button
                        onClick={handleEndCall}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer border-none"
                      >
                        <PhoneOff className="w-4 h-4" />
                        <span>End Call</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Compact 3-Column Keypad */}
                {showKeypad && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-60 bg-[#070B18] border border-slate-800 p-3 rounded-2xl space-y-2 mx-auto"
                  >
                    <input
                      type="text"
                      value={manualPhoneInput}
                      onChange={(e) => setManualPhoneInput(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-lg px-2.5 py-1 text-center text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                    <div className="grid grid-cols-3 gap-1.5">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                        <button
                          key={digit}
                          onClick={() => setManualPhoneInput(prev => prev + digit)}
                          className="h-11 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-white font-mono transition-colors cursor-pointer flex items-center justify-center"
                        >
                          {digit}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN: Fixed-Width AI Assistant Panel (340px) ─────────── */}
        <div className="lg:col-span-3 border-l border-slate-800 bg-[#070B18]/50 flex flex-col overflow-hidden w-full lg:w-85 shrink-0">
          
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">AI Call Assistant</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {selectedContact ? 'Live CRM Context' : 'Awaiting Selection'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
            
            {/* Customer Context */}
            <div className="bg-[#0F172A]/60 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider font-mono text-[10px]">
                Customer Context
              </h4>
              <p className="text-slate-400 leading-relaxed">
                {selectedContact ? `${selectedContact.contact} (${selectedContact.company}) — Stage: ${selectedContact.stageTitle || 'Proposal Sent'} ($${(selectedContact.value || 0).toLocaleString()}).` : 'No contact selected.'}
              </p>
            </div>

            {/* Talking Points */}
            <div className="bg-[#0F172A]/60 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
              <h4 className="font-bold text-purple-300 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Talking Points</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                {selectedContact ? `1. Review executive proposal terms.\n2. Address technical SLA timeline.\n3. Confirm Q4 deployment schedule.` : 'Select a contact to generate talking points.'}
              </p>
            </div>

            {/* Objection Strategy */}
            <div className="bg-[#0F172A]/60 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider font-mono text-[10px]">
                Objection Strategy
              </h4>
              <p className="text-slate-400 leading-relaxed">
                {selectedContact ? `• Budget concern: Highlight projected 3x ROI in Q4.\n• Setup speed: Emphasize 48-hour onboarding SLA.` : 'Strategy updates when contact is selected.'}
              </p>
            </div>

            {/* Next Best Action */}
            <div className="bg-[#0F172A]/60 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
              <h4 className="font-bold text-blue-300 uppercase tracking-wider font-mono text-[10px]">
                Next Best Action
              </h4>
              <p className="text-slate-400 font-semibold">
                {selectedContact ? (selectedContact.nextAction || 'Schedule follow-up demo call.') : 'Awaiting contact context.'}
              </p>
            </div>

            {/* Notes */}
            <div className="bg-[#0F172A]/60 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider font-mono text-[10px]">
                Notes
              </h4>
              {selectedContact?.notes && selectedContact.notes.length > 0 ? (
                selectedContact.notes.map((n, i) => (
                  <div key={i} className="text-slate-300 border-l-2 border-blue-500 pl-2 py-0.5">
                    {n.text || n}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">No notes logged yet.</p>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ── INTERACTIVE TELEPHONY CONFIGURATION MODAL ───────────────────────── */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-200 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 text-white shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Configure Telephony Provider</h3>
                  <p className="text-xs text-slate-400">Select provider mode for local dialing or live PSTN routing.</p>
                </div>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-white cursor-pointer border-none bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Provider Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Telephony Provider *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Demo Mode', label: 'Demo Mode (Local)', icon: Zap },
                    { id: 'Twilio', label: 'Twilio PSTN', icon: Phone },
                    { id: 'Vonage', label: 'Vonage Carrier', icon: ShieldCheck },
                  ].map(p => {
                    const Icon = p.icon;
                    const isSel = configForm.provider === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setConfigForm(prev => ({ ...prev, provider: p.id }))}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                          isSel ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md' : 'bg-[#070B18] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSel ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span className="text-[11px]">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Provider Specific Input Fields */}
              {configForm.provider === 'Demo Mode' ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Demo Mode Enabled</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Interactive simulation mode for local development. Allows full testing of calling state transitions (`CONNECTING` → `RINGING` → `CONNECTED`), DTMF keypad, and After-Call outcome logging.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 bg-[#070B18] p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Account SID / API Key *</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={configForm.account_sid}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, account_sid: e.target.value }))}
                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Auth Token / Secret *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        value={configForm.auth_token}
                        onChange={(e) => setConfigForm(prev => ({ ...prev, auth_token: e.target.value }))}
                        placeholder="••••••••••••••••••••••••••••••••"
                        className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Assigned Phone Number *</label>
                    <input
                      type="text"
                      value={configForm.phone_number}
                      onChange={(e) => setConfigForm(prev => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="+1 (800) 555-0199"
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Test Status Banner */}
              {testStatus === 'SUCCESS' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Connection test succeeded! Provider credentials validated.</span>
                </div>
              )}

              {testStatus === 'ERROR' && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{testErrorMessage || 'Connection validation failed.'}</span>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {telephonyStatus.configured ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/30 cursor-pointer transition-colors"
                >
                  Disconnect Provider
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus === 'TESTING'}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer border-none transition-colors flex items-center space-x-1.5"
                >
                  {testStatus === 'TESTING' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <span>Test Connection</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer border-none transition-all flex items-center space-x-1.5"
                >
                  {isSavingConfig ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── LEARN HOW IT WORKS GUIDE MODAL ──────────────────────────────────── */}
      {showLearnModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-200 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <span>Telephony Integration Guide</span>
              </h3>
              <button onClick={() => setShowLearnModal(false)} className="text-slate-400 hover:text-white cursor-pointer border-none bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                SalesPilot AI connects directly to standard PSTN telephony providers (such as <strong>Twilio</strong> or <strong>Vonage</strong>) or <strong>Demo Simulation Mode</strong> for local testing.
              </p>
              
              <div className="bg-[#070B18] p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
                <p className="text-blue-300 font-bold">Required Backend Variables:</p>
                <p>TWILIO_ACCOUNT_SID=ACxxx...</p>
                <p>TWILIO_AUTH_TOKEN=xxx...</p>
                <p>TWILIO_PHONE_NUMBER=+1555...</p>
              </div>

              <p>
                Once configured, status updates to <strong>READY</strong>.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { setShowLearnModal(false); setShowConfigModal(true); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer border-none"
              >
                Configure Calling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CALL HISTORY DETAIL MODAL ───────────────────────────────────────── */}
      {selectedHistoryLog && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-200 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold">{selectedHistoryLog.contact || 'Call Log Details'}</h3>
                <p className="text-xs text-slate-400">{selectedHistoryLog.company} • {selectedHistoryLog.created_at?.substring(0, 10) || 'Today'}</p>
              </div>
              <button onClick={() => setSelectedHistoryLog(null)} className="text-slate-400 hover:text-white cursor-pointer border-none bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#070B18] p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block font-mono">Outcome</span>
                  <span className="font-bold text-emerald-400">{selectedHistoryLog.outcome || 'Interested'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-mono">Duration</span>
                  <span className="font-bold text-slate-200">{selectedHistoryLog.duration ? `${selectedHistoryLog.duration}s` : '45s'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 mb-1">AI Transcript & Notes</h4>
                <div className="bg-[#070B18] p-3 rounded-xl border border-slate-800 text-slate-400 leading-relaxed">
                  {selectedHistoryLog.notes || 'Discussed product rollout timeline, pricing model, and enterprise support SLAs.'}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedHistoryLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
