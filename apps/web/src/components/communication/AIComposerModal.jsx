import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { communicationAPI } from '../../api/communication';

export default function AIComposerModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [channel, setChannel] = useState('email');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDraft('');
    const response = await communicationAPI.generateAIDraft(prompt, channel);
    setDraft(response.draft);
    setIsGenerating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-black/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                   <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <span className="text-white font-medium text-lg">AI Copywriter</span>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex gap-4">
                 <select 
                   value={channel} 
                   onChange={(e) => setChannel(e.target.value)}
                   className="bg-black/40 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                 >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                 </select>
                 <input 
                   type="text" 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="e.g. Draft a friendly follow up for Acme Corp mentioning our Q3 discounts..."
                   className="flex-1 bg-black/40 border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                 />
                 <button 
                   onClick={handleGenerate}
                   disabled={!prompt || isGenerating}
                   className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-2"
                 >
                   {isGenerating ? 'Generating...' : 'Draft'}
                 </button>
              </div>

              {/* Editor Area */}
              <div className="relative w-full h-64 bg-black/40 rounded-xl border border-white/5 p-4 mt-2">
                 {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl z-10">
                       <div className="flex gap-1">
                          {[1,2,3].map(i => (
                             <motion.div 
                               key={i}
                               animate={{ y: [0, -10, 0] }} 
                               transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                               className="w-2 h-2 bg-indigo-500 rounded-full"
                             />
                          ))}
                       </div>
                    </div>
                 )}
                 <textarea 
                   className="w-full h-full bg-transparent text-gray-200 text-sm resize-none focus:outline-none"
                   value={draft}
                   onChange={(e) => setDraft(e.target.value)}
                   placeholder="AI generated content will appear here. You can freely edit it before sending."
                 />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-black/30 flex justify-end gap-3">
               <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
               <button 
                  disabled={!draft}
                  className="px-6 py-2 bg-white text-black hover:bg-gray-200 font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                 </svg>
                 Send Message
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
