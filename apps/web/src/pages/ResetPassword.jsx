import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain a number and an uppercase letter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#3B82F6]/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/10">
            <Bot className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
            SalesPilot<span className="text-[#3B82F6]">.ai</span>
          </span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-[#94A3B8] font-normal">
          Your new password must be different to previously used passwords.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-[#0F172A]/80 border border-[#263247] py-8 px-6 sm:px-10 rounded-2xl shadow-2xl backdrop-blur-xl">
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-[#FCA5A5]">
               <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
               <p className="text-sm font-semibold">{error}</p>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                New Password <span className="text-[#EF4444] font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 h-12 bg-[#070B14] border border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                Confirm Password <span className="text-[#EF4444] font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 h-12 bg-[#070B14] border border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center space-x-2 h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
