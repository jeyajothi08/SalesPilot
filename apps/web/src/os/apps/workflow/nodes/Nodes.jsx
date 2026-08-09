import React from 'react';
import { GlassNode } from './GlassNode';
import { Phone, Users, FileText, Bot } from 'lucide-react';
import { AIAvatar } from '../../../../design-system/ai/AIAvatar';

const IconMap = {
  Phone: <Phone className="w-5 h-5 text-green-400" />,
  Users: <Users className="w-5 h-5 text-blue-400" />,
  FileText: <FileText className="w-5 h-5 text-orange-400" />,
};

// 1. Trigger Node (Only has source handle)
export const TriggerNode = ({ data, selected }) => {
  return (
    <GlassNode isSelected={selected} handles={['source']}>
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
             {IconMap[data.icon] || <Phone className="w-5 h-5 text-ds-text-primary" />}
          </div>
          <div>
             <div className="text-[9px] font-bold text-ds-text-tertiary uppercase tracking-wider mb-0.5">Trigger</div>
             <div className="text-sm font-bold text-white">{data.label}</div>
          </div>
       </div>
    </GlassNode>
  );
};

// 2. Action Node (Has both handles)
export const ActionNode = ({ data, selected }) => {
  return (
    <GlassNode isSelected={selected}>
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
             {IconMap[data.icon] || <Users className="w-5 h-5 text-ds-text-primary" />}
          </div>
          <div>
             <div className="text-[9px] font-bold text-ds-text-tertiary uppercase tracking-wider mb-0.5">Action</div>
             <div className="text-sm font-bold text-white">{data.label}</div>
          </div>
       </div>
    </GlassNode>
  );
};

// 3. Special AI Agent Node
export const AIAgentNode = ({ data, selected }) => {
  return (
    <GlassNode isSelected={selected}>
       <div className="flex flex-col items-center gap-4 w-48">
          <div className="text-[9px] font-bold text-ds-accent uppercase tracking-wider w-full text-center pb-2 border-b border-white/5">
             AI Processing Core
          </div>
          
          <div className="w-32 h-32 relative flex items-center justify-center bg-black/40 rounded-full border border-white/5 shadow-inner">
             {/* Note: In a real environment, rendering multiple WebGL contexts can be expensive. 
                 For a node editor, we might use a CSS fallback or limit the FPS of the orb here. */}
             <div className="absolute inset-0 scale-[0.6] pointer-events-none">
                <AIAvatar state={data.state || 'idle'} />
             </div>
          </div>

          <div className="text-sm font-bold text-white text-center">
             {data.label}
          </div>
       </div>
    </GlassNode>
  );
};
