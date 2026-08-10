import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Login] 1. Form submit handler triggered with email:', email);
    setError('');

    if (!email || !password) {
      console.warn('[Login] Missing email or password');
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('[Login] 2. Sending API login request to backend...');
      const data = await authAPI.login(email.trim(), password);
      console.log('[Login] 3. Backend response received:', data);

      const access_token = data.access_token;
      const refresh_token = data.refresh_token;

      if (!access_token) {
        throw new Error('Authentication failed: No access token received from backend');
      }

      setTokens(access_token, refresh_token);
      console.log('[Login] 4. Tokens saved to localStorage. Navigating to /app...');

      navigate('/app', { replace: true });
    } catch (err) {
      console.error('[Login] ❌ Login request failed:', err);
      const detail = err.response?.data?.detail || err.response?.data || err.message;
      const formatted = formatErrorMessage(detail);
      console.error('[Login] Displaying error to user:', formatted);
      setError(formatted);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Area - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-20 xl:px-32 relative z-10">
        
        <div className="w-full max-w-sm mx-auto">
          <Link to="/" className="flex items-center space-x-2 mb-12">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold tracking-tight text-text-main">SalesPilot</span>
          </Link>
          
          <h2 className="text-3xl font-bold tracking-tight text-text-main mb-2">
            Welcome back
          </h2>
          <p className="text-text-muted text-sm font-light mb-8">
            Please enter your details to sign in.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
               <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
               <p className="text-sm text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
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
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center space-x-2 py-3.5 px-4 btn-primary text-sm font-medium disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setError('Google login is coming soon.')} className="w-full inline-flex justify-center py-2.5 px-4 border border-border rounded-xl shadow-sm bg-white text-sm font-medium text-text-muted hover:bg-bg-secondary transition-colors group">
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                </svg>
              </button>

              <button type="button" onClick={() => setError('GitHub login is coming soon.')} className="w-full inline-flex justify-center py-2.5 px-4 border border-border rounded-xl shadow-sm bg-white text-sm font-medium text-text-muted hover:bg-bg-secondary transition-colors group">
                <span className="sr-only">Sign in with GitHub</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover transition-colors">
              Sign up
            </Link>
          </p>
        </div>

      </div>

      {/* Right Area - AI Illustration */}
      <div className="hidden lg:flex flex-1 relative bg-bg-secondary overflow-hidden items-center justify-center border-l border-border/50">
        <div className="absolute top-[-20%] left-[-10%] w-200 h-200 bg-primary/20 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-[-20%] right-[-10%] w-150 h-150 bg-accent-purple/20 rounded-full blur-[100px] opacity-70" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg glass-card bg-white/40 p-12 rounded-[40px] border border-white/60 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-32 h-32 rounded-3xl bg-linear-to-tr from-primary to-accent-purple p-1 mb-8 shadow-xl shadow-primary/30">
            <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center">
              <Bot className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight mb-4">Supercharge your sales.</h3>
          <p className="text-text-muted text-lg font-light leading-relaxed">
            Join thousands of startups and enterprises automating their outbound process with human-like AI.
          </p>
          
          <div className="mt-12 w-full glass-card bg-white/80 p-6 rounded-2xl text-left border border-white/60">
             <div className="flex items-center space-x-4 mb-4">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                 <Bot className="w-5 h-5 text-primary" />
               </div>
               <div>
                 <p className="text-sm font-semibold">SalesPilot AI</p>
                 <p className="text-xs text-text-muted">Meeting booked successfully</p>
               </div>
             </div>
             <div className="w-full bg-bg-secondary rounded-lg h-2 mb-2">
               <div className="bg-primary h-2 rounded-lg w-[75%]"></div>
             </div>
             <p className="text-xs text-text-muted text-right">Analyzing 452 leads...</p>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
