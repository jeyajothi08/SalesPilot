import React, { useState } from 'react';
import KanbanBoard from '../../components/crm/KanbanBoard';
import { useCRM } from '../../context/CRMContext';

export default function PipelinePage() {
  const { addDeal } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!title || !value) return;

    addDeal({
      title,
      company: company || 'Enterprise Client',
      value: Number(value),
      stage: 'lead_in',
      probability: 30,
      nextAction: 'Schedule Discovery Call',
    });

    setTitle('');
    setCompany('');
    setValue('');
    setShowModal(false);
  };

  return (
    <div className="h-full flex flex-col p-5 space-y-3 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sales Pipeline</h1>
          <p className="text-gray-400 mt-0.5 text-xs">Drag and drop deals across stages. Copilot analyzes live win probabilities automatically.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-500/25 transition-colors cursor-pointer border-none"
        >
          + New Deal
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-200 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Create New Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apex Enterprise Expansion"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Corp"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Deal Value ($)</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="50000"
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
