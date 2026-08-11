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

  // FIXED: was a no-op setTimeout — now calls real API
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
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-500 mt-1">Manage your company's profile, branding, and core settings.</p>
      </div>

      {/* Status Banner */}
      {saveStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
        >
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Settings saved successfully.</span>
        </motion.div>
      )}
      {saveStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <AlertCircle size={16} />
          <span className="text-sm font-medium">{errorMessage}</span>
        </motion.div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">General Profile</h2>
            <p className="text-sm text-gray-500">This information will be displayed on customer-facing pages.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
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
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer bg-gray-50">
              <ImageIcon size={24} className="mb-2" />
              <span className="text-xs font-medium">Upload Logo</span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Building size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Domain</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Globe size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.domain}
                    readOnly
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    title="Domain cannot be changed after registration"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Domain is set during registration and cannot be changed.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
