import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../../api/apiClient';

export const Navbar = () => {
  const isAuth = isAuthenticated();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex justify-between items-center backdrop-blur-md bg-black/50 border-b border-white/5">
      <Link to="/" className="flex items-center gap-2 pointer-events-auto">
        <Bot className="w-6 h-6 text-white" />
        <span className="text-xl font-bold tracking-tight text-white">SalesPilot AI</span>
      </Link>
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 pointer-events-auto">
        <Link to="/features" className="hover:text-white transition-colors">Features</Link>
        <Link to="/automation" className="hover:text-white transition-colors">Automation</Link>
        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
      </div>
      <div className="flex items-center gap-4 pointer-events-auto">
        {isAuth ? (
          <Link to="/app">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Launch OS Dashboard
            </motion.button>
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-white hover:text-gray-300">Log in</Link>
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </motion.button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

