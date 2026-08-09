import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(10px)',
  },
  enter: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Apple-like custom ease
    },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const PageTransition = ({ children }) => {
  // If react-router-dom is used, we can key off the pathname to trigger re-renders
  // For demo purposes or if router isn't used globally yet, we just render children
  // In a real setup: const location = useLocation(); key={location.pathname}
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="w-full h-full min-h-screen origin-center"
    >
      {children}
    </motion.div>
  );
};
