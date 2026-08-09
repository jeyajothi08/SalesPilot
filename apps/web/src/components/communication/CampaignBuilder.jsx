import React, { useState } from 'react';
import AIComposerModal from './AIComposerModal';

export default function CampaignBuilder() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-6">
       <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">New Campaign</h2>
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Target Audience</label>
                <select className="w-full bg-black/50 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                   <option>All Active Leads (8,241 contacts)</option>
                   <option>Churn Risks (142 contacts)</option>
                   <option>Enterprise Opportunities (45 contacts)</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Communication Channel</label>
                <div className="flex gap-4">
                   <label className="flex items-center gap-2 text-white bg-white/5 border border-white/10 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="radio" name="channel" value="email" defaultChecked className="accent-indigo-500" />
                      Email Blast
                   </label>
                   <label className="flex items-center gap-2 text-white bg-white/5 border border-white/10 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="radio" name="channel" value="whatsapp" className="accent-indigo-500" />
                      WhatsApp Broadcast
                   </label>
                </div>
             </div>
             
             <div className="pt-4">
                <button 
                   onClick={() => setIsAIModalOpen(true)}
                   className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2"
                >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                   Draft with AI Copywriter
                </button>
             </div>
          </div>
       </div>

       <AIComposerModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
}
