import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Grid, 
  Search, AlertTriangle, ShieldCheck, User, Building2, 
  Clock, Calendar, History, Sparkles, FileText, ChevronRight, RefreshCw 
} from 'lucide-react';
import { voiceAPI } from '../../api/voice';
import { useCRM } from '../../context/CRMContext';
import CallHistoryTable from '../../components/voice/CallHistoryTable';

export default function VoiceDashboard() {
  const { deals } = useCRM();

  // State Management
  const [telephonyStatus, setTelephonyStatus] = useState({ configured: false, provider: null, message: '' });
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'history'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Call States: 'IDLE' | 'CALLING' | 'RINGING' | 'CONNECTED' | 'ENDED' | 'PROVIDER_UNAVAILABLE' | 'FAILED' | 'BUSY' | 'NO_ANSWER' | 'DECLINED' | 'NETWORK_ERROR'
  const [callState, setCallState] = useState('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [callLogs, setCallLogs] = useState([]);
  const [manualPhoneInput, setManualPhoneInput] = useState('');

  // Fetch Telephony Provider Status on Mount
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const res = await voiceAPI.getStatus();
        if (mounted) {
          setTelephonyStatus({
            configured: !!res?.configured,
            provider: res?.provider || null,
            phone_number: res?.phone_number || null,
            message: res?.message || "Voice calling isn't configured yet. Connect your telephony provider to make real calls.",
          });
        }
      } catch {
        if (mounted) {
          setTelephonyStatus({
            configured: false,
            provider: null,
            message: "Voice calling isn't configured yet. Connect your telephony provider to make real calls.",
          });
        }
      }
    };
    fetchStatus();
    return () => { mounted = false; };
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

  // Set default selected contact from CRM if available
  useEffect(() => {
    if (!selectedContact && deals.length > 0) {
      setSelectedContact({
        id: deals[0].id,
        name: deals[0].contact,
        company: deals[0].company,
        phone: deals[0].phone || '+1 (555) 019-2834',
        email: deals[0].email,
        summary: deals[0].summary || 'Evaluating SalesPilot AI outbound integration.',
        notes: deals[0].notes || [],
      });
    }
  }, [deals, selectedContact]);

  // Call timer increment when connected
  useEffect(() => {
    let interval = null;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [callState]);

  // Start Call Handler
  const handleStartCall = async () => {
    setErrorMessage('');
    const targetPhone = selectedContact?.phone || manualPhoneInput || '+1 (555) 019-2834';
    const targetName = selectedContact?.name || 'Prospect';

    // 1. Check Telephony Provider Configuration
    if (!telephonyStatus.configured) {
      setCallState('PROVIDER_UNAVAILABLE');
      setErrorMessage("Voice calling isn't configured yet. Connect your telephony provider to make real calls.");
      return;
    }

    // 2. Trigger call initiation via backend API
    setCallState('CALLING');
    try {
      const res = await voiceAPI.startCall(selectedContact?.id || 'manual_1', targetPhone);
      if (res?.status === 'mock' || res?.status === 'initiated' || res?.status === 'in-progress') {
        // If backend confirms real call in-progress:
        setCallState('RINGING');
        setTimeout(() => {
          if (res?.status === 'in-progress') {
            setCallState('CONNECTED');
          } else {
            // Mock mode warning: backend is in mock mode
            setCallState('PROVIDER_UNAVAILABLE');
            setErrorMessage(res?.message || "Voice calling isn't configured yet. Connect your telephony provider to make real calls.");
          }
        }, 2000);
      } else {
        setCallState('FAILED');
        setErrorMessage("Telephony call initialization failed.");
      }
    } catch (err) {
      console.error("Start call error:", err);
      setCallState('NETWORK_ERROR');
      setErrorMessage("Network error: Unable to reach telephony server.");
    }
  };

  // End Call Handler
  const handleEndCall = () => {
    setCallState('ENDED');
    setTimeout(() => {
      setCallState('IDLE');
      setIsMuted(false);
      setIsSpeakerOn(false);
      setShowKeypad(false);
    }, 1500);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter contacts by search
  const filteredContacts = deals.filter(d => {
    const q = searchTerm.toLowerCase();
    return !searchTerm || 
      (d.contact && d.contact.toLowerCase().includes(q)) || 
      (d.company && d.company.toLowerCase().includes(q)) ||
      (d.phone && d.phone.includes(q));
  });

  return (
    <div className="w-full h-full bg-[#050816] text-[#F8FAFC] flex flex-col font-sans overflow-hidden">
      
      {/* ── Top Header & Provider Status Alert ──────────────────────────────── */}
      <header className="h-14 border-b border-slate-800 bg-[#070B18]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              SalesPilot Voice AI Workspace
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono uppercase">
                Production Calling
              </span>
            </h1>
          </div>
        </div>

        {/* Telephony Status Badge */}
        <div className="flex items-center space-x-3">
          {telephonyStatus.configured ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Twilio Telephony Active ({telephonyStatus.phone_number || 'Connected'})</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Voice Calling Unconfigured</span>
            </div>
          )}
        </div>
      </header>

      {/* Unconfigured Provider Top Banner */}
      {!telephonyStatus.configured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">
              Voice calling isn't configured yet. Connect your telephony provider (Twilio / Vonage) to make real calls.
            </span>
          </div>
          <span className="text-[10px] text-amber-400 font-mono bg-amber-500/20 px-2 py-0.5 rounded">
            PROVIDER_UNAVAILABLE
          </span>
        </div>
      )}

      {/* ── 3-COLUMN MAIN WORKSPACE LAYOUT ───────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ── LEFT COLUMN: Contacts / Search / Recent Calls (3 cols) ────────── */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-[#070B18]/50 flex flex-col overflow-hidden">
          
          {/* Header Switcher */}
          <div className="p-4 border-b border-slate-800 space-y-3 shrink-0">
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'contacts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Contacts / Leads
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Recent Calls
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contact, company, phone..."
                className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
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
                      onClick={() => setSelectedContact({
                        id: c.id,
                        name: c.contact,
                        company: c.company,
                        phone: c.phone || '+1 (555) 019-2834',
                        email: c.email,
                        summary: c.summary,
                        notes: c.notes || [],
                      })}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600/15 border-blue-500/40 text-white shadow-lg' 
                          : 'bg-[#0F172A]/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-white">{c.contact}</span>
                        <span className="text-[10px] text-blue-400 font-mono font-medium">{c.stageTitle}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span>{c.company}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {c.phone || '+1 (555) 019-2834'}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  No matching CRM contacts found.
                </div>
              )
            ) : (
              callLogs.length > 0 ? (
                callLogs.map((log, i) => (
                  <div key={log.id || i} className="p-3 bg-[#0F172A]/40 border border-slate-800/80 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-white">
                      <span>{log.to_number || log.recipient || 'Outbound Call'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.status || 'Completed'}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{log.direction || 'outbound'}</span>
                      <span>{log.duration ? `${log.duration}s` : '0s'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  No call history records found.
                </div>
              )
            )}
          </div>

        </div>

        {/* ── CENTER COLUMN: Selected Contact & Call Control Console (6 cols) ── */}
        <div className="lg:col-span-6 flex flex-col bg-[#050816] overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Selected Contact Card */}
          <div className="bg-[#0F172A]/70 border border-slate-800 p-6 rounded-2xl relative shadow-xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full bg-[#0A0E1A] rounded-[14px] flex items-center justify-center text-xl font-bold text-white">
                    {selectedContact?.name ? selectedContact.name.charAt(0) : 'P'}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {selectedContact?.name || 'Select a Contact'}
                  </h2>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedContact?.company || 'Company N/A'}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-300">{selectedContact?.phone || '+1 (555) 019-2834'}</span>
                  </p>
                </div>
              </div>

              {/* Call Status Badge Indicator */}
              <div className="shrink-0">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider border shadow-md ${
                  callState === 'CONNECTED' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 animate-pulse' :
                  callState === 'RINGING' || callState === 'CALLING' ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 animate-pulse' :
                  callState === 'PROVIDER_UNAVAILABLE' ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' :
                  callState === 'FAILED' || callState === 'NETWORK_ERROR' ? 'bg-rose-500/15 border-rose-500/40 text-rose-400' :
                  'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  STATUS: {callState.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Active Error Notice Box */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start space-x-3"
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200 uppercase text-[10px] tracking-wider font-mono">
                  {callState} ERROR
                </p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Call Control Console */}
          <div className="bg-[#0F172A]/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative">
            
            {/* Visualizer / Call State Animation Display */}
            <div className="w-32 h-32 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center relative shadow-inner">
              {callState === 'CONNECTED' ? (
                <div className="w-full h-full rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping" />
                  <div className="text-center z-10">
                    <Phone className="w-8 h-8 text-emerald-400 mx-auto mb-1 animate-bounce" />
                    <span className="text-sm font-mono font-bold text-white">{formatTimer(callTimer)}</span>
                  </div>
                </div>
              ) : callState === 'CALLING' || callState === 'RINGING' ? (
                <div className="w-full h-full rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping" />
                  <div className="text-center z-10">
                    <Phone className="w-8 h-8 text-blue-400 mx-auto mb-1" />
                    <span className="text-xs font-mono text-blue-300">Dialing...</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Phone className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 font-medium">Ready</span>
                </div>
              )}
            </div>

            {/* Action Buttons Console */}
            <div className="w-full max-w-sm">
              {callState === 'IDLE' || callState === 'PROVIDER_UNAVAILABLE' || callState === 'ENDED' || callState === 'FAILED' || callState === 'NETWORK_ERROR' ? (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onClick={handleStartCall}
                    className="w-full py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Phone className="w-5 h-5" />
                    <span>[ Start Outbound Call ]</span>
                  </button>
                  
                  <button
                    onClick={() => setShowKeypad(prev => !prev)}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 py-1 cursor-pointer"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>{showKeypad ? 'Hide Keypad' : 'Manual Dial Keypad'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* During Call Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setIsMuted(prev => !prev)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isMuted ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5 text-amber-400" /> : <Mic className="w-5 h-5 text-slate-300" />}
                      <span>{isMuted ? 'Muted' : 'Mute'}</span>
                    </button>

                    <button
                      onClick={() => setShowKeypad(prev => !prev)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        showKeypad ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Grid className="w-5 h-5 text-slate-300" />
                      <span>Keypad</span>
                    </button>

                    <button
                      onClick={() => setIsSpeakerOn(prev => !prev)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSpeakerOn ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isSpeakerOn ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5 text-slate-300" />}
                      <span>Speaker</span>
                    </button>
                  </div>

                  <button
                    onClick={handleEndCall}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-500/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>[ End Call ]</span>
                  </button>
                </div>
              )}
            </div>

            {/* Manual Keypad Dialog / Drawer */}
            {showKeypad && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xs bg-[#070B18] border border-slate-800 p-4 rounded-2xl space-y-3"
              >
                <input
                  type="text"
                  value={manualPhoneInput}
                  onChange={(e) => setManualPhoneInput(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-2 text-center text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => setManualPhoneInput(prev => prev + digit)}
                      className="py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm font-bold text-white font-mono transition-colors cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

        </div>

        {/* ── RIGHT COLUMN: AI Call Assistant & CRM Context (3 cols) ────────── */}
        <div className="lg:col-span-3 border-l border-slate-800 bg-[#070B18]/50 flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">AI Call Assistant</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time Guidance</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
            {/* Contact Account Intelligence */}
            <div className="bg-[#0F172A]/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                CRM Account Intelligence
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedContact?.summary || 'Evaluating SalesPilot AI deployment.'}
              </p>
            </div>

            {/* AI Talking Points Suggestion */}
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Live AI Talking Points</span>
              </h4>
              <ul className="text-xs text-purple-200/90 space-y-1.5 list-disc pl-4">
                <li>Highlight automated lead qualification workflows.</li>
                <li>Confirm decision-maker timeline for Q3 onboarding.</li>
                <li>Offer 14-day zero-risk trial of SalesPilot OS.</li>
              </ul>
            </div>

            {/* Previous Call / Interaction Notes */}
            <div className="bg-[#0F172A]/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                CRM Timeline Notes
              </h4>
              {selectedContact?.notes && selectedContact.notes.length > 0 ? (
                selectedContact.notes.map((n, i) => (
                  <div key={i} className="text-xs text-slate-400 border-l-2 border-blue-500 pl-2 py-1">
                    {n.text || n}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">
                  No prior call notes logged for this contact.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
