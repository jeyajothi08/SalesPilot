import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { setTokens } from '../api/apiClient';

const formatErrorMessage = (errorData) => {
  if (!errorData) return 'Invalid credentials';
  if (typeof errorData === 'string') return errorData;
  if (Array.isArray(errorData)) {
    return errorData.map((e) => e.msg || JSON.stringify(e)).join(', ');
  }
  if (typeof errorData === 'object') {
    return errorData.detail ? formatErrorMessage(errorData.detail) : errorData.message || JSON.stringify(errorData);
  }
  return String(errorData);
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authAPI.login(email.trim(), password);
      const access_token = data.access_token;
      const refresh_token = data.refresh_token;

      if (!access_token) {
        throw new Error('Authentication failed: No access token received from backend');
      }

      setTokens(access_token, refresh_token);
      const destination = location.state?.from?.pathname || '/app';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('[Login] Login request failed:', err);
      const detail = err.response?.data?.detail || err.response?.data || err.message;
      const formatted = formatErrorMessage(detail);
      setError(formatted);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#050816] font-sans text-[#F8FAFC] relative overflow-x-hidden">
      
      {/* Subtle Ambient Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-[#2563EB]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-accent-purple/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Area - Full Dark Login Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 relative z-10 overflow-y-auto bg-[#070B14]/60 backdrop-blur-md min-h-screen">
        
        <div className="w-full max-w-md mx-auto">
          
          {/* Header */}
          <Link to="/" className="inline-flex items-center space-x-3 mb-10 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#3B82F6]/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/10">
              <Bot className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
              SalesPilot<span className="text-[#3B82F6]">.ai</span>
            </span>
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC] mb-2">
            Welcome back
          </h1>
          <p className="text-[#94A3B8] text-base font-normal mb-8">
            Please enter your credentials to sign in to your workspace.
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 p-4 bg-red-500/10 border border-red-500/35 rounded-xl flex items-start space-x-3 text-[#FCA5A5]"
            >
               <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
               <p className="text-sm font-semibold leading-relaxed text-[#FCA5A5]">{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                Work Email <span className="text-[#EF4444] font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 h-13 bg-[#0F172A] border border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                Password <span className="text-[#EF4444] font-bold">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 h-13 bg-[#0F172A] border border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#3B82F6] focus:ring-[#3B82F6]/30 border-[#263247] bg-[#0F172A] rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#94A3B8] cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-[#60A5FA] hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center space-x-2.5 h-13 bg-linear-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] active:scale-[0.99] text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed border border-blue-400/30 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#263247]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                <span className="px-3 bg-[#070B14] text-[#64748B]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setError('Google login is coming soon.')}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#263247] rounded-xl bg-[#0F172A] text-sm font-semibold text-[#E2E8F0] hover:bg-[#1E293B] hover:border-slate-600 transition-all cursor-pointer shadow-sm group"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5 group-hover:scale-105 transition-transform" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setError('GitHub login is coming soon.')}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-[#263247] rounded-xl bg-[#0F172A] text-sm font-semibold text-[#E2E8F0] hover:bg-[#1E293B] hover:border-slate-600 transition-all cursor-pointer shadow-sm group"
              >
                <span className="sr-only">Sign in with GitHub</span>
                <svg className="w-5 h-5 group-hover:scale-105 transition-transform" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sign up Footer */}
          <p className="mt-8 text-center text-sm text-[#94A3B8]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#60A5FA] hover:underline transition-colors">
              Create an account
            </Link>
          </p>
        </div>

      </div>

      {/* Right Area - Full Dark AI Sales Employee Card */}
      <div className="w-full lg:w-1/2 relative bg-[#070B18]/80 overflow-hidden flex items-center justify-center p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-slate-800/60 min-h-125 lg:min-h-screen">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-110 bg-[#0F172A]/75 border border-blue-400/20 p-8 sm:p-10 rounded-[28px] shadow-2xl backdrop-blur-xl flex flex-col items-center text-center"
        >
          {/* Top Robot Icon Box */}
          <div className="w-24 h-24 rounded-2xl bg-linear-to-tr from-[#2563EB] via-indigo-600 to-accent-purple p-0.5 mb-6 shadow-xl shadow-blue-500/30">
            <div className="w-full h-full rounded-[14px] bg-[#0A0E1A] flex items-center justify-center">
              <Bot className="w-12 h-12 text-[#3B82F6]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC] mb-3">
            Supercharge your sales pipeline.
          </h2>
          
          <p className="text-[#CBD5E1] text-sm font-normal leading-relaxed mb-8">
            Automate outbound engagement, follow up on leads, and schedule qualified meetings 24/7 with human-like AI agents.
          </p>
          
          {/* Bottom Stats */}
          <div className="grid grid-cols-2 gap-4 w-full">
             <div className="bg-slate-800/55 border border-slate-400/15 p-4 rounded-2xl text-center backdrop-blur-md">
                <p className="text-3xl font-extrabold text-[#3B82F6]">10x</p>
                <p className="text-xs font-medium text-[#94A3B8] mt-1">Faster Engagement</p>
             </div>
             <div className="bg-slate-800/55 border border-slate-400/15 p-4 rounded-2xl text-center backdrop-blur-md">
                <p className="text-3xl font-extrabold text-[#A855F7]">99.9%</p>
                <p className="text-xs font-medium text-[#94A3B8] mt-1">Uptime Reliability</p>
             </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
