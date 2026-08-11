import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Loader2, Check, AlertCircle, Clock, FastForward } from 'lucide-react';

export const GlassNode = ({
  children,
  isSelected,
  handles = ['source', 'target'],
  status = 'idle',
}) => {
  const getStatusBorder = () => {
    switch (status) {
      case 'running':
        return 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] bg-blue-950/40 animate-pulse';
      case 'success':
        return 'border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.4)] bg-green-950/20';
      case 'waiting':
        return 'border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.5)] bg-yellow-950/30';
      case 'failed':
        return 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] bg-red-950/30';
      case 'skipped':
        return 'border-white/5 opacity-50 bg-black/40';
      default:
        return isSelected
          ? 'bg-white/10 border-blue-500/80 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
          : 'bg-black/70 border-white/10 hover:border-white/20 hover:bg-black/90';
    }
  };

  return (
    <div
      className={`relative min-w-52.5 p-4 rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl ${getStatusBorder()}`}
    >
      {/* Status Badge Indicator */}
      {status !== 'idle' && (
        <div className="absolute -top-3 right-3 z-30 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md bg-black border border-white/10">
          {status === 'running' && (
            <span className="text-blue-400 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Running
            </span>
          )}
          {status === 'success' && (
            <span className="text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Success
            </span>
          )}
          {status === 'waiting' && (
            <span className="text-yellow-300 flex items-center gap-1 animate-pulse">
              <Clock className="w-3 h-3" /> Waiting Approval
            </span>
          )}
          {status === 'failed' && (
            <span className="text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Failed
            </span>
          )}
          {status === 'skipped' && (
            <span className="text-gray-400 flex items-center gap-1">
              <FastForward className="w-3 h-3" /> Skipped
            </span>
          )}
        </div>
      )}

      {/* Handles */}
      {handles.includes('target') && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3.5 h-3.5 bg-black border-2 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full transition-transform hover:scale-150"
        />
      )}

      <div className="relative z-10">{children}</div>

      {handles.includes('source') && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3.5 h-3.5 bg-black border-2 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full transition-transform hover:scale-150"
        />
      )}
    </div>
  );
};
