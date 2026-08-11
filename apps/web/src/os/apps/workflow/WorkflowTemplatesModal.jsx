import React from 'react';
import { X, LayoutTemplate, ArrowRight } from 'lucide-react';
import useWorkflowStore from './workflowStore';

const TEMPLATES = [
  {
    id: 'lead-followup',
    name: 'Lead Follow-up',
    description: 'Incoming Call → AI Process Intent → Update CRM → Create Follow-up Task',
    nodes: [
      { id: 't-1', type: 'triggerNode', subtype: 'incoming_call', position: { x: 100, y: 300 }, config: { enabled: true }, data: { label: 'Incoming Call', icon: 'Phone', status: 'idle' } },
      { id: 't-2', type: 'aiAgentNode', subtype: 'process_intent', position: { x: 480, y: 280 }, config: { outputVariable: 'intent' }, data: { label: 'Process Intent', status: 'idle' } },
      { id: 't-3', type: 'actionNode', subtype: 'update_crm', position: { x: 880, y: 180 }, config: { stage: 'Contacted' }, data: { label: 'Update CRM', icon: 'Users', status: 'idle' } },
    ],
    edges: [
      { id: 'te-1-2', source: 't-1', target: 't-2', type: 'animatedEdge', animated: true },
      { id: 'te-2-3', source: 't-2', target: 't-3', type: 'animatedEdge', animated: true },
    ],
  },
  {
    id: 'proposal-automation',
    name: 'Proposal Automation',
    description: 'Incoming Call/Email → AI Intent → Generate Proposal → Approval → Send Proposal → Update CRM',
    nodes: [
      { id: 'p-1', type: 'triggerNode', subtype: 'incoming_call', position: { x: 100, y: 300 }, config: { enabled: true }, data: { label: 'Incoming Call', icon: 'Phone', status: 'idle' } },
      { id: 'p-2', type: 'aiAgentNode', subtype: 'process_intent', position: { x: 480, y: 280 }, config: { outputVariable: 'intent' }, data: { label: 'Process Intent', status: 'idle' } },
      { id: 'p-3', type: 'actionNode', subtype: 'update_crm', position: { x: 880, y: 160 }, config: { stage: 'Proposal Sent' }, data: { label: 'Update CRM', icon: 'Users', status: 'idle' } },
      { id: 'p-4', type: 'actionNode', subtype: 'send_proposal', position: { x: 880, y: 440 }, config: { requireConfirmation: true, recipient: 'context.customer.email' }, data: { label: 'Send Proposal', icon: 'FileText', status: 'idle' } },
    ],
    edges: [
      { id: 'pe-1-2', source: 'p-1', target: 'p-2', type: 'animatedEdge', animated: true },
      { id: 'pe-2-3', source: 'p-2', target: 'p-3', type: 'animatedEdge', animated: true, condition: "intent == 'proposal_request'" },
      { id: 'pe-2-4', source: 'p-2', target: 'p-4', type: 'animatedEdge', animated: true, condition: "intent == 'proposal_request'" },
    ],
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification',
    description: 'Incoming Call → AI Qualification → Score Lead → Update CRM → Assign Owner',
    nodes: [
      { id: 'q-1', type: 'triggerNode', subtype: 'incoming_call', position: { x: 100, y: 300 }, config: { enabled: true }, data: { label: 'Incoming Call', icon: 'Phone', status: 'idle' } },
      { id: 'q-2', type: 'aiAgentNode', subtype: 'process_intent', position: { x: 480, y: 280 }, config: { outputVariable: 'lead_score' }, data: { label: 'AI Lead Qualification', status: 'idle' } },
      { id: 'q-3', type: 'actionNode', subtype: 'update_crm', position: { x: 880, y: 280 }, config: { stage: 'Qualification' }, data: { label: 'Update CRM Stage', icon: 'Users', status: 'idle' } },
    ],
    edges: [
      { id: 'qe-1-2', source: 'q-1', target: 'q-2', type: 'animatedEdge', animated: true },
      { id: 'qe-2-3', source: 'q-2', target: 'q-3', type: 'animatedEdge', animated: true },
    ],
  },
  {
    id: 'email-automation',
    name: 'Inbound Email Automation',
    description: 'Incoming Email → AI Intent → Customer Lookup → Update CRM → Draft Response',
    nodes: [
      { id: 'e-1', type: 'triggerNode', subtype: 'incoming_email', position: { x: 100, y: 300 }, config: { enabled: true }, data: { label: 'Incoming Email', icon: 'Mail', status: 'idle' } },
      { id: 'e-2', type: 'aiAgentNode', subtype: 'process_intent', position: { x: 480, y: 280 }, config: { outputVariable: 'intent' }, data: { label: 'AI Intent Classifier', status: 'idle' } },
      { id: 'e-3', type: 'actionNode', subtype: 'update_crm', position: { x: 880, y: 280 }, config: { stage: 'Inbound Email' }, data: { label: 'Update CRM', icon: 'Users', status: 'idle' } },
    ],
    edges: [
      { id: 'ee-1-2', source: 'e-1', target: 'e-2', type: 'animatedEdge', animated: true },
      { id: 'ee-2-3', source: 'e-2', target: 'e-3', type: 'animatedEdge', animated: true },
    ],
  },
];

export const WorkflowTemplatesModal = () => {
  const { isTemplatesModalOpen, setTemplatesModalOpen, loadTemplate } = useWorkflowStore();

  if (!isTemplatesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-ds-surface border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Workflow Templates</h3>
          </div>
          <button
            onClick={() => setTemplatesModalOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white/5 border border-white/10 hover:border-blue-500/50 p-5 rounded-xl transition-all group flex items-center justify-between cursor-pointer"
              onClick={() => loadTemplate(tmpl.nodes, tmpl.edges, tmpl.name)}
            >
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{tmpl.name}</h4>
                <p className="text-xs text-gray-400">{tmpl.description}</p>
                <div className="text-[10px] text-gray-500 font-mono pt-1">
                  {tmpl.nodes.length} Nodes • {tmpl.edges.length} Connections
                </div>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 group-hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
              >
                Use Template <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-end">
          <button
            onClick={() => setTemplatesModalOpen(false)}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
