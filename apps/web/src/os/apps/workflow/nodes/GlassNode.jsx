import React from 'react';
import { Handle, Position } from '@xyflow/react';

// The base glassmorphic wrapper for all nodes
export const GlassNode = ({ children, isSelected, handles = ['source', 'target'] }) => {
  return (
    <div className={`relative min-w-[200px] p-4 rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl 
      ${isSelected 
        ? 'bg-white/10 border-ds-accent/80 shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
        : 'bg-black/60 border-white/10 hover:border-white/20 hover:bg-black/80'
      }`}
    >
       
       {/* Background Noise/Glow (Subtle) */}
       <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none"></div>

       {handles.includes('target') && (
         <Handle 
           type="target" 
           position={Position.Left} 
           className="w-3 h-3 bg-ds-background border-2 border-ds-accent shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full transition-transform hover:scale-150" 
         />
       )}
       
       <div className="relative z-10">
         {children}
       </div>

       {handles.includes('source') && (
         <Handle 
           type="source" 
           position={Position.Right} 
           className="w-3 h-3 bg-ds-background border-2 border-ds-accent shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full transition-transform hover:scale-150" 
         />
       )}
    </div>
  );
};
