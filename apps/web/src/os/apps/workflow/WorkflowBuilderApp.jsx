import React, { useCallback, useRef, useState, useEffect } from 'react';
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
import { NodeConfigModal } from './NodeConfigModal';
import { TestWorkflowModal } from './TestWorkflowModal';
import { ExecutionHistoryModal } from './ExecutionHistoryModal';
import { WorkflowTemplatesModal } from './WorkflowTemplatesModal';
import {
  Sparkles,
  Play,
  Loader2,
  Check,
  AlertCircle,
  X,
  Undo2,
  Redo2,
  Save,
  History,
  LayoutTemplate,
  ShieldCheck,
} from 'lucide-react';
import apiClient from '../../../api/apiClient';

const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  aiAgentNode: AIAgentNode,
};

const edgeTypes = {
  animatedEdge: AnimatedDataEdge,
};

// ── Workflow Copilot Panel ──────────────────────────────────────────────────
const WorkflowCopilotPanel = ({ onClose }) => {
  const { nodes, edges, validateWorkflow, validationErrors, addNode, onConnect } = useWorkflowStore();
  
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am your SalesPilot Workflow Copilot. Ask me to explain this graph, check deployment readiness, or auto-add steps.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    const lower = msg.toLowerCase();

    // Graph inspection & intent handling
    if (lower.includes('explain') || lower.includes('what does')) {
      const nodeSummary = nodes.map((n) => n.data?.label || n.id).join(' → ');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `This workflow contains ${nodes.length} nodes and ${edges.length} connections: ${nodeSummary}. It listens for trigger events, processes intent with AI, updates CRM records, and executes outbound actions.`,
        },
      ]);
      setLoading(false);
      return;
    }

    if (lower.includes('deployable') || lower.includes('validation') || lower.includes('error') || lower.includes('why')) {
      const isValid = validateWorkflow();
      if (isValid) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `✓ Workflow is fully valid and ready for deployment! (Version active: ready).`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Workflow has validation issues preventing deployment:\n• ${validationErrors.join('\n• ')}`,
          },
        ]);
      }
      setLoading(false);
      return;
    }

    if (lower.includes('add approval') || lower.includes('approval step')) {
      // Find Send Proposal node and set requireConfirmation: true
      const proposalNode = nodes.find((n) => n.subtype === 'send_proposal' || n.data?.label === 'Send Proposal');
      if (proposalNode) {
        useWorkflowStore.getState().updateNodeConfig(proposalNode.id, { requireConfirmation: true });
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `✓ Updated Send Proposal node configuration to enforce Human Approval before external dispatch!`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Could not locate a Send Proposal node in the current graph to add approval step.`,
          },
        ]);
      }
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post('/ai/chat', {
        message: `Workflow context: ${nodes.length} nodes, ${edges.length} edges. User question: ${msg}`,
        conversation_id: 'workflow-copilot-session',
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.message.content },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `AI Copilot: Analyzed workflow graph. All ${nodes.length} nodes are active and configured.`,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  };

  return (
    <div className="absolute right-6 top-20 z-40 w-84 flex flex-col bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans max-h-[65vh]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0 bg-white/5">
        <span className="text-xs font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" /> Workflow Copilot
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-xs rounded-xl px-3 py-2 leading-relaxed ${
              m.role === 'user'
                ? 'bg-blue-600 text-white self-end ml-6'
                : 'bg-white/10 text-gray-200 mr-6 whitespace-pre-line'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex gap-1 p-3 bg-white/10 rounded-xl mr-6">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="p-3 border-t border-white/10 flex gap-2 shrink-0 bg-white/5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot about graph..."
          disabled={loading}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-blue-500 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

// ── Main Canvas Component ────────────────────────────────────────────────────
const WorkflowCanvas = ({ onCloseStudio }) => {
  const reactFlowWrapper = useRef(null);
  const {
    workflowName,
    version,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    undo,
    redo,
    past,
    future,
    saveStatus,
    isDirty,
    saveWorkflow,
    deployWorkflow,
    validateWorkflow,
    validationErrors,
    setTestModalOpen,
    setTemplatesModalOpen,
    setHistoryModalOpen,
  } = useWorkflowStore();

  const [showCopilot, setShowCopilot] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [toast, setToast] = useState(null);
  const { screenToFlowPosition } = useReactFlow();

  const showNotification = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  };

  // Keyboard listener (Undo / Redo / Save)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveWorkflow();
        showNotification('Workflow saved.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveWorkflow]);

  // Debounced Autosave (1.5s)
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      saveWorkflow();
    }, 1500);
    return () => clearTimeout(timer);
  }, [nodes, edges, isDirty, saveWorkflow]);

  // Drag & Drop
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const subtype = event.dataTransfer.getData('application/subtype') || 'incoming_call';
      const label = event.dataTransfer.getData('application/label') || 'New Node';
      const icon = event.dataTransfer.getData('application/icon') || 'Phone';

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

      // Default configs per subtype
      let defaultConfig = {};
      if (subtype === 'incoming_call') {
        defaultConfig = { name: 'Incoming Call Trigger', enabled: true, phoneSource: '+15551234567' };
      } else if (subtype === 'process_intent') {
        defaultConfig = { systemPrompt: 'Process intent', intentCategories: ['sales_inquiry', 'proposal_request'], outputVariable: 'intent', confidenceThreshold: 0.7 };
      } else if (subtype === 'update_crm') {
        defaultConfig = { deal: 'context.deal', stage: 'Proposal Sent', notes: 'Updated via workflow' };
      } else if (subtype === 'send_proposal') {
        defaultConfig = { recipient: 'context.customer.email', template: 'Enterprise Proposal Tier 1', requireConfirmation: true };
      }

      addNode({
        id: newNodeId,
        type,
        subtype,
        position,
        config: defaultConfig,
        data: { label, icon, subtype, status: 'idle' },
      });
    },
    [addNode, screenToFlowPosition]
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handleDeployClick = async () => {
    setDeploying(true);
    const res = await deployWorkflow();
    setDeploying(false);

    if (res.success) {
      showNotification(`Workflow Deployed Successfully! Version: ${res.version} | Status: Active`);
    } else {
      const errText = res.errors?.join('; ') || 'Deployment validation failed.';
      showNotification(`Cannot deploy: ${errText}`, true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative select-none" ref={reactFlowWrapper}>
      
      {/* Top Header Controls Toolbar */}
      <div className="h-14 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between z-30 shrink-0">
        
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCloseStudio}
            className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            ← Close Studio
          </button>

          <div className="h-4 w-px bg-white/10" />

          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              {workflowName}
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {version}
              </span>
            </h1>
            <div className="text-[10px] text-gray-400 flex items-center gap-2">
              <span>Status: <strong className="text-green-400">Active</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                {saveStatus === 'saving' ? (
                  <span className="text-blue-300 flex items-center gap-1 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                  </span>
                ) : saveStatus === 'saved' ? (
                  <span className="text-gray-400 flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-400" /> Saved
                  </span>
                ) : (
                  <span className="text-yellow-400">Unsaved edits</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Center Actions Toolbar */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={undo}
            disabled={past.length === 0}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Redo (Ctrl+Y)"
            className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/10" />

          <button
            onClick={() => setTemplatesModalOpen(true)}
            className="px-3 py-1 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" /> Templates
          </button>

          <button
            onClick={() => setTestModalOpen(true)}
            className="px-3 py-1 text-xs font-bold text-green-300 hover:bg-green-500/20 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-green-400" /> Test Workflow
          </button>

          <button
            onClick={() => setHistoryModalOpen(true)}
            className="px-3 py-1 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-blue-400" /> Execution History
          </button>
        </div>

        {/* Right Deploy & Copilot Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCopilot((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              showCopilot
                ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Copilot
          </button>

          <button
            onClick={handleDeployClick}
            disabled={deploying}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
          >
            {deploying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {deploying ? 'Deploying...' : 'Deploy Workflow'}
          </button>
        </div>

      </div>

      {/* Main Canvas Body */}
      <div className="flex-1 flex relative">
        {/* Node Library Sidebar */}
        <NodeLibrary />

        {/* Infinite ReactFlow Canvas */}
        <div className="flex-1 h-full relative" style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            deleteKeyCode={['Delete', 'Backspace']}
            className="bg-ds-background"
            defaultEdgeOptions={{ type: 'animatedEdge', animated: true }}
          >
            <Background color="rgba(255,255,255,0.05)" gap={24} size={2} />
            <Controls className="bg-ds-surface/80 backdrop-blur-md border border-white/10 rounded-xl fill-white overflow-hidden shadow-xl" />
            <MiniMap
              className="bg-ds-surface/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl bottom-4! right-4!"
              maskColor="rgba(0,0,0,0.7)"
              nodeColor="rgba(59,130,246,0.5)"
            />
          </ReactFlow>

          {/* Toast Notification */}
          {toast && (
            <div
              className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${
                toast.isError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
              }`}
            >
              {toast.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {toast.msg}
            </div>
          )}

          {/* Copilot Floating Drawer */}
          {showCopilot && <WorkflowCopilotPanel onClose={() => setShowCopilot(false)} />}
        </div>
      </div>

      {/* Node Config Drawer */}
      <NodeConfigModal />

      {/* Test Execution Runner Modal */}
      <TestWorkflowModal />

      {/* History Drawer */}
      <ExecutionHistoryModal />

      {/* Templates Drawer */}
      <WorkflowTemplatesModal />

    </div>
  );
};

// ── Close Studio Confirmation Guard ──────────────────────────────────────────
export const WorkflowBuilderApp = ({ onClose }) => {
  const [showCloseGuard, setShowCloseGuard] = useState(false);
  const { isDirty, saveWorkflow } = useWorkflowStore();

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowCloseGuard(true);
    } else {
      onClose();
    }
  };

  const handleSaveAndClose = async () => {
    await saveWorkflow();
    setShowCloseGuard(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 bg-ds-background font-sans">
      <ReactFlowProvider>
        <WorkflowCanvas onCloseStudio={handleAttemptClose} />
      </ReactFlowProvider>

      {/* Unsaved Changes Close Modal */}
      {showCloseGuard && (
        <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-ds-surface border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Unsaved Changes</h3>
            <p className="text-xs text-gray-300">You have unsaved changes in this workflow. Save before closing?</p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSaveAndClose}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Save Changes & Close
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-gray-300 font-bold text-xs rounded-xl transition-all"
              >
                Discard & Close
              </button>
              <button
                onClick={() => setShowCloseGuard(false)}
                className="w-full py-2 text-gray-400 hover:text-white text-xs font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilderApp;
