import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const Card = ({
  children,
  variant = 'glass', // default, glass, interactive
  padding = 'p-6',
  className = '',
  onClick,
}) => {
  
  const baseStyles = "rounded-ds-2xl overflow-hidden relative";
  
  const variantStyles = {
    default: "bg-ds-surface border border-ds-border shadow-ds-sm",
    glass: "bg-ds-surface-glass backdrop-blur-xl border border-ds-border shadow-ds-glass",
    interactive: "bg-ds-surface border border-ds-border shadow-ds-sm hover:shadow-ds-md hover:border-ds-border-strong cursor-pointer transition-all duration-300",
  };

  const Component = variant === 'interactive' || onClick ? motion.div : 'div';
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (variant !== 'interactive' && !onClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const animationProps = (variant === 'interactive' || onClick) 
    ? { 
        style: { rotateX, rotateY, transformStyle: "preserve-3d" },
        whileHover: { scale: 1.02, zIndex: 10 }, 
        whileTap: { scale: 0.98 },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave
      } 
    : {};

  return (
    <div className={`perspective-1000 ${className}`}>
      <Component
        className={`${baseStyles} ${variantStyles[variant]} ${padding} w-full h-full`}
        onClick={onClick}
        {...animationProps}
      >
        {/* Subtle shine effect on interactive cards */}
        {(variant === 'interactive' || onClick) && (
          <motion.div 
            style={{ opacity: useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.15]) }}
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none"
          ></motion.div>
        )}
      
      <div className="relative z-10">
        {children}
      </div>
    </Component>
    </div>
  );
};
