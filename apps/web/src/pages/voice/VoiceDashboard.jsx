import React, { useState } from 'react';
import CallHistoryTable from '../../components/voice/CallHistoryTable';
import ActiveCallModal from '../../components/voice/ActiveCallModal';
import { voiceAPI } from '../../api/voice';

export default function VoiceDashboard() {
  const [isCalling, setIsCalling] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState('');

  const handleStartCall = async () => {
    setActiveCustomer('Acme Corp');
    await voiceAPI.startCall('1', '+15551234567');
    setIsCalling(true);
  };

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col font-sans overflow-hidden">
      {/* Module Header */}
      <header className="h-14 border-b border-white/10 bg-black/50 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight ml-2">Voice AI</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950 p-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI Call Center</h1>
            <p className="text-gray-400 mt-1 text-sm">Monitor live AI conversations and review call history.</p>
          </div>
          <button 
            onClick={handleStartCall}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Trigger Outbound Call
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">Total AI Calls Today</div>
              <div className="text-3xl font-bold text-white">1,248</div>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">Average Duration</div>
              <div className="text-3xl font-bold text-white">4m 12s</div>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">Meetings Booked</div>
              <div className="text-3xl font-bold text-emerald-400">142</div>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">Total Telephony Cost</div>
              <div className="text-3xl font-bold text-white">$14.20</div>
           </div>
        </div>

        {/* History Table */}
        <CallHistoryTable />

      </main>

      {/* Live Call Modal */}
      <ActiveCallModal 
        isOpen={isCalling} 
        onClose={() => setIsCalling(false)} 
        customerName={activeCustomer}
      />
    </div>
  );
}
