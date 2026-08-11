import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, ArrowRight, Mail, User, Building, MessageSquare, 
  AlertCircle, CheckCircle2, Mic, Play, Pause, Sparkles, 
  TrendingUp, Layers, CheckCircle, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { demoAPI } from '../api/demo';
import heroAsset from '../assets/hero.png';

const DemoPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    useCase: 'Outbound AI Voice SDR',
    message: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Right-side interactive preview state
  const [activePreviewTab, setActivePreviewTab] = useState('voice');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid work email address';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      setError('Please fix the errors in the form before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await demoAPI.requestDemo(formData);
      setSuccessData(response);
    } catch (err) {
      console.error('[DemoPage] Demo request error:', err);
      setError(err.message || 'Failed to submit demo request. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen flex bg-[#030712] font-sans items-center justify-center p-6 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full bg-[#0A0A0C] p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
            Demo Request Received!
          </h2>

          <p className="text-gray-300 text-base leading-relaxed mb-6">
            Thank you, <span className="font-semibold text-white">{formData.fullName}</span>! Our enterprise sales team will review your requirements for <span className="text-blue-400 font-medium">{formData.companyName}</span> and contact you shortly at <span className="text-blue-400 font-medium">{formData.email}</span>.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left space-y-2 text-xs text-gray-300">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Request Reference:</span>
              <span className="font-mono text-emerald-400 font-semibold">{successData.demo_request_id?.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-400">Database Status:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Logged in Lead Store
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">External CRM Sync:</span>
              <span className="text-amber-400 font-medium">
                {successData.external_crm_connected ? 'Connected' : 'Pending Integration'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="w-full">
              <button className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030712] font-sans text-white">
      
      {/* Left Area - High Contrast Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto">
          
          <Link to="/" className="inline-flex items-center space-x-2.5 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">SalesPilot<span className="text-blue-400">.ai</span></span>
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Book a Live Demo
            </h1>
            <p className="text-gray-300 text-base font-normal">
              Experience how SalesPilot AI automates outbound sales calls, qualifies prospects, and closes pipeline 24/7.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-200"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm font-medium leading-relaxed">{error}</div>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-100 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-4 py-3 bg-[#0D111D] border ${
                    fieldErrors.fullName ? 'border-red-500/80 focus:ring-red-500' : 'border-white/15 focus:border-blue-500 focus:ring-blue-500'
                  } rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all shadow-inner`}
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
              {fieldErrors.fullName && (
                <p className="mt-1 text-xs text-red-400 font-medium">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Work Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-100 mb-1.5">
                Work Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-4 py-3 bg-[#0D111D] border ${
                    fieldErrors.email ? 'border-red-500/80 focus:ring-red-500' : 'border-white/15 focus:border-blue-500 focus:ring-blue-500'
                  } rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all shadow-inner`}
                  placeholder="sarah@acme.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold text-gray-100 mb-1.5">
                Company Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building className="h-5 w-5" />
                </div>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-4 py-3 bg-[#0D111D] border ${
                    fieldErrors.companyName ? 'border-red-500/80 focus:ring-red-500' : 'border-white/15 focus:border-blue-500 focus:ring-blue-500'
                  } rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all shadow-inner`}
                  placeholder="Acme Technologies Inc."
                />
              </div>
              {fieldErrors.companyName && (
                <p className="mt-1 text-xs text-red-400 font-medium">{fieldErrors.companyName}</p>
              )}
            </div>

            {/* Primary Use Case */}
            <div>
              <label htmlFor="useCase" className="block text-sm font-semibold text-gray-100 mb-1.5">
                Primary Goal / Use Case
              </label>
              <div className="relative">
                <select
                  id="useCase"
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-[#0D111D] border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner appearance-none cursor-pointer"
                >
                  <option value="Outbound AI Voice SDR">Outbound AI Voice SDR Calls</option>
                  <option value="Inbound Lead Qualification">Inbound Lead Qualification & Booking</option>
                  <option value="Multi-Channel Sales Automation">Multi-Channel Sales Automation (Voice, Email, WhatsApp)</option>
                  <option value="Autonomous CRM Sync">Autonomous CRM Pipeline Sync</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Message / Requirements */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-100 mb-1.5">
                Message / Custom Requirements <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-gray-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-3 bg-[#0D111D] border border-white/15 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none shadow-inner"
                  placeholder="Tell us about your sales team size, lead volume, or specific integrations needed..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center space-x-2 py-4 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-base rounded-xl transition-all shadow-xl shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed border border-blue-400/30"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting Request...</span>
                  </span>
                ) : (
                  <>
                    <span>Request Personalized Demo</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                SOC2 Compliant & Secure
              </span>
              <span>•</span>
              <span>No Credit Card Required</span>
            </div>

          </form>
        </div>
      </div>

      {/* Right Area - Polished Interactive Demo Showcase */}
      <div className="lg:flex-1 relative bg-[#080B14] overflow-hidden p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l border-white/10">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-xl">
          
          {/* Header Card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Live Interactive Demo Preview
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              See SalesPilot in Action
            </h2>
            <p className="text-gray-300 text-sm font-normal">
              Autonomous sales engine operating in real-time. Select a preview module below.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#0D111E] border border-white/10 rounded-2xl p-1.5 mb-6 text-xs sm:text-sm font-semibold">
            {[
              { id: 'voice', label: 'Voice SDR', icon: Mic },
              { id: 'scoring', label: 'AI Lead Scoring', icon: TrendingUp },
              { id: 'crm', label: 'CRM & Pipeline', icon: Layers }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activePreviewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Card Body */}
          <div className="bg-[#0C101C]/90 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            
            {activePreviewTab === 'voice' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Mic className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Multi-Lingual Voice SDR</h4>
                      <p className="text-xs text-gray-400">English, Hindi, Tamil, Telugu, Tanglish</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Audio Engine
                  </span>
                </div>

                {/* Animated Waveform */}
                <div className="bg-[#070A12] border border-white/10 rounded-2xl p-6 mb-6 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 mb-4 h-12">
                    {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 35, 65, 85, 40, 75].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: isPlayingAudio ? [12, (h / 100) * 44 + 8, 12] : 12 }}
                        transition={{ repeat: Infinity, duration: 0.5 + (i % 5) * 0.1 }}
                        className="w-1.5 bg-linear-to-t from-blue-600 to-indigo-400 rounded-full"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 text-blue-400" /> : <Play className="w-4 h-4 text-blue-400 fill-blue-400" />}
                    <span>{isPlayingAudio ? 'Pause Voice SDR Sample' : 'Listen to Voice SDR Call Sample'}</span>
                  </button>
                </div>

                {/* Live Transcript Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono font-bold rounded">AI SDR:</span>
                    <p className="text-gray-300 font-normal">"Hello Sarah! I noticed Acme Corp is expanding outbound sales. Are you looking to automate your lead discovery?"</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 font-mono font-bold rounded">Prospect:</span>
                    <p className="text-gray-300 font-normal">"Yes, exactly! We need a solution that can handle high volume calls without hiring 10 reps."</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activePreviewTab === 'scoring' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">AI Lead Scoring & Intent</h4>
                      <p className="text-xs text-gray-400">Predictive Closing Probability</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-xs font-bold text-purple-300">
                    98% High Intent
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Buying Authority Identified', score: '100%', color: 'bg-emerald-500' },
                    { label: 'Budget Fit ($50k - $100k)', score: '95%', color: 'bg-blue-500' },
                    { label: 'Urgency & Timeline (< 30 Days)', score: '92%', color: 'bg-indigo-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                      <div className="flex justify-between items-center text-xs font-medium mb-2">
                        <span className="text-gray-200">{item.label}</span>
                        <span className="text-white font-bold">{item.score}</span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: item.score }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activePreviewTab === 'crm' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Autonomous CRM Pipeline</h4>
                      <p className="text-xs text-gray-400">Salesforce, HubSpot & Pipedrive</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 font-mono">
                    Auto-Synced
                  </span>
                </div>

                <div className="bg-[#070A12] border border-white/10 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
                        Acme
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Enterprise Tier Deal</p>
                        <p className="text-[11px] text-gray-400">$64,000 • Proposal Stage</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Meeting Booked</span>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl text-gray-300 space-y-1">
                    <div className="flex items-center gap-2 font-medium text-white">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Calendar Invite Dispatched</span>
                    </div>
                    <p className="text-[11px] text-gray-400 pl-6">
                      AI SDR automatically scheduled a 30-min demo call with Enterprise Account Executive.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Bottom Illustration Asset Showcase */}
          <div className="mt-6 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <img src={heroAsset} alt="SalesPilot Asset" className="w-12 h-12 object-contain" />
            <div className="text-xs">
              <h5 className="font-bold text-white">Powered by SalesPilot AI Engine</h5>
              <p className="text-gray-400">Enterprise AI sales automation for modern revenue teams.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default DemoPage;
