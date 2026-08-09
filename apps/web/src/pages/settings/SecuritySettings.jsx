import React, { useState } from 'react';
import { Shield, Smartphone, Key, Clock, AlertTriangle, CheckCircle, Copy, Eye, EyeOff, LogOut, Trash2, Download, QrCode } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-500 mt-1">Manage authentication, sessions, and data privacy.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MFA Tab ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'mfa' && (
          <motion.div key="mfa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account using an authenticator app.</p>
                  </div>
                  {mfaStep === 'intro' && (
                    <button onClick={() => setMfaStep('setup')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-500/20">
                      Enable MFA
                    </button>
                  )}
                  {mfaStep === 'done' && (
                    <span className="flex items-center text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                      <CheckCircle size={14} className="mr-1.5" /> Enabled
                    </span>
                  )}
                </div>
              </div>

              {mfaStep === 'setup' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-48 h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                      <QrCode size={64} className="mb-2" />
                      <span className="text-xs font-medium">Scan QR Code</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Manual Entry Key</h3>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                          <code className="text-sm text-gray-700 font-mono flex-1">JBSWY3DPEHPK3PXP</code>
                          <button className="text-gray-400 hover:text-blue-600 transition-colors"><Copy size={16} /></button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Verification Code</label>
                        <div className="flex space-x-2">
                          <input type="text" maxLength={6} placeholder="000000" className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-center font-mono text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          <button onClick={() => setMfaStep('done')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
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
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                    <CheckCircle className="text-green-600 mt-0.5 mr-3 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-medium text-green-800">MFA is enabled on your account.</p>
                      <p className="text-xs text-green-600 mt-1">You will be asked for a verification code on each login.</p>
                    </div>
                  </div>

                  <div>
                    <button onClick={() => setShowRecoveryCodes(!showRecoveryCodes)} className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      {showRecoveryCodes ? <EyeOff size={14} className="mr-1.5" /> : <Eye size={14} className="mr-1.5" />}
                      {showRecoveryCodes ? 'Hide' : 'Show'} Recovery Codes
                    </button>
                    <AnimatePresence>
                      {showRecoveryCodes && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 grid grid-cols-2 gap-2">
                          {recoveryCodes.map(code => (
                            <div key={code} className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 font-mono text-sm text-gray-700 text-center">{code}</div>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Active Sessions</h2>
                  <p className="text-sm text-gray-500">Devices currently logged into your account.</p>
                </div>
                <button className="flex items-center px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200">
                  <LogOut size={14} className="mr-2" /> Revoke All
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {sessions.map(session => (
                  <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.current ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Smartphone size={18} className={session.current ? 'text-blue-600' : 'text-gray-400'} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 flex items-center">
                          {session.device}
                          {session.current && <span className="ml-2 text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Current</span>}
                        </p>
                        <p className="text-xs text-gray-500">IP: {session.ip} &middot; {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Data Privacy & Compliance</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your personal data in accordance with GDPR regulations.</p>
              </div>

              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Export My Data</p>
                    <p className="text-xs text-gray-500">Download a copy of all data associated with your account (GDPR Art. 20).</p>
                  </div>
                  <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                    <Download size={14} className="mr-2" /> Export
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delete My Account</p>
                    <p className="text-xs text-gray-500">Permanently anonymize your data and deactivate your account (GDPR Art. 17).</p>
                  </div>
                  <button className="flex items-center px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200">
                    <Trash2 size={14} className="mr-2" /> Delete Account
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="text-amber-600 mt-0.5 mr-3 shrink-0" size={18} />
                <p className="text-xs text-amber-800">Account deletion is irreversible. All personal data will be anonymized and cannot be recovered. Active subscriptions will be cancelled.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
