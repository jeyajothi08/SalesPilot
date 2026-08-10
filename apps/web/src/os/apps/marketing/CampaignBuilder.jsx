import React, { useState } from 'react';
import { ArrowLeft, Save, Play, CheckCircle2, ChevronRight, Mail, MessageSquare, Globe, Clock, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CampaignBuilder({ onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    channel: 'email',
    audience: 'all',
    content: '',
    schedule: 'now'
  });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
      onBack();
    }, 2000);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { id: 1, title: 'Basics' },
    { id: 2, title: 'Audience' },
    { id: 3, title: 'Content' },
    { id: 4, title: 'Review' }
  ];

  return (
    <div className="h-full bg-black text-white p-6 md:p-8 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-light text-white tracking-tight">Campaign Builder</h1>
            <p className="text-gray-400 text-sm mt-1">Create and launch omnichannel campaigns</p>
          </div>
        </div>
        <div className="flex space-x-3 relative">
          {toastMessage && (
            <div className="absolute top-12 right-0 px-4 py-2 bg-green-500/90 text-white text-sm font-medium rounded-xl shadow-lg z-50 whitespace-nowrap">
              {toastMessage}
            </div>
          )}
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center text-sm">
            <Save size={16} className="mr-2" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s.id ? 'bg-blue-600 text-white' : 'bg-black border-2 border-white/20 text-gray-500'
                }`}
              >
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <span className={`absolute top-10 text-xs whitespace-nowrap ${
                step >= s.id ? 'text-white font-medium' : 'text-gray-500'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 max-w-3xl w-full mx-auto relative mt-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Campaign Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Q3 Product Launch"
                  className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-4">Select Channel</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'email', name: 'Email', icon: Mail, desc: 'Send bulk emails' },
                    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, desc: 'Direct messaging' },
                    { id: 'social', name: 'Social Media', icon: Globe, desc: 'Auto-post across platforms' }
                  ].map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => setFormData({...formData, channel: channel.id})}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.channel === channel.id 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                        formData.channel === channel.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'
                      }`}>
                        <channel.icon size={20} />
                      </div>
                      <h3 className="font-medium text-white mb-1">{channel.name}</h3>
                      <p className="text-xs text-gray-500">{channel.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-4">Select Target Audience</label>
                <div className="space-y-3">
                  {[
                    { id: 'all', name: 'All Active Customers', count: '1,240' },
                    { id: 'leads', name: 'Unconverted Leads', count: '850' },
                    { id: 'inactive', name: 'Inactive (>30 days)', count: '420' },
                  ].map(aud => (
                    <button
                      key={aud.id}
                      onClick={() => setFormData({...formData, audience: aud.id})}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                        formData.audience === aud.id 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center">
                        <Users size={18} className={`mr-3 ${formData.audience === aud.id ? 'text-blue-400' : 'text-gray-400'}`} />
                        <span className="font-medium text-white">{aud.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{aud.count} recipients</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 h-full flex flex-col"
            >
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-400">Campaign Content</label>
                  <button className="text-xs text-blue-400 flex items-center hover:text-blue-300">
                    <Sparkles size={12} className="mr-1" /> Use AI Editor
                  </button>
                </div>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your campaign content here..."
                  className="w-full bg-black border border-white/10 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-blue-500 h-64 resize-none leading-relaxed"
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-6">Review & Launch</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-gray-400">Campaign Name</span>
                    <span className="font-medium text-white">{formData.name || 'Untitled Campaign'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-gray-400">Channel</span>
                    <span className="font-medium text-white capitalize">{formData.channel}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-gray-400">Audience</span>
                    <span className="font-medium text-white capitalize">{formData.audience}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-400 mb-4">Sending Schedule</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setFormData({...formData, schedule: 'now'})}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.schedule === 'now' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <Play size={20} className={`mx-auto mb-2 ${formData.schedule === 'now' ? 'text-blue-400' : 'text-gray-400'}`} />
                      <span className="block font-medium text-white text-sm">Send Now</span>
                    </button>
                    <button
                      onClick={() => setFormData({...formData, schedule: 'later'})}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        formData.schedule === 'later' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <Clock size={20} className={`mx-auto mb-2 ${formData.schedule === 'later' ? 'text-blue-400' : 'text-gray-400'}`} />
                      <span className="block font-medium text-white text-sm">Schedule Later</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="max-w-3xl w-full mx-auto mt-8 pt-6 border-t border-white/10 flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="px-6 py-2 bg-transparent text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          Back
        </button>
        {step < 4 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Next Step <ChevronRight size={16} className="ml-1" />
          </button>
        ) : (
          <button
            onClick={() => {
              showToast('Campaign launched via AI Engine!');
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            Launch Campaign <Play size={16} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
