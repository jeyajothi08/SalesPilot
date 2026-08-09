import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const Checkbox = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`
          w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
          ${checked ? 'bg-ds-accent border-ds-accent' : 'bg-transparent border-ds-border-strong'}
        `}>
          <motion.div
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </motion.div>
        </div>
      </div>
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-ds-text-tertiary' : 'text-ds-text-primary'}`}>
          {label}
        </span>
      )}
    </label>
  );
};
