import React, { useState } from 'react';
import { Shield, Smartphone, Key, AlertTriangle, CheckCircle, Copy, Eye, EyeOff, LogOut, Trash2, Download, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState('mfa');
  const [mfaStep, setMfaStep] = useState('intro'); // intro, setup, verify, done
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const recoveryCodes = ['A1B2C3D4', 'E5F6G7H8', 'I9J0K1L2', 'M3N4O5P6', 'Q7R8S9T0', 'U1V2W3X4', 'Y5Z6A7B8', 'C9D0E1F2', 'G3H4I5J6', 'K7L8M9N0'];

  const [sessions] = useState([
    { id: '1', device: 'Chrome on Windows 11', ip: '192.168.1.5', lastActive: '2 minutes ago', current: true },
    { id: '2', device: 'Safari on iPhone 15', ip: '10.0.0.12', lastActive: '1 hour ago', current: false },
    { id: '3', device: 'Firefox on MacOS', ip: '172.16.0.88', lastActive: '3 days ago', current: false },
  ]);

  const tabs = [
    { id: 'mfa', label: 'Multi-Factor Auth', icon: Shield },
    { id: 'sessions', label: 'Active Sessions', icon: Smartphone },
    { id: 'privacy', label: 'Privacy & Data', icon: Key },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans text-[#F8FAFC]">
      <div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Security Settings</h1>
        <p className="text-[#94A3B8] mt-1 text-sm">Manage authentication, sessions, and data privacy.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex space-x-1 bg-[#070B14] border border-[#1E293B] rounded-2xl p-1.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all flex-1 justify-center cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0F172A] text-[#F8FAFC] shadow-md border border-[#263247]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <tab.icon size={16} className="mr-2 text-[#3B82F6]" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MFA Tab ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'mfa' && (
          <motion.div key="mfa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-[#0F172A] rounded-2xl border border-[#1E293B] overflow-hidden shadow-xl">
              <div className="p-6 border-b border-[#1E293B] bg-[#070B14]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#F8FAFC]">Two-Factor Authentication</h2>
                    <p className="text-sm text-[#94A3B8] mt-1">Add an extra layer of security to your account using an authenticator app.</p>
                  </div>
                  {mfaStep === 'intro' && (
                    <button onClick={() => setMfaStep('setup')} className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
                      Enable MFA
                    </button>
                  )}
                  {mfaStep === 'done' && (
                    <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                      <CheckCircle size={14} className="mr-1.5" /> Enabled
                    </span>
                  )}
                </div>
              </div>

              {mfaStep === 'setup' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-48 h-48 bg-[#070B14] rounded-2xl border-2 border-dashed border-[#263247] flex flex-col items-center justify-center text-[#64748B]">
                      <QrCode size={64} className="mb-2 text-[#3B82F6]" />
                      <span className="text-xs font-semibold text-[#94A3B8]">Scan QR Code</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-[#E2E8F0] mb-2">Manual Entry Key</h3>
                        <div className="flex items-center bg-[#070B14] border border-[#263247] rounded-xl px-3.5 py-2.5">
                          <code className="text-sm text-blue-400 font-mono flex-1">JBSWY3DPEHPK3PXP</code>
                          <button className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"><Copy size={16} /></button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">Enter Verification Code</label>
                        <div className="flex space-x-3">
                          <input type="text" maxLength={6} placeholder="000000" className="w-40 px-3.5 py-2.5 bg-[#070B14] border border-[#263247] rounded-xl text-center font-mono text-lg tracking-widest text-[#F8FAFC] placeholder-[#64748B] focus:border-[#3B82F6] outline-none" />
                          <button onClick={() => setMfaStep('done')} className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer">
                            Verify & Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mfaStep === 'done' && (
                <div className="p-6 space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start">
                    <CheckCircle className="text-emerald-400 mt-0.5 mr-3 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-emerald-300">MFA is enabled on your account.</p>
                      <p className="text-xs text-emerald-400/80 mt-1">You will be asked for a verification code on each login.</p>
                    </div>
                  </div>

                  <div>
                    <button onClick={() => setShowRecoveryCodes(!showRecoveryCodes)} className="flex items-center text-sm text-[#60A5FA] hover:underline font-semibold transition-colors cursor-pointer">
                      {showRecoveryCodes ? <EyeOff size={14} className="mr-1.5" /> : <Eye size={14} className="mr-1.5" />}
                      {showRecoveryCodes ? 'Hide' : 'Show'} Recovery Codes
                    </button>
                    <AnimatePresence>
                      {showRecoveryCodes && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 grid grid-cols-2 gap-2">
                          {recoveryCodes.map(code => (
                            <div key={code} className="bg-[#070B14] border border-[#263247] rounded-xl px-3 py-2 font-mono text-sm text-slate-300 text-center">{code}</div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Sessions Tab ── */}
        {activeTab === 'sessions' && (
          <motion.div key="sessions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-[#0F172A] rounded-2xl border border-[#1E293B] overflow-hidden shadow-xl">
              <div className="p-6 border-b border-[#1E293B] bg-[#070B14] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-[#F8FAFC]">Active Sessions</h2>
                  <p className="text-sm text-[#94A3B8]">Devices currently logged into your account.</p>
                </div>
                <button className="flex items-center px-3.5 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-semibold rounded-xl transition-colors border border-red-500/30 cursor-pointer">
                  <LogOut size={14} className="mr-2" /> Revoke All
                </button>
              </div>
              <div className="divide-y divide-[#1E293B]">
                {sessions.map(session => (
                  <div key={session.id} className="p-4 flex items-center justify-between hover:bg-[#1E293B]/40 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.current ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-[#070B14] text-[#64748B]'}`}>
                        <Smartphone size={18} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-[#F8FAFC] flex items-center">
                          {session.device}
                          {session.current && <span className="ml-2 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">Current</span>}
                        </p>
                        <p className="text-xs text-[#94A3B8]">IP: {session.ip} &middot; {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10 cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Privacy Tab ── */}
        {activeTab === 'privacy' && (
          <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-[#0F172A] rounded-2xl border border-[#1E293B] p-6 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-extrabold text-[#F8FAFC]">Data Privacy & Compliance</h2>
                <p className="text-sm text-[#94A3B8] mt-1">Manage your personal data in accordance with GDPR regulations.</p>
              </div>

              <div className="border border-[#1E293B] rounded-2xl divide-y divide-[#1E293B] bg-[#070B14] overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#F8FAFC]">Export My Data</p>
                    <p className="text-xs text-[#94A3B8]">Download a copy of all data associated with your account (GDPR Art. 20).</p>
                  </div>
                  <button className="flex items-center px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-[#E2E8F0] text-sm font-semibold rounded-xl border border-[#263247] transition-colors cursor-pointer">
                    <Download size={14} className="mr-2" /> Export
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#F8FAFC]">Delete My Account</p>
                    <p className="text-xs text-[#94A3B8]">Permanently anonymize your data and deactivate your account (GDPR Art. 17).</p>
                  </div>
                  <button className="flex items-center px-3.5 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-semibold rounded-xl transition-colors border border-red-500/30 cursor-pointer">
                    <Trash2 size={14} className="mr-2" /> Delete Account
                  </button>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start">
                <AlertTriangle className="text-amber-400 mt-0.5 mr-3 shrink-0" size={18} />
                <p className="text-xs text-amber-300">Account deletion is irreversible. All personal data will be anonymized and cannot be recovered. Active subscriptions will be cancelled.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
