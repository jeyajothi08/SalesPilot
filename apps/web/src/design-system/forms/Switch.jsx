import React from 'react';
import { motion } from 'framer-motion';

export const Switch = ({ checked, onChange, label, disabled = false }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ds-background ${
          checked ? 'bg-ds-accent' : 'bg-ds-border-strong'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="sr-only">Use setting</span>
        <motion.span
          layout
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-ds-sm transform ring-0`}
        />
      </button>
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-ds-text-tertiary' : 'text-ds-text-primary'}`}>
          {label}
        </span>
      )}
    </div>
  );
};
