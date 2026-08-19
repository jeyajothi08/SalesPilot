import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Calendar, Mail, TrendingUp, BarChart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from './landing/components/Navbar';
import { Footer } from './landing/components/Footer';
import { isAuthenticated } from '../api/apiClient';

const FEATURE_DATA = {
  'voice-calling': {
    icon: <Phone className="w-12 h-12 text-blue-500" />,
    title: 'AI Voice Calling',
    desc: 'Human-like conversational AI that dials leads automatically and handles objections gracefully.',
    capabilities: [
      'Sub-second latency text-to-speech models',
      'Realistic filler words and natural pauses',
      'Dynamic objection handling based on CRM data',
      'Automatic call logging and recording'
    ]
  },
  'smart-conversations': {
    icon: <MessageSquare className="w-12 h-12 text-blue-500" />,
    title: 'Smart Conversations',
    desc: 'Understands context, intent, and sentiment to answer complex questions naturally.',
    capabilities: [
      'Context-aware LLM routing',
      'Real-time sentiment analysis',
      'Custom knowledge base integration',
      'Multi-lingual support (50+ languages)'
    ]
  },
  'auto-booking': {
    icon: <Calendar className="w-12 h-12 text-blue-500" />,
    title: 'Auto Booking',
    desc: 'Seamlessly books meetings directly into your Google Calendar or Zoom schedule.',
    capabilities: [
      'Google Calendar & Outlook integration',
      'Automatic timezone conversion',
      'Smart conflict resolution',
      'Zoom/Google Meet link generation'
    ]
  },
  'email-automation': {
    icon: <Mail className="w-12 h-12 text-blue-500" />,
    title: 'Email Automation',
    desc: 'Automatically sends follow-ups, proposals, and thank you notes after calls.',
    capabilities: [
      'Personalized post-call follow-ups',
      'Drip campaign sequencing',
      'Dynamic variable insertion',
      'Open and click tracking'
    ]
  },
  'lead-qualification': {
    icon: <TrendingUp className="w-12 h-12 text-blue-500" />,
    title: 'Lead Qualification',
    desc: 'Intelligently scores and categorizes leads by interest level and potential value.',
    capabilities: [
      'AI-driven lead scoring (0-100)',
      'Automated routing to human reps for hot leads',
      'Intent signal detection',
      'BANT (Budget, Authority, Need, Timeline) extraction'
    ]
  },
  'premium-analytics': {
    icon: <BarChart className="w-12 h-12 text-blue-500" />,
    title: 'Premium Analytics',
    desc: 'Detailed performance reports, conversion metrics, and beautiful charts.',
    capabilities: [
      'Custom dashboard creation',
      'Conversion funnel visualization',
      'Agent performance metrics',
      'Exportable PDF/CSV reports'
    ]
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FeatureDetail = () => {
  const { featureId } = useParams();
  const feature = FEATURE_DATA[featureId];
  const isAuth = isAuthenticated();

  if (!feature) {
    return <Navigate to="/features" replace />;
  }

  return (
    <main className="bg-black text-white min-h-screen selection:bg-blue-500 selection:text-white font-sans overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="grow pt-32 pb-20 px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <Link to="/features" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
            Back to Features
          </Link>
        </div>

        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="bg-white/5 p-10 md:p-16 rounded-[40px] border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-8 border border-white/10">
            {feature.icon}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{feature.title}</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-2xl">
            {feature.desc}
          </p>

          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6">Main Capabilities</h3>
            <motion.ul 
              variants={staggerContainer} initial="hidden" animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {feature.capabilities.map((cap, i) => (
                <motion.li key={i} variants={fadeIn} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                  <span className="text-gray-300 font-medium">{cap}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {featureId === 'voice-calling' && (
              isAuth ? (
                <Link to="/app/calling" className="px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-center font-bold transition-all shadow-lg shadow-emerald-500/25">
                  Open Calling Workspace
                </Link>
              ) : (
                <Link to="/login" state={{ from: { pathname: '/app/calling' } }} className="px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-center font-bold transition-all shadow-lg shadow-emerald-500/25">
                  Open Calling Workspace
                </Link>
              )
            )}

            {isAuth ? (
              <Link to="/app" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-center font-medium transition-colors">Launch OS Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-center font-medium transition-colors">Get Started for Free</Link>
                <Link to="/login" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-center font-medium transition-colors">Log In</Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};

export default FeatureDetail;
