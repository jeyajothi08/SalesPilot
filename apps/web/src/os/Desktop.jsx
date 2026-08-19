import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, Sparkles, Search } from 'lucide-react';
import { AnimatedBackground } from '../design-system/motion/global/AnimatedBackground';
import { CustomCursor } from '../design-system/motion/global/CustomCursor';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { CRMApp } from './CRMApp';
import { VoiceApp } from './VoiceApp';
import { CommunicationApp } from './CommunicationApp';
import { AnalyticsApp } from './AnalyticsApp';
import { CopilotApp } from './CopilotApp';
import { WorkflowBuilderApp } from './apps/workflow/WorkflowBuilderApp';
import { BillingApp } from './apps/billing/BillingApp';
import { MarketingAppWindow } from './MarketingAppWindow';
import { SettingsApp } from './SettingsApp';
import { ProposalsApp } from './ProposalsApp';
import { AgentCenterApp } from './AgentCenterApp';
import { CopilotChat } from '../components/ai/CopilotChat';
import { logout } from '../api/apiClient';

export const Desktop = () => {
  const [openApps, setOpenApps]           = useState([{ id: 'crm' }]);
  const [activeApp, setActiveApp]         = useState('crm');
  const [showCopilot, setShowCopilot]     = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Map route on mount and listen to global open-app events
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/calling') || path.includes('/voice')) {
      handleOpenApp('voice');
    } else if (path.includes('/email') || path.includes('/messages') || path.includes('/inbox')) {
      handleOpenApp('communication');
    } else if (path.includes('/workflows')) {
      handleOpenApp('workflow');
    } else if (path.includes('/analytics')) {
      handleOpenApp('analytics');
    } else if (path.includes('/settings')) {
      handleOpenApp('settings');
    } else if (path.includes('/billing')) {
      handleOpenApp('billing');
    } else if (path.includes('/crm') || path.includes('/leads') || path.includes('/contacts')) {
      handleOpenApp('crm');
    }

    const handleCallEvent = (_e) => {
      handleOpenApp('voice');
    };
    const handleOpenAppEvent = (e) => {
      if (e.detail) handleOpenApp(e.detail);
    };
    window.addEventListener('open-call-workspace', handleCallEvent);
    window.addEventListener('open-app', handleOpenAppEvent);
    return () => {
      window.removeEventListener('open-call-workspace', handleCallEvent);
      window.removeEventListener('open-app', handleOpenAppEvent);
    };
  }, []);

  const handleOpenApp = (appId) => {
    if (!openApps.find(app => app.id === appId)) {
      setOpenApps(prev => [...prev, { id: appId }]);
    }
    setActiveApp(appId);
  };

  const handleCloseApp = (appId) => {
    setOpenApps(prev => prev.filter(app => app.id !== appId));
    setActiveApp(prev => (prev === appId ? null : prev));
  };

  const handleFocusApp = (appId) => setActiveApp(appId);

  const getActiveTitle = () => {
    switch (activeApp) {
      case 'crm': return 'CRM Engine';
      case 'voice': return 'Voice Calling Workspace';
      case 'communication': return 'Email & Communications';
      case 'workflow': return 'Workflow Automation Studio';
      case 'analytics': return 'Analytics & BI';
      case 'agents': return 'AI Agent Center';
      case 'settings': return 'System Settings';
      case 'billing': return 'Billing & Subscriptions';
      default: return 'SalesPilot Workspace';
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050816] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white">

      {/* OS Level Globals */}
      <CustomCursor />
      <AnimatedBackground />
      <CommandPalette onOpenApp={handleOpenApp} />

      {/* ── TOP HEADER BAR ────────────────────────────────────────────────── */}
      <header className="h-12 bg-[#070B18]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 z-50 shrink-0 select-none">
        
        {/* Left Side: Collapse Toggle + Active Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarCollapsed(v => !v)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400">SalesPilot</span>
            <span className="text-xs text-slate-600">/</span>
            <span className="text-xs font-bold text-white tracking-wide">{getActiveTitle()}</span>
          </div>
        </div>

        {/* Center: Search Quick Action */}
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-full text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">Search deals, leads, actions...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-900 border border-slate-800 rounded text-slate-400">⌘K</kbd>
        </button>

        {/* Right Side: Copilot Toggle & Clock */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCopilot(v => !v)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 border cursor-pointer ${
              showCopilot
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-sm shadow-blue-500/20'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle AI Copilot Side Panel"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Copilot</span>
          </button>

          <span className="text-xs font-mono font-medium text-slate-400 hidden md:inline">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

      </header>

      {/* ── MAIN WORKSPACE FLEX CONTAINER ─────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Persistent Sidebar */}
        <Sidebar
          activeApp={activeApp}
          onOpenApp={handleOpenApp}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(v => !v)}
        />

        {/* Center Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#050816] relative">
          <div className="relative w-full h-full">
            <AnimatePresence>
              {openApps
                .filter(app => app.id !== 'workflow') /* workflow renders full-screen studio */
                .map(app => {
                const props = {
                  id:       app.id,
                  isActive: activeApp === app.id,
                  onFocus:  () => handleFocusApp(app.id),
                  onClose:  () => handleCloseApp(app.id),
                };

                if (app.id === 'agents')        return <AgentCenterApp   key={app.id} {...props} />;
                if (app.id === 'crm')           return <CRMApp           key={app.id} {...props} />;
                if (app.id === 'voice')         return <VoiceApp         key={app.id} {...props} />;
                if (app.id === 'communication') return <CommunicationApp key={app.id} {...props} />;
                if (app.id === 'analytics')     return <AnalyticsApp     key={app.id} {...props} />;
                if (app.id === 'copilot')       return <CopilotApp       key={app.id} {...props} />;
                if (app.id === 'billing')       return <BillingApp       key={app.id} {...props} />;
                if (app.id === 'marketing')     return <MarketingAppWindow key={app.id} {...props} />;
                if (app.id === 'settings')      return <SettingsApp      key={app.id} {...props} />;
                if (app.id === 'proposals')     return <ProposalsApp     key={app.id} {...props} />;
                return null;
              })}
            </AnimatePresence>
          </div>
        </main>

        {/* Right Side-by-Side AI Copilot Panel */}
        <AnimatePresence>
          {showCopilot && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="h-full border-l border-slate-800 bg-[#070B18] shrink-0 overflow-hidden z-30 hidden lg:block"
            >
              <CopilotChat inline={true} onClose={() => setShowCopilot(false)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Full Screen Studio Overlay (Workflows) */}
      <AnimatePresence>
        {openApps.find(a => a.id === 'workflow') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-90 bg-[#050816]"
          >
            <WorkflowBuilderApp onClose={() => handleCloseApp('workflow')} />
            <button
              onClick={() => handleCloseApp('workflow')}
              className="absolute top-4 left-4 z-100 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-full hover:bg-black transition-colors cursor-pointer"
            >
              ← Close Workflow Studio
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Desktop;
