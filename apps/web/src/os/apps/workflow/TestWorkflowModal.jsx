import React, { useState } from 'react';
import { X, Play, Loader2, Clock, Terminal } from 'lucide-react';
import useWorkflowStore from './workflowStore';
import { executeWorkflow, approveProposalStep } from './workflowExecutor';

export const TestWorkflowModal = () => {
  const {
    nodes,
    edges,
    workflowName,
    isTestModalOpen,
    setTestModalOpen,
    setNodeExecutionStatus,
    resetAllNodeStatuses,
    addExecutionRecord,
    updateCurrentExecution,
  } = useWorkflowStore();

  const [callerName, setCallerName] = useState('John Smith');
  const [callerPhone, setCallerPhone] = useState('+15551234567');
  const [transcript, setTranscript] = useState('I want an enterprise proposal for my company.');
  
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [approvalData, setApprovalData] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);

  if (!isTestModalOpen) return null;

  const handleRunTest = async () => {
    setIsRunning(true);
    setExecutionLogs([]);
    setApprovalData(null);
    setExecutionResult(null);
    resetAllNodeStatuses();

    const triggerPayload = {
      type: 'incoming_call',
      callerName,
      callerPhone,
      transcript,
      timestamp: new Date().toISOString(),
    };

    const res = await executeWorkflow(
      { nodes, edges, name: workflowName },
      triggerPayload,
      {
        onNodeStatus: (nodeId, status, extra) => setNodeExecutionStatus(nodeId, status, extra),
        onLog: (log) => setExecutionLogs((prev) => [...prev, log]),
        onPauseForApproval: (approvalInfo) => setApprovalData(approvalInfo),
      }
    );

    setIsRunning(false);
    setExecutionResult(res);
    addExecutionRecord({
      id: res.executionId,
      triggerPayload,
      status: res.status,
      logs: res.logs,
      context: res.context,
      timestamp: new Date().toISOString(),
    });
  };

  const handleApprove = async () => {
    if (!approvalData || !executionResult) return;
    setIsRunning(true);

    const res = await approveProposalStep(
      approvalData.nodeId,
      executionResult.context,
      {
        onNodeStatus: (nodeId, status) => setNodeExecutionStatus(nodeId, status),
        onLog: (log) => setExecutionLogs((prev) => [...prev, log]),
      }
    );

    setIsRunning(false);
    setApprovalData(null);
    setExecutionResult((prev) => ({ ...prev, status: 'success' }));
    updateCurrentExecution({ status: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-ds-surface border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-green-400" />
            <h3 className="text-base font-bold text-white">Test Workflow Engine</h3>
          </div>
          <button
            onClick={() => setTestModalOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Inputs Form */}
          <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Simulated Trigger Event</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Caller Name</label>
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Call Transcript Input</label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleRunTest}
              disabled={isRunning}
              className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              {isRunning ? 'Executing Workflow Graph...' : 'Run Test Execution'}
            </button>
          </div>

          {/* Pending Approval Notice */}
          {approvalData && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-sm font-bold text-yellow-300">Approval Required</div>
                  <div className="text-xs text-gray-300">
                    Send Proposal to <span className="font-mono text-white">{approvalData.recipient}</span> is waiting for human confirmation.
                  </div>
                </div>
              </div>
              <button
                onClick={handleApprove}
                disabled={isRunning}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs rounded-lg transition-all shadow-md"
              >
                Approve & Send Proposal
              </button>
            </div>
          )}

          {/* Execution Trace Terminal */}
          {executionLogs.length > 0 && (
            <div className="bg-black/90 border border-white/10 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-gray-400 font-bold">
                <Terminal className="w-4 h-4 text-blue-400" /> Live Execution Trace Log
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {executionLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-gray-500 text-[10px]">{log.timestamp}</span>
                    <span
                      className={`font-bold ${
                        log.status === 'success'
                          ? 'text-green-400'
                          : log.status === 'running'
                          ? 'text-blue-400'
                          : log.status === 'waiting'
                          ? 'text-yellow-300'
                          : log.status === 'skipped'
                          ? 'text-gray-400'
                          : 'text-red-400'
                      }`}
                    >
                      [{log.node}]
                    </span>
                    <span className="text-gray-200">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>Uses real Workflow Execution Engine (`executeWorkflow`).</span>
          <button
            onClick={() => setTestModalOpen(false)}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
