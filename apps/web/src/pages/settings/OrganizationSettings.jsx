import React, { useState, useEffect } from 'react';
import { Building, Globe, Save, Image as ImageIcon, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';

export default function OrganizationSettings() {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  // Load current organization data on mount
  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const response = await apiClient.get('/organization/current');
        const org = response.data;
        setFormData({
          name: org.name || '',
          domain: org.domain || '',
          timezone: org.timezone || 'UTC',
          currency: org.currency || 'USD',
          language: org.language || 'en',
        });
      } catch (err) {
        console.error('Failed to load organization:', err);
        setErrorMessage('Failed to load organization settings.');
        setSaveStatus('error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrg();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setErrorMessage('');

    try {
      await apiClient.put('/organization/current', {
        name: formData.name,
        timezone: formData.timezone,
        currency: formData.currency,
        language: formData.language,
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save settings. Please try again.';
      setErrorMessage(msg);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-64">
        <Loader className="animate-spin text-[#3B82F6]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans text-[#F8FAFC]">
      <div>
        <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Organization Settings</h1>
        <p className="text-[#94A3B8] mt-1 text-sm">Manage your company's profile, branding, and core settings.</p>
      </div>

      {/* Status Banner */}
      {saveStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400"
        >
          <CheckCircle size={16} />
          <span className="text-sm font-semibold">Settings saved successfully.</span>
        </motion.div>
      )}
      {saveStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400"
        >
          <AlertCircle size={16} />
          <span className="text-sm font-semibold">{errorMessage}</span>
        </motion.div>
      )}

      <div className="bg-[#0F172A] rounded-2xl border border-[#1E293B] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#1E293B] bg-[#070B14] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#F8FAFC]">General Profile</h2>
            <p className="text-sm text-[#94A3B8]">This information will be displayed on customer-facing pages.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {isSaving ? (
              <Loader size={16} className="mr-2 animate-spin" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#263247] flex flex-col items-center justify-center text-[#64748B] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors cursor-pointer bg-[#070B14]">
              <ImageIcon size={24} className="mb-2 text-[#3B82F6]" />
              <span className="text-xs font-semibold text-[#94A3B8]">Upload Logo</span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Building size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#070B14] border border-[#263247] rounded-xl text-[#F8FAFC] placeholder-[#64748B] focus:border-[#3B82F6] outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">Primary Domain</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <Globe size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.domain}
                    readOnly
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-[#1E293B] rounded-xl bg-[#070B14]/60 text-[#64748B] cursor-not-allowed text-sm"
                    title="Domain cannot be changed after registration"
                  />
                </div>
                <p className="text-xs text-[#64748B] mt-1">Domain is set during registration and cannot be changed.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#1E293B]">
            <div>
              <label className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-[#263247] rounded-xl bg-[#070B14] text-[#F8FAFC] focus:border-[#3B82F6] outline-none text-sm cursor-pointer"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">EST (Eastern Standard Time)</option>
                <option value="America/Chicago">CST (Central Standard Time)</option>
                <option value="America/Denver">MST (Mountain Standard Time)</option>
                <option value="America/Los_Angeles">PST (Pacific Standard Time)</option>
                <option value="Europe/London">GMT (Greenwich Mean Time)</option>
                <option value="Europe/Paris">CET (Central European Time)</option>
                <option value="Asia/Kolkata">IST (India Standard Time)</option>
                <option value="Asia/Singapore">SGT (Singapore Time)</option>
                <option value="Australia/Sydney">AEST (Australian Eastern Time)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">Default Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-[#263247] rounded-xl bg-[#070B14] text-[#F8FAFC] focus:border-[#3B82F6] outline-none text-sm cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="SGD">SGD (S$)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
