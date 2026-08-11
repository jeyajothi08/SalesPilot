import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './landing/components/Navbar';
import { Footer } from './landing/components/Footer';
import {
  Bot,
  ArrowRight,
  Phone,
  Users,
  FileText,
  Play,
  ShieldCheck,
  History,
  GitBranch,
  Sliders,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { WorkflowBuilderApp } from '../os/apps/workflow/WorkflowBuilderApp';
import useWorkflowStore from '../os/apps/workflow/workflowStore';

export const AutomationPage = () => {
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const { setTestModalOpen, setTemplatesModalOpen } = useWorkflowStore();

  const handleOpenTest = () => {
    setIsStudioOpen(true);
    setTimeout(() => {
      setTestModalOpen(true);
    }, 300);
  };

  const handleOpenTemplates = () => {
    setIsStudioOpen(true);
    setTimeout(() => {
      setTemplatesModalOpen(true);
    }, 300);
  };

  return (
    <main className="bg-black text-white min-h-screen selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden flex flex-col relative">
      <Navbar />

      {/* Hero Section */}
      <div className="grow pt-32 pb-16 px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400 uppercase tracking-widest mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          SalesPilot Automation Engine • Active v1.0
        </motion.div>

        {/* Headline & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-3xl mb-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Visual Workflow Builder & Real Execution Engine
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            Automate your entire sales process across <strong className="text-white">Voice Calls, Email, CRM Updates, and Proposal Generation</strong>. Classify intent with AI, evaluate branch routing, enforce human approval gates, and track execution logs live.
          </p>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={() => setIsStudioOpen(true)}
            className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center gap-3 transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>Open Workflow Builder</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleOpenTest}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-2xl flex items-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-green-400 text-green-400" />
            <span>Run Test Execution</span>
          </button>

          <button
            onClick={handleOpenTemplates}
            className="px-6 py-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold rounded-2xl flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sliders className="w-4 h-4" />
            <span>Explore Templates</span>
          </button>
        </motion.div>

        {/* Actual Capability Showcase Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          
          {/* Card 1: Triggers */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">1. Incoming Triggers</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Listen for incoming phone calls and emails. Captures caller phone, name, and speech-to-text transcript payloads in real time.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Incoming Call & Email Triggers
            </div>
          </div>

          {/* Card 2: AI Process Intent */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">2. AI Intent & Branch Routing</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Uses AI service to analyze call transcripts, extract intent categories (<span className="font-mono text-purple-300">proposal_request</span>, <span className="font-mono text-purple-300">sales_inquiry</span>), and conditionally route execution.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-purple-400 font-mono">
              <GitBranch className="w-3.5 h-3.5" /> Conditional Branch Routing
            </div>
          </div>

          {/* Card 3: Update CRM */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">3. Direct CRM Integration</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Mutates actual CRM database records. Automatically advances deal pipeline stages (e.g. to <span className="font-mono text-blue-300">Proposal Sent</span>) and logs activity notes.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-blue-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Database & Pipeline Mutation
            </div>
          </div>

          {/* Card 4: Send Proposal & Approval */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">4. Proposal & Approval Gate</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Generates enterprise proposals and supports human confirmation settings (<span className="font-mono text-yellow-300">requireConfirmation</span>) pausing execution at <span className="font-mono text-yellow-300">Waiting for approval</span>.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Human Approval Control
            </div>
          </div>

          {/* Card 5: Execution Trace & History */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">5. Live Execution Trace Log</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tracks every execution run with node status indicators (<span className="font-mono text-blue-400">running</span> $\rightarrow$ <span className="font-mono text-green-400">success</span>), timestamps, inputs, outputs, and structured logs.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Structured Observability
            </div>
          </div>

          {/* Card 6: Deploy & Version Control */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">6. Deployment & Versioning</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              One-click deployment validates graph completeness, increments workflow versions (<span className="font-mono text-indigo-300">v1, v2</span>), marks active status, and persists to backend API.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> FastAPI & DB Persistence
            </div>
          </div>

        </div>

        {/* Direct Studio Callout Banner */}
        <div className="w-full bg-linear-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to Build Your Sales Automation?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mb-8">
            Launch the visual workflow studio to drag & drop triggers, AI models, and CRM actions onto the interactive React Flow canvas.
          </p>
          <button
            onClick={() => setIsStudioOpen(true)}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-xl flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Launch Workflow Builder Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <Footer />

      {/* Full Screen Workflow Builder App Studio Modal */}
      <AnimatePresence>
        {isStudioOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <WorkflowBuilderApp onClose={() => setIsStudioOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default AutomationPage;
