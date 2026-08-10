import React from 'react';
import KanbanBoard from '../../components/crm/KanbanBoard';

export default function PipelinePage() {
  return (
    <div className="h-full flex flex-col p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sales Pipeline</h1>
          <p className="text-gray-400 mt-1 text-sm">Drag and drop deals across stages. AI calculates win probabilities automatically.</p>
        </div>
        <button disabled className="px-4 py-2 bg-emerald-600/50 text-white/50 text-sm font-medium rounded-lg shadow-lg shadow-emerald-500/10 cursor-not-allowed">
          + New Deal (Backend Not Connected)
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
