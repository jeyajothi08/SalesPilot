import React from 'react';
import { Bot, Phone, Users, FileText, Database, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const nodeTypes = [
  { type: 'triggerNode', label: 'Incoming Call', icon: Phone, category: 'Triggers', color: 'text-green-400' },
  { type: 'triggerNode', label: 'New Email', icon: Mail, category: 'Triggers', color: 'text-orange-400' },
  { type: 'aiAgentNode', label: 'AI Processing Core', icon: Bot, category: 'AI', color: 'text-purple-400' },
  { type: 'actionNode', label: 'Update CRM', icon: Users, category: 'Actions', color: 'text-blue-400' },
  { type: 'actionNode', label: 'Generate Proposal', icon: FileText, category: 'Actions', color: 'text-pink-400' },
  { type: 'actionNode', label: 'Query Database', icon: Database, category: 'Actions', color: 'text-yellow-400' },
];

export const NodeLibrary = () => {
  const onDragStart = (event, nodeType, label, iconName) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.setData('application/icon', iconName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full bg-ds-surface/90 backdrop-blur-3xl border-r border-white/10 p-4 flex flex-col z-50">
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-white mb-1 tracking-tight">Node Library</h2>
        <p className="text-xs text-ds-text-tertiary">Drag nodes onto the canvas.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        
        {['Triggers', 'AI', 'Actions'].map((category) => (
           <div key={category}>
             <h3 className="text-[10px] font-bold text-ds-text-secondary uppercase tracking-wider mb-3">{category}</h3>
             <div className="space-y-2">
                {nodeTypes.filter(n => n.category === category).map((node, i) => {
                   const Icon = node.icon;
                   return (
                     <div 
                       key={i}
                       className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors"
                       onDragStart={(e) => onDragStart(e, node.type, node.label, Icon.name)}
                       draggable
                     >
                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
                           <Icon className={`w-4 h-4 ${node.color}`} />
                        </div>
                        <span className="text-sm font-medium text-white">{node.label}</span>
                     </div>
                   )
                })}
             </div>
           </div>
        ))}

      </div>
    </div>
  );
};
