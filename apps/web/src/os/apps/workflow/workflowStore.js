import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { workflowsAPI } from '../../../api/workflows';

// Helper to normalized initial nodes
const initialNodes = [
  {
    id: 'node-1',
    type: 'triggerNode',
    subtype: 'incoming_call',
    position: { x: 100, y: 300 },
    config: {
      name: 'Incoming Call Trigger',
      enabled: true,
      phoneSource: '+15551234567',
      conditions: '',
    },
    data: {
      label: 'Incoming Call',
      icon: 'Phone',
      type: 'trigger',
      subtype: 'incoming_call',
      status: 'idle',
    },
  },
  {
    id: 'node-2',
    type: 'aiAgentNode',
    subtype: 'process_intent',
    position: { x: 480, y: 280 },
    config: {
      systemPrompt: 'Analyze the call transcript to extract customer intent and requested services.',
      intentCategories: [
        'sales_inquiry',
        'support_request',
        'pricing_request',
        'proposal_request',
        'follow_up',
        'complaint',
        'other',
      ],
      outputVariable: 'intent',
      confidenceThreshold: 0.7,
    },
    data: {
      label: 'Process Intent',
      state: 'idle',
      type: 'ai',
      subtype: 'process_intent',
      status: 'idle',
    },
  },
  {
    id: 'node-3',
    type: 'actionNode',
    subtype: 'update_crm',
    position: { x: 880, y: 160 },
    config: {
      customer: 'context.customer',
      deal: 'context.deal',
      stage: 'Proposal Sent',
      notes: 'Customer requested enterprise proposal via call.',
      owner: 'Sales Team',
    },
    data: {
      label: 'Update CRM',
      icon: 'Users',
      type: 'action',
      subtype: 'update_crm',
      status: 'idle',
    },
  },
  {
    id: 'node-4',
    type: 'actionNode',
    subtype: 'send_proposal',
    position: { x: 880, y: 440 },
    config: {
      recipient: 'context.customer.email',
      template: 'Enterprise Proposal Tier 1',
      subject: 'Your Enterprise Proposal',
      message: 'Hi {{customer.first_name}}, please find attached your requested proposal.',
      requireConfirmation: true,
    },
    data: {
      label: 'Send Proposal',
      icon: 'FileText',
      type: 'action',
      subtype: 'send_proposal',
      status: 'idle',
    },
  },
];

const initialEdges = [
  { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'animatedEdge', animated: true },
  { id: 'edge-2-3', source: 'node-2', target: 'node-3', type: 'animatedEdge', animated: true, condition: "intent == 'proposal_request' || intent == 'sales_inquiry'" },
  { id: 'edge-2-4', source: 'node-2', target: 'node-4', type: 'animatedEdge', animated: true, condition: "intent == 'proposal_request'" },
];

const MAX_HISTORY = 30;

