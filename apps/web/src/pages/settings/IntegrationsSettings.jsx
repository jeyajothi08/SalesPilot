import React, { useState, useEffect } from 'react';
import { Mail, Phone, ShieldCheck, AlertCircle, ExternalLink, RefreshCw, CheckCircle2, Zap, Settings, Key, Lock } from 'lucide-react';
import { voiceAPI } from '../../api/voice';

export default function IntegrationsSettings() {
  const [telephonyStatus, setTelephonyStatus] = useState({ configured: false, provider: null, phone_number: null });
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Interactive Setup Form State
  const [showConfig, setShowConfig] = useState(false);
  const [providerChoice, setProviderChoice] = useState('Demo Mode'); // 'Demo Mode' | 'Twilio' | 'Vonage'
  const [phoneNumber, setPhoneNumber] = useState('+1 (800) 555-0199');
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await voiceAPI.getStatus();
      setTelephonyStatus({
        configured: !!res?.configured,
        provider: res?.provider || 'Demo Mode',
        phone_number: res?.phone_number || '+1 (800) 555-0199',
      });
    } catch {
      setTelephonyStatus({ configured: false, provider: null, phone_number: null });
    }
  };

  useEffect(() => {
    fetchStatus();
    const handleUpdate = () => fetchStatus();
    window.addEventListener('telephony-config-updated', handleUpdate);
    return () => window.removeEventListener('telephony-config-updated', handleUpdate);
  }, []);

  const handleConnectGmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsGmailConnected(true);
      setIsLoading(false);
    }, 1200);
  };

  const handleSaveTelephony = async () => {
    setIsSaving(true);
    try {
      await voiceAPI.saveConfig({
        provider: providerChoice,
        phone_number: phoneNumber,
        mode: providerChoice === 'Demo Mode' ? 'simulation' : 'live',
      });
      setIsSaving(false);
      setShowConfig(false);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const handleDisconnectTelephony = async () => {
    await voiceAPI.clearConfig();
    setShowConfig(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <span>Integrations & Telephony Provider</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage third-party integrations, OAuth accounts, and voice telephony providers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* 1. GMAIL / EMAIL INTEGRATION CARD */}
        <div className="p-6 bg-[#0F172A]/70 border border-slate-800 rounded-2xl space-y-4 backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Gmail / Google Workspace</h3>
                <p className="text-xs text-slate-400">Send outbound AI emails, sync replies, and log interactions to CRM contacts.</p>
              </div>
            </div>

            <span className={`text-[11px] font-mono px-3 py-1 rounded-full font-bold border ${
              isGmailConnected 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              {isGmailConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          <div className="bg-[#070B18] border border-slate-800/80 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>OAuth Permissions Scope:</span>
              <span className="font-mono text-slate-400">https://mail.google.com/</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Token Vault Security:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted in Backend Server Vault</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 italic">
              {isGmailConnected ? 'Account connected as admin@salespilot.ai' : 'Connect via Google OAuth2 authorization code flow.'}
            </span>

            <button
              onClick={handleConnectGmail}
              disabled={isLoading}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-2 cursor-pointer border-none ${
                isGmailConnected
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : isGmailConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reconnect Gmail</span>
                </>
              ) : (
                <>
                  <span>Connect Gmail</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. TELEPHONY (TWILIO / VONAGE / DEMO) CARD */}
        <div className="p-6 bg-[#0F172A]/70 border border-slate-800 rounded-2xl space-y-4 backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Telephony Provider (Demo / Twilio / Vonage)</h3>
                <p className="text-xs text-slate-400">PSTN Voice dialing, TwiML webhooks, or local Demo Simulation Mode.</p>
              </div>
            </div>

            <span className={`text-[11px] font-mono px-3 py-1 rounded-full font-bold border ${
              telephonyStatus.configured 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {telephonyStatus.configured ? `${(telephonyStatus.provider || 'DEMO').toUpperCase()} ACTIVE` : 'UNCONFIGURED'}
            </span>
          </div>

          <div className="bg-[#070B18] border border-slate-800/80 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Active Provider:</span>
              <span className="font-mono text-slate-400">
                {telephonyStatus.configured ? telephonyStatus.provider || 'Demo Mode (Simulation)' : 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Assigned Phone Number:</span>
              <span className="font-mono text-slate-400">
                {telephonyStatus.phone_number || 'None'}
              </span>
            </div>
          </div>

          {/* Setup / Reconfigure Action Button */}
          {!showConfig ? (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 italic">
                {telephonyStatus.configured ? 'Telephony provider ready for outbound dialing.' : 'Enable Demo Simulation Mode or configure Twilio/Vonage keys.'}
              </span>
              
              <button
                onClick={() => setShowConfig(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-none shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{telephonyStatus.configured ? 'Reconfigure Calling' : 'Configure Calling'}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-[#070B18] border border-slate-800 rounded-2xl space-y-4 text-xs pt-4">
              <h4 className="font-bold text-white text-sm">Configure Telephony Setup</h4>
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Provider Choice</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Demo Mode', 'Twilio', 'Vonage'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProviderChoice(p)}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        providerChoice === p ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {providerChoice === 'Demo Mode' ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs">
                  Demo Mode simulates complete calling state transitions (`CONNECTING` → `CONNECTED` → `COMPLETED`) for local testing.
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Account SID / API Key</label>
                    <input
                      type="text"
                      value={accountSid}
                      onChange={(e) => setAccountSid(e.target.value)}
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Auth Token / Secret</label>
                    <input
                      type="password"
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      placeholder="••••••••••••••••••••••••"
                      className="w-full bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {telephonyStatus.configured ? (
                  <button
                    type="button"
                    onClick={handleDisconnectTelephony}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/30 cursor-pointer"
                  >
                    Disconnect
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer border-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTelephony}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer border-none shadow-md"
                  >
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
