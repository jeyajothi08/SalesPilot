import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // success, warning, danger, info, neutral
  pulse = false,
  className = '',
}) => {
  
  const variantStyles = {
    success: 'bg-ds-success-bg text-ds-success border-ds-success/20',
    warning: 'bg-ds-warning-bg text-ds-warning border-ds-warning/20',
    danger: 'bg-ds-danger-bg text-ds-danger border-ds-danger/20',
    info: 'bg-ds-info-bg text-ds-info border-ds-info/20',
    neutral: 'bg-ds-surface text-ds-text-secondary border-ds-border',
  };

  const pulseColors = {
    success: 'bg-ds-success',
    warning: 'bg-ds-warning',
    danger: 'bg-ds-danger',
    info: 'bg-ds-info',
    neutral: 'bg-ds-text-tertiary',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${variantStyles[variant]} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[variant]}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColors[variant]}`}></span>
        </span>
      )}
      {children}
    </span>
  );
};
