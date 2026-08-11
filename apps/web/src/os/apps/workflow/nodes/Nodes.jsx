import React from 'react';
import { GlassNode } from './GlassNode';
import { Phone, Users, FileText, Bot, Mail, Database } from 'lucide-react';
import { AIAvatar } from '../../../../design-system/ai/AIAvatar';

const IconMap = {
  Phone: <Phone className="w-5 h-5 text-green-400" />,
  Mail: <Mail className="w-5 h-5 text-orange-400" />,
  Users: <Users className="w-5 h-5 text-blue-400" />,
  FileText: <FileText className="w-5 h-5 text-pink-400" />,
  Bot: <Bot className="w-5 h-5 text-purple-400" />,
  Database: <Database className="w-5 h-5 text-yellow-400" />,
};

// 1. Trigger Node (Only source handle)
export const TriggerNode = ({ data, selected }) => {
  return (
    <GlassNode isSelected={selected} handles={['source']} status={data.status || 'idle'}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          {IconMap[data.icon] || <Phone className="w-5 h-5 text-green-400" />}
        </div>
        <div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Trigger</div>
          <div className="text-sm font-bold text-white">{data.label}</div>
          {data.sublabel && <div className="text-[10px] text-blue-300 font-mono mt-0.5">{data.sublabel}</div>}
        </div>
      </div>
    </GlassNode>
  );
};

// 2. Action Node (Both handles)
export const ActionNode = ({ data, selected }) => {
  return (
    <GlassNode isSelected={selected} handles={['source', 'target']} status={data.status || 'idle'}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          {IconMap[data.icon] || <Users className="w-5 h-5 text-blue-400" />}
        </div>
        <div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Action</div>
          <div className="text-sm font-bold text-white">{data.label}</div>
          {data.sublabel && <div className="text-[10px] text-green-300 font-mono mt-0.5">{data.sublabel}</div>}
        </div>
      </div>
    </GlassNode>
  );
};

// 3. AI Agent Node
export const AIAgentNode = ({ data, selected }) => {
  return (
    <GlassNode isSelected={selected} handles={['source', 'target']} status={data.status || 'idle'}>
      <div className="flex flex-col items-center gap-3 w-48">
        <div className="text-[9px] font-bold text-purple-400 uppercase tracking-wider w-full text-center pb-1.5 border-b border-white/10">
          AI Processing Core
        </div>

        <div className="w-28 h-28 relative flex items-center justify-center bg-black/40 rounded-full border border-white/5 shadow-inner my-1">
          <div className="absolute inset-0 scale-[0.6] pointer-events-none">
            <AIAvatar state={data.status === 'running' ? 'thinking' : data.state || 'idle'} />
          </div>
        </div>

        <div className="text-sm font-bold text-white text-center">{data.label}</div>
        {data.sublabel && (
          <div className="text-[10px] text-purple-300 font-mono text-center bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
            {data.sublabel}
          </div>
        )}
      </div>
    </GlassNode>
  );
};
