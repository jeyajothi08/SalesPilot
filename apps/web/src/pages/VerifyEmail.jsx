import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, CheckCircle, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    // Simulate API call to verify token
    setTimeout(() => {
      if (token) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 2000);
  }, [token]);

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-purple/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center"
      >
        <Link to="/" className="flex justify-center items-center space-x-2 mb-8">
          <Bot className="w-8 h-8 text-primary" />
          <span className="text-2xl font-semibold tracking-tight text-text-main">SalesPilot</span>
        </Link>
        
        <div className="glass-card py-12 px-4 sm:px-10 bg-white/80">
          
          {status === 'verifying' && (
             <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full border-4 border-bg-secondary border-t-primary animate-spin"></div>
                <h3 className="text-xl font-semibold">Verifying your email...</h3>
                <p className="text-text-muted text-sm">Please wait while we confirm your email address.</p>
             </div>
          )}

          {status === 'success' && (
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Email Verified!</h3>
                <p className="text-text-muted text-sm mb-4">Your account has been successfully verified.</p>
                <Link to="/login" className="w-full py-3 px-4 btn-primary text-sm font-medium flex justify-center">
                  Continue to Login
                </Link>
             </motion.div>
          )}

          {status === 'error' && (
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold">Verification Failed</h3>
                <p className="text-text-muted text-sm mb-4">The verification link is invalid or has expired.</p>
                <Link to="/register" className="w-full py-3 px-4 btn-secondary text-sm font-medium flex justify-center">
                  Back to Registration
                </Link>
             </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
