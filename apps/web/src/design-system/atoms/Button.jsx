import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, ghost, outline, danger
  size = 'md', // sm, md, lg
  isLoading = false,
  isDisabled = false,
  icon,
  className = '',
  onClick,
  ...props
}) => {
  
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ds-accent";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-8 py-4 text-base rounded-2xl gap-3",
  };

  const variantStyles = {
    primary: "bg-ds-primary text-ds-background hover:bg-ds-primary-hover shadow-ds-sm hover:shadow-ds-md hover:-translate-y-0.5",
    secondary: "bg-ds-surface text-ds-text-primary border border-ds-border hover:bg-ds-surface-hover shadow-sm hover:shadow-ds-sm",
    ghost: "bg-transparent text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-surface-hover",
    outline: "bg-transparent text-ds-text-primary border border-ds-border hover:border-ds-border-strong",
    danger: "bg-ds-danger text-white shadow-ds-sm hover:shadow-ds-md hover:-translate-y-0.5",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed transform-none hover:transform-none hover:shadow-none";

  return (
    <motion.button
      whileTap={!isDisabled && !isLoading ? { scale: 0.97 } : {}}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${isDisabled || isLoading ? disabledStyles : ''} ${className}`}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {/* Background ripple on hover for primary/danger */}
      {(variant === 'primary' || variant === 'danger') && (
         <span className="absolute inset-0 w-full h-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
      )}

      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      
      <span>{children}</span>
    </motion.button>
  );
};
