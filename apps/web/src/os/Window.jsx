import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';

export const Window = ({ 
  id, 
  title, 
  children, 
  onClose, 
  isActive, 
  onFocus,
  defaultWidth = 800,
  defaultHeight = 500,
  defaultX,
  defaultY
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Center defaults if not provided
  const startX = defaultX ?? (typeof window !== 'undefined' ? (window.innerWidth - defaultWidth) / 2 : 100);
  const startY = defaultY ?? (typeof window !== 'undefined' ? (window.innerHeight - defaultHeight) / 2 : 100);

  if (isMinimized) return null; // In a full implementation, this would go to the dock

  return (
    <Rnd
      default={{
        x: startX,
        y: startY,
        width: defaultWidth,
        height: defaultHeight,
      }}
      minWidth={400}
      minHeight={300}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      onDragStart={onFocus}
      onResizeStart={onFocus}
      style={{ zIndex: isActive ? 50 : 10 }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      size={isMaximized ? { width: '100%', height: '100%' } : undefined}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`w-full h-full flex flex-col bg-ds-surface/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-shadow ${isActive ? 'shadow-ds-accent/20 ring-1 ring-white/20' : ''}`}
        onClick={onFocus}
      >
        
        {/* macOS Style Traffic Light Header */}
        <div className="window-drag-handle flex items-center justify-between px-4 py-3 bg-ds-surface-hover/50 border-b border-white/5 cursor-grab active:cursor-grabbing select-none group">
           <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(id); }}
                className="w-3.5 h-3.5 rounded-full bg-ds-danger/80 hover:bg-ds-danger flex items-center justify-center transition-colors"
              >
                <X className="w-2.5 h-2.5 text-white opacity-0 group-hover:opacity-100" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="w-3.5 h-3.5 rounded-full bg-ds-warning/80 hover:bg-ds-warning flex items-center justify-center transition-colors"
              >
                <Minus className="w-2.5 h-2.5 text-white opacity-0 group-hover:opacity-100" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                className="w-3.5 h-3.5 rounded-full bg-ds-success/80 hover:bg-ds-success flex items-center justify-center transition-colors"
              >
                <Maximize2 className="w-2 h-2 text-white opacity-0 group-hover:opacity-100" />
              </button>
           </div>
           
           <div className="text-xs font-bold text-ds-text-secondary uppercase tracking-wider">{title}</div>
           <div className="w-16"></div> {/* Spacer to center title */}
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-auto custom-scrollbar bg-ds-background/50">
           {children}
        </div>
        
      </motion.div>
    </Rnd>
  );
};
