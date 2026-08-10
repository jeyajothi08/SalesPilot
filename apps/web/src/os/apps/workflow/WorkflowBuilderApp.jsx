import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useWorkflowStore from './workflowStore';
import { TriggerNode, ActionNode, AIAgentNode } from './nodes/Nodes';
import { AnimatedDataEdge } from './edges/AnimatedDataEdge';
import { NodeLibrary } from './NodeLibrary';
import { Sparkles, Play, Loader2, Check, AlertCircle, X } from 'lucide-react';
import apiClient from '../../../api/apiClient';

// Register our custom nodes and edges
const nodeTypes = {
  triggerNode:  TriggerNode,
  actionNode:   ActionNode,
  aiAgentNode:  AIAgentNode,
};

const edgeTypes = {
  animatedEdge: AnimatedDataEdge,
};

// ── Deploy status badge ──────────────────────────────────────────────────────
const DeployBadge = ({ status }) => {
  if (!status) return null;
  if (status === 'deploying') {
    return (
      <span className="flex items-center gap-1.5 text-blue-300 text-xs font-medium animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deploying…
      </span>
    );
  }
  if (status === 'success') {
    return (
      <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
        <Check className="w-3.5 h-3.5" /> Deployed
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
        <AlertCircle className="w-3.5 h-3.5" /> Deploy failed
      </span>
    );
  }
  return null;
};

// ── Copilot panel (inline, no external dependency) ──────────────────────────
const WorkflowCopilotPanel = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I can help you build and optimise this workflow. Ask me anything.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await apiClient.post('/ai/chat', {
        message: msg,
        conversation_id: 'workflow-copilot-session',
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message.content }]);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const text = typeof detail === 'string' ? detail : err.message || 'Failed to reach AI.';
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${text}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  return (
    <div className="absolute right-6 top-16 z-50 w-80 flex flex-col bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      style={{ maxHeight: '60vh' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <span className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" /> Workflow Copilot
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm rounded-xl px-3 py-2 leading-relaxed ${
            m.role === 'user'
              ? 'bg-blue-600 text-white self-end ml-8'
              : 'bg-white/10 text-gray-200 mr-8'
          }`}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex gap-1 p-3 bg-white/10 rounded-xl mr-8">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="p-3 border-t border-white/10 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about this workflow…"
          disabled={loading}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

// ── Main canvas ──────────────────────────────────────────────────────────────
const WorkflowCanvas = ({ onClose }) => {
  const reactFlowWrapper = useRef(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useWorkflowStore();
  const [showCopilot, setShowCopilot] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null); // null | 'deploying' | 'success' | 'error'
  const [toastMessage, setToastMessage] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Deploy handler ────────────────────────────────────────────────────────
  const handleDeploy = async () => {
    if (deployStatus === 'deploying') return;
    if (nodes.length === 0) {
      showToast('Add at least one node to the canvas before deploying.');
      return;
    }
    setDeployStatus('deploying');
    try {
      // POST to /api/v1/workflows/deploy if it exists, otherwise simulate success
      // (backend endpoint may not be implemented — will 404, we catch gracefully)
      await apiClient.post('/workflows/deploy', {
        name: 'My Workflow',
        nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.data?.label })),
        edges: edges.map(e => ({ source: e.source, target: e.target })),
      });
      setDeployStatus('success');
      showToast('Workflow deployed successfully.');
    } catch (err) {
      console.error('Deploy failed:', err);
      setDeployStatus('error');
      showToast(err.message === 'Network Error' ? 'Deployment Backend Not Connected' : 'Failed to deploy workflow');
    }
    // Reset badge after 4 s
    setTimeout(() => setDeployStatus(null), 4000);
  };

  // ── Drag & drop from NodeLibrary ──────────────────────────────────────────
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type  = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');
      const icon  = event.dataTransfer.getData('application/icon');
      if (!type) return;

      // Use React Flow's screenToFlowPosition for accurate placement
      // regardless of canvas pan/zoom state
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode({ id: `node_${Date.now()}`, type, position, data: { label, icon } });
    },
    [addNode, screenToFlowPosition]
  );

  return (
    <div className="w-full h-full flex relative" ref={reactFlowWrapper}>

      {/* Sidebar Library */}
      <NodeLibrary />

      {/* Main Infinite Canvas */}
      <div className="flex-1 h-full relative" style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          deleteKeyCode="Delete"
          className="bg-ds-background"
          defaultEdgeOptions={{ type: 'animatedEdge', animated: true }}
        >
          {/* Dark mode glowing grid */}
          <Background color="rgba(255,255,255,0.05)" gap={24} size={2} />

          <Controls
            className="bg-ds-surface/80 backdrop-blur-md border border-white/10 rounded-xl fill-white overflow-hidden shadow-xl"
            showInteractive={true}
          />

          <MiniMap
            className="bg-ds-surface/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl bottom-4! right-4!"
            maskColor="rgba(0,0,0,0.7)"
            nodeColor="rgba(59,130,246,0.5)"
          />
        </ReactFlow>

        {/* Floating Top Controls */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
          {toastMessage && (
            <div className="px-4 py-2 bg-red-500/90 text-white text-sm font-medium rounded-xl shadow-lg animate-in fade-in slide-in-from-top-4">
              {toastMessage}
            </div>
          )}
          <DeployBadge status={deployStatus} />

          <button
            onClick={() => setShowCopilot(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
              showCopilot
                ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300'
                : 'bg-ds-surface/80 backdrop-blur-md border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            AI Copilot
          </button>

          <button
            onClick={handleDeploy}
            disabled={deployStatus === 'deploying'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
          >
            {deployStatus === 'deploying'
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Play className="w-4 h-4" />
            }
            {deployStatus === 'deploying' ? 'Deploying…' : 'Deploy Workflow'}
          </button>
        </div>

        {/* Inline Copilot Panel */}
        {showCopilot && <WorkflowCopilotPanel onClose={() => setShowCopilot(false)} />}
      </div>
    </div>
  );
};

// ── Exported component ────────────────────────────────────────────────────────
export const WorkflowBuilderApp = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-100 bg-ds-background font-sans">
      <ReactFlowProvider>
        <WorkflowCanvas onClose={onClose} />
      </ReactFlowProvider>
    </div>
  );
};

export default WorkflowBuilderApp;
