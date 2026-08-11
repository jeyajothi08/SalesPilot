import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const TextInput = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  success,
  icon,
  required = false,
  className = '',
  ...props
}) => {
  const [_isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-bold text-ds-text-secondary uppercase tracking-wider flex items-center gap-1">
          {label}
          {required && <span className="text-ds-danger">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-text-tertiary group-focus-within:text-ds-accent transition-colors">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full bg-ds-surface border rounded-xl text-sm text-ds-text-primary transition-all duration-300
            ${icon ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5'}
            ${error ? 'border-ds-danger focus:ring-ds-danger/20' : 
              success ? 'border-ds-success focus:ring-ds-success/20' : 
              'border-ds-border focus:border-ds-accent focus:ring-4 focus:ring-ds-accent-glass'}
            focus:outline-none shadow-sm
          `}
          {...props}
        />

        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-danger">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}

        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-success">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-bold text-ds-danger mt-1">
          {error}
        </motion.p>
      )}
    </div>
  );
};
