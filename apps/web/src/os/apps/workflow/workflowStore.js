import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

// Define initial demo workflow state
const initialNodes = [
  { id: '1', type: 'triggerNode', position: { x: 100, y: 300 }, data: { label: 'Incoming Call', icon: 'Phone' } },
  { id: '2', type: 'aiAgentNode', position: { x: 500, y: 250 }, data: { label: 'Process Intent', state: 'thinking' } },
  { id: '3', type: 'actionNode', position: { x: 900, y: 150 }, data: { label: 'Update CRM', icon: 'Users' } },
  { id: '4', type: 'actionNode', position: { x: 900, y: 450 }, data: { label: 'Send Proposal', icon: 'FileText' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'animatedEdge', animated: true },
  { id: 'e2-3', source: '2', target: '3', type: 'animatedEdge', animated: true },
  { id: 'e2-4', source: '2', target: '4', type: 'animatedEdge', animated: true },
];

const useWorkflowStore = create((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      // Automatically use our custom animated edge for all new connections
      edges: addEdge({ ...connection, type: 'animatedEdge', animated: true }, get().edges),
    });
  },
  
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
}));

export default useWorkflowStore;
