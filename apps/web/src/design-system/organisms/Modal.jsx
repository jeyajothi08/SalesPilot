import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm, md, lg, xl
}) => {
  
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full ${sizeStyles[size]} bg-ds-surface border border-ds-border rounded-ds-2xl shadow-ds-lg overflow-hidden flex flex-col max-h-[90vh]`}
          >
             {/* Header */}
             <div className="flex justify-between items-center px-6 py-4 border-b border-ds-border">
                <h3 className="text-lg font-bold text-ds-text-primary">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 -mr-2 text-ds-text-tertiary hover:text-ds-text-primary hover:bg-ds-surface-hover rounded-full transition-colors"
                >
                   <X className="w-5 h-5" />
                </button>
             </div>

             {/* Body */}
             <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {children}
             </div>

             {/* Footer */}
             {footer && (
               <div className="px-6 py-4 border-t border-ds-border bg-ds-background flex justify-end gap-3">
                  {footer}
               </div>
             )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
