import React from 'react';
import { Play, Download, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const mockCalls = [
  { id: 1, date: 'Today, 2:30 PM', duration: '04:12', sentiment: 'Positive', score: 98, outcome: 'Meeting Booked' },
  { id: 2, date: 'Yesterday, 11:15 AM', duration: '01:45', sentiment: 'Neutral', score: 65, outcome: 'Voicemail' },
  { id: 3, date: 'Oct 24, 2026, 09:00 AM', duration: '08:30', sentiment: 'Positive', score: 92, outcome: 'Hot Lead' },
];

const CallHistory = () => {
  return (
    <div className="glass-card bg-bg-primary p-6 md:p-8 rounded-3xl border border-border">
      <h3 className="text-lg font-bold text-text-main mb-6">Call History</h3>
      
      <div className="space-y-4">
        {mockCalls.map((call) => (
          <div key={call.id} className="p-4 md:p-5 rounded-2xl bg-bg-secondary border border-border hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
               <div>
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-medium text-text-main">{call.date}</p>
               </div>
               <div>
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-sm font-medium text-text-main">{call.duration}</p>
               </div>
               <div>
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">AI Score</p>
                  <div className="flex items-center text-sm font-bold text-text-main">
                    <Activity className={`w-3.5 h-3.5 mr-1 ${call.score > 80 ? 'text-green-500' : 'text-yellow-500'}`} />
                    {call.score}%
                  </div>
               </div>
               <div>
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">Outcome</p>
                  <div className="flex items-center text-sm font-medium text-text-main">
                    {call.outcome === 'Meeting Booked' ? <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-500" /> : <AlertTriangle className="w-3.5 h-3.5 mr-1 text-orange-500" />}
                    {call.outcome}
                  </div>
               </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 md:pt-0 border-t md:border-t-0 border-border">
               <button className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-bg-primary border border-border rounded-xl text-sm font-medium hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center">
                 <Play className="w-4 h-4 mr-2" /> Replay
               </button>
               <button className="p-2 bg-white dark:bg-bg-primary border border-border rounded-xl text-text-muted hover:text-text-main transition-colors flex items-center justify-center">
                 <Download className="w-4 h-4" />
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CallHistory;
