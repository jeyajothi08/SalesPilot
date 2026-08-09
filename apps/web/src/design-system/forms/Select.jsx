import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export const Select = ({
  options = [],
  value,
  onChange,
  label,
  placeholder = "Select an option...",
  disabled = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[11px] font-bold text-ds-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full flex items-center justify-between px-4 py-2.5 
          bg-ds-surface border rounded-xl text-sm transition-all duration-200 shadow-sm
          ${disabled ? 'opacity-50 cursor-not-allowed text-ds-text-tertiary' : 'text-ds-text-primary cursor-pointer'}
          ${error ? 'border-ds-danger' : isOpen ? 'border-ds-accent ring-4 ring-ds-accent-glass' : 'border-ds-border hover:border-ds-border-strong'}
        `}
      >
        <span className={selectedOption ? 'text-ds-text-primary' : 'text-ds-text-tertiary'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-ds-text-tertiary" />
        </motion.div>
      </button>

      {error && <p className="text-[11px] font-bold text-ds-danger">{error}</p>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 w-full bg-ds-surface border border-ds-border rounded-xl shadow-ds-lg overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar p-1"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors
                  ${value === option.value ? 'bg-ds-accent-glass text-ds-accent font-bold' : 'text-ds-text-primary hover:bg-ds-surface-hover'}
                `}
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
