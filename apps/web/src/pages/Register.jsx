import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Mail, Lock, User, Building, Phone, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { setTokens } from '../api/apiClient';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      setError('Please resolve the errors below to create your account.');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.register(
        formData.email.trim(), 
        formData.password, 
        formData.fullName.trim(), 
        formData.companyName.trim()
      );
      
      // Auto login after register
      const { access_token, refresh_token } = await authAPI.login(
        formData.email.trim(), 
        formData.password
      );
      
      setTokens(access_token, refresh_token);
      navigate('/app', { replace: true });
    } catch (err) {
      console.error('[Register] Registration error:', err);
      const detail = err.response?.data?.detail || err.message || 'Registration failed. Please try again.';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#050816] font-sans text-[#F8FAFC] relative overflow-x-hidden">
      
      {/* Subtle Ambient Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-[#2563EB]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-accent-purple/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Area - Full Dark Registration Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 relative z-10 overflow-y-auto bg-[#070B14]/60 backdrop-blur-md min-h-screen">
        
        <div className="w-full max-w-145 mx-auto">
          
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
            Create your account
          </h1>
          <p className="text-[#94A3B8] text-base font-normal mb-8">
            Start automating your sales process in minutes.
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

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            
            {/* Row 1: Full Name & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                  Full Name <span className="text-[#EF4444] font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    aria-invalid={!!fieldErrors.fullName}
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 h-13 bg-[#0F172A] border ${
                      fieldErrors.fullName 
                        ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/30' 
                        : 'border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20'
                    } rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner`}
                    placeholder="John Doe"
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1.5 text-xs text-[#F87171] font-medium">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                  Company <span className="text-[#EF4444] font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Building className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    aria-invalid={!!fieldErrors.companyName}
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 h-13 bg-[#0F172A] border ${
                      fieldErrors.companyName 
                        ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/30' 
                        : 'border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20'
                    } rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner`}
                    placeholder="Acme Corp"
                  />
                </div>
                {fieldErrors.companyName && (
                  <p className="mt-1.5 text-xs text-[#F87171] font-medium">{fieldErrors.companyName}</p>
                )}
              </div>

            </div>

            {/* Row 2: Work Email & Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Work Email */}
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
                    aria-invalid={!!fieldErrors.email}
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 h-13 bg-[#0F172A] border ${
                      fieldErrors.email 
                        ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/30' 
                        : 'border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20'
                    } rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner`}
                    placeholder="john@acme.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-[#F87171] font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                  Phone Number <span className="text-xs text-[#94A3B8] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 h-13 bg-[#0F172A] border border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Password */}
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
                    autoComplete="new-password"
                    required
                    aria-invalid={!!fieldErrors.password}
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 h-13 bg-[#0F172A] border ${
                      fieldErrors.password 
                        ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/30' 
                        : 'border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20'
                    } rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner`}
                    placeholder="Create a password"
                  />
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-[#F87171] font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#E2E8F0] mb-1.5">
                  Confirm Password <span className="text-[#EF4444] font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    aria-invalid={!!fieldErrors.confirmPassword}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 h-13 bg-[#0F172A] border ${
                      fieldErrors.confirmPassword 
                        ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/30' 
                        : 'border-[#263247] hover:border-slate-600 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20'
                    } rounded-xl text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none transition-all shadow-inner`}
                    placeholder="Confirm your password"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-[#F87171] font-medium">{fieldErrors.confirmPassword}</p>
                )}
              </div>

            </div>

            {/* Create Account Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center space-x-2.5 h-13 bg-linear-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] active:scale-[0.99] text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed border border-blue-400/30 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            
            {/* Terms of Service & Privacy Policy */}
            <p className="text-xs text-[#64748B] text-center leading-relaxed mt-5">
               By creating an account, you agree to our{' '}
               <a href="#" onClick={(e) => e.preventDefault()} className="text-[#60A5FA] hover:underline font-semibold">
                 Terms of Service
               </a>{' '}
               and{' '}
               <a href="#" onClick={(e) => e.preventDefault()} className="text-[#60A5FA] hover:underline font-semibold">
                 Privacy Policy
               </a>.
            </p>
          </form>

          {/* Sign in Footer */}
          <p className="mt-8 text-center text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#60A5FA] hover:underline transition-colors">
              Sign in
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
            Your 24×7 AI Sales Employee
          </h2>
          
          <p className="text-[#CBD5E1] text-sm font-normal leading-relaxed mb-8">
            Close deals while you sleep. Build your custom AI agent and watch your revenue grow.
          </p>
          
          {/* Bottom Stats */}
          <div className="grid grid-cols-2 gap-4 w-full">
             <div className="bg-slate-800/55 border border-slate-400/15 p-4 rounded-2xl text-center backdrop-blur-md">
                <p className="text-3xl font-extrabold text-[#3B82F6]">3x</p>
                <p className="text-xs font-medium text-[#94A3B8] mt-1">More Meetings</p>
             </div>
             <div className="bg-slate-800/55 border border-slate-400/15 p-4 rounded-2xl text-center backdrop-blur-md">
                <p className="text-3xl font-extrabold text-[#A855F7]">24/7</p>
                <p className="text-xs font-medium text-[#94A3B8] mt-1">Lead Follow-up</p>
             </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Register;
