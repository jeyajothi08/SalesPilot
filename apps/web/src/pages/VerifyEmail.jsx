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
    const timer = setTimeout(() => {
      if (token) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center"
      >
        <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#3B82F6]/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/10">
            <Bot className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
            SalesPilot<span className="text-[#3B82F6]">.ai</span>
          </span>
        </Link>
        
        <div className="bg-[#0F172A]/80 border border-[#263247] py-12 px-6 sm:px-10 rounded-2xl shadow-2xl backdrop-blur-xl">
          
          {status === 'verifying' && (
             <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-[#3B82F6] animate-spin"></div>
                <h3 className="text-xl font-bold text-[#F8FAFC]">Verifying your email...</h3>
                <p className="text-[#94A3B8] text-sm">Please wait while we confirm your email address.</p>
             </div>
          )}

          {status === 'success' && (
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-[#F8FAFC]">Email Verified!</h3>
                <p className="text-[#94A3B8] text-sm mb-4">Your account has been successfully verified.</p>
                <Link to="/login" className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 flex justify-center items-center">
                  Continue to Login
                </Link>
             </motion.div>
          )}

          {status === 'error' && (
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-[#F8FAFC]">Verification Failed</h3>
                <p className="text-[#94A3B8] text-sm mb-4">The verification link is invalid or has expired.</p>
                <Link to="/register" className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all border border-slate-700 flex justify-center items-center">
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
