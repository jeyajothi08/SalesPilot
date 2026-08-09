import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className, onClick, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Attract the button towards the mouse (divisor controls strength)
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative overflow-hidden group ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Background glow effect that follows hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/80 to-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]"></span>
      
      {/* Actual button surface */}
      <span className="relative z-10 flex items-center justify-center h-full w-full bg-white/5 backdrop-blur-md rounded-[inherit] border border-white/10 group-hover:border-white/30 transition-colors">
        {children}
      </span>
    </motion.button>
  );
};

export default MagneticButton;
