import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Mail, User, Building, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.fullName || !formData.email || !formData.companyName) {
      setError('Please fill in all required fields.');
      return;
    }

    // Ensure we do not fake success if the backend is not implemented
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error("Demo scheduling backend is currently unavailable. Please try again later.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex bg-white font-sans items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main mb-4">Request Received!</h2>
          <p className="text-text-muted text-lg mb-8">
            Thank you for your interest. Our team will be in touch with you shortly to schedule your personalized demo.
          </p>
          <Link to="/">
            <button className="py-3 px-8 btn-primary text-sm font-medium rounded-xl">
              Return Home
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

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
            Book a Demo
          </h2>
          <p className="text-text-muted text-sm font-light mb-8">
            See how SalesPilot can automate your sales and grow your revenue.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
               <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
               <p className="text-sm text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
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
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">
                Work Email <span className="text-red-500">*</span>
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
              <label htmlFor="companyName" className="block text-sm font-medium text-text-main mb-1.5">
                Company <span className="text-red-500">*</span>
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

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-main mb-1.5">
                Message / Requirements
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-text-muted" aria-hidden="true" />
                </div>
                <textarea
                  id="message" name="message" rows="4"
                  value={formData.message} onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm bg-bg-secondary resize-none"
                  placeholder="Tell us what you're looking for..."
                />
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
                    <span>Request Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            
          </form>
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
          <h3 className="text-3xl font-bold tracking-tight mb-4">See SalesPilot in Action</h3>
          <p className="text-text-muted text-lg font-light leading-relaxed">
            Get a personalized walkthrough of our AI engine and discover how it can transform your sales process.
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default DemoPage;
