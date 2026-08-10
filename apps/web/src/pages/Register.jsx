import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Mail, Lock, User, Building, Phone, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (pass) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.companyName || !formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and contain a number and an uppercase letter.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.register(formData.email, formData.password, formData.fullName, formData.companyName);
      // Auto login after register
      const { access_token, refresh_token } = await authAPI.login(formData.email, formData.password);
      localStorage.setItem('access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Area - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-24 py-12 relative z-10 overflow-y-auto">
        
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center space-x-2 mb-10">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-2xl font-semibold tracking-tight text-text-main">SalesPilot</span>
          </Link>
          
          <h2 className="text-3xl font-bold tracking-tight text-text-main mb-2">
            Create your account
          </h2>
          <p className="text-text-muted text-sm font-light mb-8">
            Start automating your sales process in minutes.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
               <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
               <p className="text-sm text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label htmlFor="fullName" className="block text-sm font-medium text-text-main mb-1.5">
                   Full Name <span className="text-red-500">*</span>
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <User className="h-5 w-5 text-text-muted" aria-hidden="true" />
                   </div>
                   <input
                     id="fullName" name="fullName" type="text" required
                     value={formData.fullName} onChange={handleChange}
                     className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
                     placeholder="John Doe"
                   />
                 </div>
               </div>

               <div>
                 <label htmlFor="companyName" className="block text-sm font-medium text-text-main mb-1.5">
                   Company Name <span className="text-red-500">*</span>
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Building className="h-5 w-5 text-text-muted" aria-hidden="true" />
                   </div>
                   <input
                     id="companyName" name="companyName" type="text" required
                     value={formData.companyName} onChange={handleChange}
                     className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
                     placeholder="Acme Corp"
                   />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">
                   Email Address <span className="text-red-500">*</span>
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Mail className="h-5 w-5 text-text-muted" aria-hidden="true" />
                   </div>
                   <input
                     id="email" name="email" type="email" required
                     value={formData.email} onChange={handleChange}
                     className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
                     placeholder="john@acme.com"
                   />
                 </div>
               </div>

               <div>
                 <label htmlFor="phone" className="block text-sm font-medium text-text-main mb-1.5">
                   Phone Number
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Phone className="h-5 w-5 text-text-muted" aria-hidden="true" />
                   </div>
                   <input
                     id="phone" name="phone" type="tel"
                     value={formData.phone} onChange={handleChange}
                     className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
                     placeholder="+1 (555) 000-0000"
                   />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1.5">
                   Password <span className="text-red-500">*</span>
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Lock className="h-5 w-5 text-text-muted" aria-hidden="true" />
                   </div>
                   <input
                     id="password" name="password" type="password" required
                     value={formData.password} onChange={handleChange}
                     className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
                     placeholder="••••••••"
                   />
                 </div>
               </div>

               <div>
                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-main mb-1.5">
                   Confirm Password <span className="text-red-500">*</span>
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Lock className="h-5 w-5 text-text-muted" aria-hidden="true" />
                   </div>
                   <input
                     id="confirmPassword" name="confirmPassword" type="password" required
                     value={formData.confirmPassword} onChange={handleChange}
                     className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary"
                     placeholder="••••••••"
                   />
                 </div>
               </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center space-x-2 py-3.5 px-4 btn-primary text-sm font-medium disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-text-muted text-center font-light mt-4">
               By creating an account, you agree to our <span className="text-primary hover:underline cursor-not-allowed">Terms of Service</span> and <span className="text-primary hover:underline cursor-not-allowed">Privacy Policy</span>.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>

      {/* Right Area - AI Illustration */}
      <div className="hidden lg:flex flex-1 relative bg-bg-secondary overflow-hidden items-center justify-center border-l border-border/50">
        <div className="absolute top-[-10%] right-[-10%] w-175 h-175 bg-primary/20 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-accent-purple/20 rounded-full blur-[100px] opacity-70" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg glass-card bg-white/40 p-12 rounded-[40px] border border-white/60 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-32 h-32 rounded-3xl bg-linear-to-tr from-accent-purple to-primary p-1 mb-8 shadow-xl shadow-primary/30">
            <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center">
              <Bot className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight mb-4">Your 24×7 AI Sales Employee</h3>
          <p className="text-text-muted text-lg font-light leading-relaxed">
            Close deals while you sleep. Build your custom AI agent and watch your revenue grow.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-4 w-full">
             <div className="glass-card bg-white/80 p-4 rounded-2xl text-center border border-white/60">
                <p className="text-3xl font-bold text-primary">3x</p>
                <p className="text-xs text-text-muted mt-1">More Meetings</p>
             </div>
             <div className="glass-card bg-white/80 p-4 rounded-2xl text-center border border-white/60">
                <p className="text-3xl font-bold text-accent-purple">24/7</p>
                <p className="text-xs text-text-muted mt-1">Lead Follow-up</p>
             </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Register;
