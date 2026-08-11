import React from 'react';
import { X, History, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import useWorkflowStore from './workflowStore';

export const ExecutionHistoryModal = () => {
  const { executionHistory, isHistoryModalOpen, setHistoryModalOpen } = useWorkflowStore();

  if (!isHistoryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-ds-surface border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Execution History</h3>
          </div>
          <button
            onClick={() => setHistoryModalOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {executionHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No execution history recorded yet.</p>
              <p className="text-xs text-gray-500 mt-1">Run a test workflow to populate execution logs.</p>
            </div>
          ) : (
            executionHistory.map((exec, idx) => (
              <div key={exec.id || idx} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">ID: {exec.id}</span>
                    <span className="text-xs text-gray-400">• {new Date(exec.timestamp).toLocaleString()}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      exec.status === 'success'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : exec.status === 'waiting'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {exec.status}
                  </span>
                </div>

                {/* Trigger Payload */}
                <div className="text-xs text-gray-300">
                  <span className="font-bold text-white">Trigger Payload: </span>
                  {exec.triggerPayload?.callerName} ({exec.triggerPayload?.callerPhone}) — "{exec.triggerPayload?.transcript}"
                </div>

                {/* Steps log */}
                {exec.logs && exec.logs.length > 0 && (
                  <div className="bg-black/60 rounded-lg p-3 space-y-1 font-mono text-[11px]">
                    {exec.logs.map((l, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="text-gray-500">{l.timestamp}</span>
                        <span className="text-blue-400 font-bold">[{l.node}]</span>
                        <span>{l.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-end">
          <button
            onClick={() => setHistoryModalOpen(false)}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
