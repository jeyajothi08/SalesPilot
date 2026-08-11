import React, { useState, useEffect } from 'react';
import { X, Trash2, Copy, Sliders, CheckCircle, Database } from 'lucide-react';
import useWorkflowStore from './workflowStore';
import { crmAPI } from '../../../api/crm';

export const NodeConfigModal = () => {
  const {
    nodes,
    selectedNodeId,
    isConfigOpen,
    closeConfigModal,
    updateNodeConfig,
    deleteNode,
    duplicateNode,
  } = useWorkflowStore();

  const [crmDeals, setCrmDeals] = useState([]);
  const [crmCustomers, setCrmCustomers] = useState([]);
  const [loadingCrm, setLoadingCrm] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Fetch live CRM data on open
  useEffect(() => {
    if (!isConfigOpen) return;
    let isMounted = true;
    setLoadingCrm(true);
    
    Promise.all([
      crmAPI.getDeals().catch(() => []),
      crmAPI.getCustomers().catch(() => []),
    ]).then(([deals, customers]) => {
      if (isMounted) {
        setCrmDeals(Array.isArray(deals) ? deals : []);
        setCrmCustomers(Array.isArray(customers) ? customers : []);
        setLoadingCrm(false);
      }
    });

    return () => { isMounted = false; };
  }, [isConfigOpen]);

  if (!isConfigOpen || !selectedNode) return null;

  const config = selectedNode.config || {};
  const subtype = selectedNode.subtype || selectedNode.data?.subtype || 'incoming_call';
  const nodeType = selectedNode.type;

  const handleChange = (field, value) => {
    updateNodeConfig(selectedNode.id, { [field]: value });
  };

  const handleCategoryToggle = (category) => {
    const current = config.intentCategories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    handleChange('intentCategories', updated);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-black/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-200">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Node Configuration</h2>
        </div>
        <button
          onClick={closeConfigModal}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Node Info & Quick Actions */}
      <div className="px-6 py-3 border-b border-white/10 bg-white/2 flex items-center justify-between">
        <div>
          <div className="text-base font-extrabold text-white">{selectedNode.data?.label || selectedNode.id}</div>
          <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {selectedNode.id}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateNode(selectedNode.id)}
            title="Duplicate Node"
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            title="Delete Node"
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
        
        {/* ── INCOMING CALL ── */}
        {(subtype === 'incoming_call' || selectedNode.data?.label === 'Incoming Call') && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Trigger Name</label>
              <input
                type="text"
                value={config.name || 'Incoming Call Trigger'}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">Enable Trigger</div>
                <div className="text-[10px] text-gray-400">Listen for incoming voice calls</div>
              </div>
              <input
                type="checkbox"
                checked={config.enabled !== false}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone Number / Source Filter</label>
              <input
                type="text"
                placeholder="e.g. +15551234567 or * (All)"
                value={config.phoneSource || ''}
                onChange={(e) => handleChange('phoneSource', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Optional Conditions</label>
              <textarea
                rows={2}
                placeholder="e.g. caller in VIP segment"
                value={config.conditions || ''}
                onChange={(e) => handleChange('conditions', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* ── INCOMING EMAIL ── */}
        {(subtype === 'incoming_email' || selectedNode.data?.label === 'Incoming Email' || selectedNode.data?.label === 'New Email') && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Account</label>
              <input
                type="text"
                placeholder="sales@company.com"
                value={config.emailAccount || 'sales@salespilot.ai'}
                onChange={(e) => handleChange('emailAccount', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Sender Filter</label>
              <input
                type="text"
                placeholder="*@enterprise.com"
                value={config.senderFilter || ''}
                onChange={(e) => handleChange('senderFilter', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subject Pattern</label>
              <input
                type="text"
                placeholder="e.g. Proposal, Inquiry"
                value={config.subjectFilter || ''}
                onChange={(e) => handleChange('subjectFilter', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-xs font-semibold text-white">Enabled</span>
              <input
                type="checkbox"
                checked={config.enabled !== false}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded"
              />
            </div>
          </>
        )}

        {/* ── PROCESS INTENT (AI NODE) ── */}
        {(subtype === 'process_intent' || nodeType === 'aiAgentNode' || selectedNode.data?.type === 'ai') && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">AI System Prompt / Instructions</label>
              <textarea
                rows={3}
                value={config.systemPrompt || 'Analyze conversation transcript, extract customer intent, and identify enterprise needs.'}
                onChange={(e) => handleChange('systemPrompt', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Intent Categories</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'sales_inquiry',
                  'support_request',
                  'pricing_request',
                  'proposal_request',
                  'follow_up',
                  'complaint',
                  'other',
                ].map((cat) => {
                  const selected = (config.intentCategories || []).includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                        selected
                          ? 'bg-blue-600/30 border-blue-400 text-blue-300 font-bold'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Output Variable Name</label>
              <input
                type="text"
                value={config.outputVariable || 'intent'}
                onChange={(e) => handleChange('outputVariable', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1.5">
                <span>Confidence Threshold</span>
                <span className="text-blue-400 font-mono">{config.confidenceThreshold || 0.7}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={config.confidenceThreshold || 0.7}
                onChange={(e) => handleChange('confidenceThreshold', parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </>
        )}

        {/* ── UPDATE CRM ── */}
        {(subtype === 'update_crm' || selectedNode.data?.label === 'Update CRM') && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target CRM Deal</label>
              {loadingCrm ? (
                <div className="text-xs text-gray-400 animate-pulse py-2">Loading active CRM deals...</div>
              ) : (
                <select
                  value={config.deal || 'context.deal'}
                  onChange={(e) => handleChange('deal', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="context.deal">⚡ Dynamic Context Deal</option>
                  {crmDeals.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title || `Deal #${d.id}`} (${d.value || 0})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Pipeline Stage</label>
              <select
                value={config.stage || 'Proposal Sent'}
                onChange={(e) => handleChange('stage', e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Discovery">Discovery</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Owner / Assigned Agent</label>
              <input
                type="text"
                value={config.owner || 'Sales Team'}
                onChange={(e) => handleChange('owner', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Activity Notes</label>
              <textarea
                rows={3}
                placeholder="Log activity note..."
                value={config.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* ── SEND PROPOSAL ── */}
        {(subtype === 'send_proposal' || selectedNode.data?.label === 'Send Proposal' || selectedNode.data?.label === 'Generate Proposal') && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Recipient Email / Contact</label>
              <input
                type="text"
                placeholder="context.customer.email"
                value={config.recipient || 'context.customer.email'}
                onChange={(e) => handleChange('recipient', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Proposal Template</label>
              <select
                value={config.template || 'Enterprise Proposal Tier 1'}
                onChange={(e) => handleChange('template', e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Enterprise Proposal Tier 1">Enterprise Tier 1 ($25k/yr)</option>
                <option value="Standard Growth Package">Standard Growth ($10k/yr)</option>
                <option value="Custom AI Solution">Custom AI Solution (Quote)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subject</label>
              <input
                type="text"
                value={config.subject || 'Your SalesPilot AI Enterprise Proposal'}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Body</label>
              <textarea
                rows={3}
                value={config.message || 'Hi {{customer.first_name}}, please find attached your custom enterprise proposal.'}
                onChange={(e) => handleChange('message', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div>
                <div className="text-xs font-bold text-yellow-300">Require Human Approval</div>
                <div className="text-[10px] text-gray-300">Pause workflow at "Waiting for approval" before sending</div>
              </div>
              <input
                type="checkbox"
                checked={config.requireConfirmation !== false}
                onChange={(e) => handleChange('requireConfirmation', e.target.checked)}
                className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
              />
            </div>
          </>
        )}

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
        <button
          onClick={closeConfigModal}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Save Configuration
        </button>
      </div>

    </div>
  );
};
