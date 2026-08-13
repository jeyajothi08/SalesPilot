import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedBackground } from '../design-system/motion/global/AnimatedBackground';
import { CustomCursor } from '../design-system/motion/global/CustomCursor';
import { SmartDock } from './SmartDock';
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

// ── Simple dropdown menu ──────────────────────────────────────────────────────
const MenuDropdown = ({ items, onClose }) => (
  <div className="absolute top-full left-0 mt-1 min-w-45 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-300 py-1 overflow-hidden">
    {items.map((item, i) =>
      item === 'divider' ? (
        <div key={i} className="h-px bg-white/10 my-1" />
      ) : (
        <button
          key={i}
          onClick={() => { item.action(); onClose(); }}
          className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          {item.label}
        </button>
      )
    )}
  </div>
);

export const Desktop = () => {
  const [openApps, setOpenApps]       = useState([{ id: 'crm' }]);
  const [activeApp, setActiveApp]     = useState('crm');
  const [showCopilot, setShowCopilot] = useState(true);
  const [openMenu, setOpenMenu]       = useState(null); // 'file' | 'edit' | 'view' | 'ai'
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Listen for global custom events (e.g. open-call-workspace from Customer 360 or Command Palette)
  useEffect(() => {
    const handleCallEvent = (_e) => {
      handleOpenApp('voice');
    };
    window.addEventListener('open-call-workspace', handleCallEvent);
    return () => window.removeEventListener('open-call-workspace', handleCallEvent);
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

  // ── Top menu definitions ──────────────────────────────────────────────────
  const menus = {
    file: [
      { label: 'New Workflow',       action: () => handleOpenApp('workflow') },
      { label: 'Open CRM',           action: () => handleOpenApp('crm') },
      { label: 'Open Analytics',     action: () => handleOpenApp('analytics') },
      'divider',
      { label: 'Settings',           action: () => handleOpenApp('settings') },
      'divider',
      { label: 'Sign Out',           action: async () => { await logout(); window.location.href = '/login'; } },
    ],
    edit: [
      { label: 'Command Palette (⌘K)', action: () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })) },
    ],
    view: [
      { label: 'Agent Center (AI Sales)', action: () => handleOpenApp('agents') },
      { label: 'CRM Pipeline',       action: () => handleOpenApp('crm') },
      { label: 'Analytics & BI',     action: () => handleOpenApp('analytics') },
      { label: 'Voice Calls',        action: () => handleOpenApp('voice') },
      { label: 'Communications',     action: () => handleOpenApp('communication') },
      { label: 'Billing',            action: () => handleOpenApp('billing') },
      { label: 'Marketing',          action: () => handleOpenApp('marketing') },
      { label: 'Workflow Builder',   action: () => handleOpenApp('workflow') },
    ],
    ai: [
      { label: 'Open Agent Center', action: () => handleOpenApp('agents') },
      { label: showCopilot ? 'Hide Copilot Chat' : 'Show Copilot Chat', action: () => setShowCopilot(v => !v) },
      { label: 'Open AI Copilot App', action: () => handleOpenApp('copilot') },
      'divider',
      { label: 'Open Workflow Builder', action: () => handleOpenApp('workflow') },
    ],
  };

  const menuLabels = [
    { key: 'file', label: 'File' },
    { key: 'edit', label: 'Edit' },
    { key: 'view', label: 'View' },
    { key: 'ai',   label: 'AI Copilot' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black selection:bg-ds-accent selection:text-white">

      {/* OS Level Globals */}
      <CustomCursor />
      <AnimatedBackground />
      <CommandPalette onOpenApp={handleOpenApp} />

      {/* Top Menu Bar (MacOS style) */}
      <div className="absolute top-0 left-0 w-full h-8 bg-black/20 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 text-xs font-bold text-white/70">
        <div className="flex items-center gap-1" ref={menuRef}>
          <span className="text-white mr-3 font-extrabold tracking-tight">SalesPilot OS</span>

          {menuLabels.map(({ key, label }) => (
            <div key={key} className="relative">
              <button
                onClick={() => setOpenMenu(prev => prev === key ? null : key)}
                className={`px-2.5 py-0.5 rounded transition-colors ${
                  openMenu === key
                    ? 'bg-white/20 text-white'
                    : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </button>
              {openMenu === key && (
                <MenuDropdown
                  items={menus[key]}
                  onClose={() => setOpenMenu(null)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCopilot(v => !v)}
            className="hover:text-white transition-colors"
            title="Toggle AI Copilot"
          >
            {showCopilot ? '◉ Copilot' : '○ Copilot'}
          </button>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* The Desktop Canvas for Windows */}
      <div className="absolute inset-0 pt-8 pb-24 overflow-hidden">
        <div className="relative w-full h-full">
          <AnimatePresence>
            {openApps
              .filter(app => app.id !== 'workflow') /* workflow is rendered full-screen separately */
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
      </div>

      {/* Full Screen Apps (Bypass Window Wrapper) */}
      <AnimatePresence>
        {openApps.find(a => a.id === 'workflow') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-90"
          >
            <WorkflowBuilderApp onClose={() => handleCloseApp('workflow')} />
            <button
              onClick={() => handleCloseApp('workflow')}
              className="absolute top-4 left-4 z-100 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-black transition-colors"
            >
              ← Close Studio
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OS Level Dock */}
      <SmartDock onAppClick={handleOpenApp} openApps={openApps.map(a => a.id)} />

      {/* Global AI Copilot Chat */}
      <AnimatePresence>
        {showCopilot && (
          <CopilotChat onClose={() => setShowCopilot(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Desktop;