const useWorkflowStore = create((set, get) => ({
  // Core state
  workflowId: 'wf-default',
  workflowName: 'Sales Lead & Proposal Automation',
  workflowDescription: 'Automatically handle incoming calls, classify intent with AI, update CRM, and send proposals.',
  version: 'v1',
  status: 'active',
  
  nodes: initialNodes,
  edges: initialEdges,
  
  // UI & Selection state
  selectedNodeId: null,
  isConfigOpen: false,
  isTestModalOpen: false,
  isTemplatesModalOpen: false,
  isHistoryModalOpen: false,
  
  // Statuses
  saveStatus: 'saved', // 'saved' | 'saving' | 'unsaved'
  isDirty: false,
  validationErrors: [],
  
  // Undo / Redo history
  past: [],
  future: [],

  // Execution tracking
  executionHistory: [],
  currentExecution: null,
  
  // Save snapshot to history
  pushHistory: () => {
    const { nodes, edges, past } = get();
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const newPast = [...past.slice(-MAX_HISTORY + 1), snapshot];
    set({ past: newPast, future: [], isDirty: true, saveStatus: 'unsaved' });
  },

  // Undo / Redo
  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;
    const current = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const previous = past[past.length - 1];
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: past.slice(0, past.length - 1),
      future: [current, ...future],
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;
    const current = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, current],
      future: future.slice(1),
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  // Node changes
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },
  
  // Connection validation
  onConnect: (connection) => {
    const { nodes, edges, pushHistory } = get();
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) return;

    // Prevent self connection
    if (connection.source === connection.target) {
      console.warn('Cannot connect a node to itself.');
      return;
    }

    // Prevent duplicate edge
    const existing = edges.find(
      (e) => e.source === connection.source && e.target === connection.target
    );
    if (existing) {
      console.warn('Edge already exists.');
      return;
    }

    // Node type connection rules:
    // Trigger -> AI, AI -> Action, AI -> AI, Action -> Action
    const sourceType = sourceNode.type === 'triggerNode' ? 'trigger' : sourceNode.type === 'aiAgentNode' ? 'ai' : 'action';
    const targetType = targetNode.type === 'triggerNode' ? 'trigger' : targetNode.type === 'aiAgentNode' ? 'ai' : 'action';

    if (targetType === 'trigger') {
      console.warn('Trigger nodes cannot receive incoming connections.');
      return;
    }

    if (sourceType === 'trigger' && targetType === 'action') {
      // Direct Trigger -> Action is allowed if required, but standard pattern is Trigger -> AI / Action
    }

    pushHistory();
    set({
      edges: addEdge(
        { ...connection, type: 'animatedEdge', animated: true },
        edges
      ),
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },
  
  addNode: (node) => {
    const { pushHistory } = get();
    pushHistory();
    set((state) => ({
      nodes: [...state.nodes, node],
      isDirty: true,
      saveStatus: 'unsaved',
    }));
  },

  deleteNode: (nodeId) => {
    const { pushHistory, nodes, edges, selectedNodeId } = get();
    pushHistory();
    set({
      nodes: nodes.filter((n) => n.id !== nodeId),
      edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
      isConfigOpen: selectedNodeId === nodeId ? false : get().isConfigOpen,
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  duplicateNode: (nodeId) => {
    const { pushHistory, nodes } = get();
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;

    pushHistory();
    const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const cloned = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      position: { x: target.position.x + 40, y: target.position.y + 40 },
    };

    set({
      nodes: [...nodes, cloned],
      selectedNodeId: newId,
      isConfigOpen: true,
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  deleteEdge: (edgeId) => {
    const { pushHistory, edges } = get();
    pushHistory();
    set({
      edges: edges.filter((e) => e.id !== edgeId),
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  selectNode: (nodeId) => {
    set({
      selectedNodeId: nodeId,
      isConfigOpen: !!nodeId,
    });
  },

  closeConfigModal: () => {
    set({
      isConfigOpen: false,
      selectedNodeId: null,
    });
  },

  updateNodeConfig: (nodeId, newConfig, newDataLabels = {}) => {
    const { pushHistory, nodes } = get();
    pushHistory();
    set({
      nodes: nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            config: { ...node.config, ...newConfig },
            data: { ...node.data, ...newDataLabels },
          };
        }
        return node;
      }),
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  // Workflow Validation
  validateWorkflow: () => {
    const { nodes, edges } = get();
    const errors = [];

    if (nodes.length === 0) {
      errors.push('Workflow must contain at least one node.');
      set({ validationErrors: errors });
      return false;
    }

    const triggerNodes = nodes.filter(
      (n) => n.type === 'triggerNode' || n.data?.type === 'trigger'
    );
    if (triggerNodes.length === 0) {
      errors.push('Workflow requires at least one trigger node (e.g. Incoming Call).');
    }

    // Every trigger has a downstream path
    triggerNodes.forEach((t) => {
      const hasOutgoing = edges.some((e) => e.source === t.id);
      if (!hasOutgoing) {
        errors.push(`Trigger "${t.data?.label || t.id}" is not connected to any downstream action or AI node.`);
      }
    });

    // Check orphan non-trigger nodes (nodes without incoming edges)
    const nonTriggers = nodes.filter(
      (n) => n.type !== 'triggerNode' && n.data?.type !== 'trigger'
    );
    nonTriggers.forEach((n) => {
      const hasIncoming = edges.some((e) => e.target === n.id);
      if (!hasIncoming) {
        errors.push(`Node "${n.data?.label || n.id}" is an orphan (has no incoming connection).`);
      }
    });

    // Broken edges check
    edges.forEach((e) => {
      const src = nodes.find((n) => n.id === e.source);
      const tgt = nodes.find((n) => n.id === e.target);
      if (!src || !tgt) {
        errors.push(`Broken connection detected between ${e.source} and ${e.target}.`);
      }
    });

    // Circular loop detection (DFS)
    const adj = {};
    nodes.forEach((n) => { adj[n.id] = []; });
    edges.forEach((e) => { if (adj[e.source]) adj[e.source].push(e.target); });

    const visited = {};
    const recStack = {};

    const isCyclic = (curr) => {
      if (!visited[curr]) {
        visited[curr] = true;
        recStack[curr] = true;
        for (const neighbor of adj[curr] || []) {
          if (!visited[neighbor] && isCyclic(neighbor)) return true;
          if (recStack[neighbor]) return true;
        }
      }
      recStack[curr] = false;
      return false;
    };

    for (const node of nodes) {
      if (isCyclic(node.id)) {
        errors.push('Circular execution loop detected in workflow graph.');
        break;
      }
    }

    // Node required config validation
    nodes.forEach((node) => {
      if (node.subtype === 'send_proposal' || node.data?.label === 'Send Proposal') {
        if (!node.config?.recipient) {
          errors.push('Send Proposal node requires a recipient.');
        }
      }
    });

    set({ validationErrors: errors });
    return errors.length === 0;
  },

  // Save / Deploy
  saveWorkflow: async () => {
    const { workflowId, workflowName, workflowDescription, nodes, edges } = get();
    set({ saveStatus: 'saving' });
    try {
      await workflowsAPI.updateWorkflow(workflowId, {
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
      });
      set({ saveStatus: 'saved', isDirty: false });
    } catch (e) {
      console.error('Save workflow failed:', e);
      set({ saveStatus: 'unsaved' });
    }
  },

  deployWorkflow: async () => {
    const { validateWorkflow, workflowId, workflowName, nodes, edges } = get();
    const isValid = validateWorkflow();
    if (!isValid) return { success: false, errors: get().validationErrors };

    set({ saveStatus: 'saving' });
    try {
      const res = await workflowsAPI.deployWorkflow(workflowId, {
        name: workflowName,
        nodes,
        edges,
      });
      set({
        version: res.version || 'v2',
        status: 'active',
        saveStatus: 'saved',
        isDirty: false,
      });
      return { success: true, version: res.version || 'v2', workflowId: res.id || workflowId };
    } catch (e) {
      set({ saveStatus: 'unsaved' });
      return { success: false, errors: [e.message || 'Deployment failed'] };
    }
  },

  // Template Loader
  loadTemplate: (templateNodes, templateEdges, templateName) => {
    const { pushHistory } = get();
    pushHistory();
    set({
      nodes: templateNodes,
      edges: templateEdges,
      workflowName: templateName,
      isTemplatesModalOpen: false,
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  // Node execution visual updates
  setNodeExecutionStatus: (nodeId, status, extraData = {}) => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: { ...n.data, status, ...extraData },
          };
        }
        return n;
      }),
    }));
  },

  resetAllNodeStatuses: () => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: 'idle' },
      })),
    }));
  },

  // Execution history tracking
  addExecutionRecord: (record) => {
    set((state) => ({
      executionHistory: [record, ...state.executionHistory],
      currentExecution: record,
    }));
  },

  updateCurrentExecution: (updates) => {
    set((state) => {
      if (!state.currentExecution) return state;
      const updated = { ...state.currentExecution, ...updates };
      const newHistory = state.executionHistory.map((h) =>
        h.id === updated.id ? updated : h
      );
      return { currentExecution: updated, executionHistory: newHistory };
    });
  },

  // Modals state toggles
  setTestModalOpen: (open) => set({ isTestModalOpen: open }),
  setTemplatesModalOpen: (open) => set({ isTemplatesModalOpen: open }),
  setHistoryModalOpen: (open) => set({ isHistoryModalOpen: open }),
}));

export default useWorkflowStore;
