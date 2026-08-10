import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../../api/apiClient';

export const Navbar = () => {
  const isAuth = isAuthenticated();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex justify-between items-center backdrop-blur-md bg-black/50 border-b border-white/5">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 pointer-events-auto cursor-pointer border-none bg-transparent">
        <Bot className="w-6 h-6 text-white" />
        <span className="text-xl font-bold tracking-tight text-white">SalesPilot AI</span>
      </button>
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 pointer-events-auto">
        <button onClick={() => navigate('/features')} className="hover:text-white transition-colors cursor-pointer border-none bg-transparent">Features</button>
        <button onClick={() => navigate('/automation')} className="hover:text-white transition-colors cursor-pointer border-none bg-transparent">Automation</button>
        <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors cursor-pointer border-none bg-transparent">Pricing</button>
      </div>
      <div className="flex items-center gap-4 pointer-events-auto">
        {isAuth ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => navigate('/app')}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors block cursor-pointer border-none"
            >
              Launch OS Dashboard
            </button>
          </motion.div>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-white hover:text-gray-300 cursor-pointer border-none bg-transparent">Log in</button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors block cursor-pointer border-none"
              >
                Sign Up
              </button>
            </motion.div>
          </>
        )}
      </div>
    </nav>
  );
};

