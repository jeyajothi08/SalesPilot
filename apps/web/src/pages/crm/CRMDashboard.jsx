import React, { useState } from 'react';
import PipelinePage from './PipelinePage';
import CustomersPage from './CustomersPage';
import { motion, AnimatePresence } from 'framer-motion';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col font-sans">
      {/* Module Header / Tabs */}
      <header className="h-14 border-b border-white/10 bg-black/50 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight ml-2">CRM Engine</span>
        </div>

        <nav className="flex space-x-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'pipeline' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'customers' ? 'bg-white/10 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Customers
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full absolute inset-0"
          >
            {activeTab === 'pipeline' ? <PipelinePage /> : <CustomersPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
