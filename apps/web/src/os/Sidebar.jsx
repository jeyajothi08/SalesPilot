import React from 'react';
import { 
  Bot, Users, Phone, Mail, MessageSquare, 
  Network, LayoutDashboard, Settings, Search, 
  UserCheck, LogOut, ChevronRight, Sparkles
} from 'lucide-react';
import { logout } from '../api/apiClient';

export const Sidebar = ({ activeApp, onOpenApp, isCollapsed, onToggleCollapse }) => {
  const navItems = [
    { id: 'agents', label: 'AI Agents', icon: <Bot className="w-4 h-4 text-purple-400" /> },
    { id: 'crm', label: 'CRM Engine', icon: <Users className="w-4 h-4 text-blue-400" /> },
    { id: 'leads', label: 'Leads', icon: <UserCheck className="w-4 h-4 text-emerald-400" />, appId: 'crm' },
    { id: 'contacts', label: 'Contacts', icon: <Users className="w-4 h-4 text-teal-400" />, appId: 'crm' },
    { id: 'voice', label: 'Calling Workspace', icon: <Phone className="w-4 h-4 text-emerald-400" />, appId: 'voice' },
    { id: 'communication', label: 'Email', icon: <Mail className="w-4 h-4 text-amber-400" />, appId: 'communication' },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4 text-indigo-400" />, appId: 'communication' },
    { id: 'workflow', label: 'Workflows', icon: <Network className="w-4 h-4 text-cyan-400" />, appId: 'workflow' },
    { id: 'analytics', label: 'Analytics', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />, appId: 'analytics' },
  ];

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/login';
  };

  const handleSearchClick = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <aside 
      className={`h-full bg-[#070B18]/95 border-r border-slate-800 flex flex-col justify-between shrink-0 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Brand & Search */}
      <div className="p-4 space-y-4">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            {!isCollapsed && (
              <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                SalesPilot<span className="text-blue-400">.os</span>
              </span>
            )}
          </div>
        </div>

        {/* Global Quick Search Button */}
        <button
          onClick={handleSearchClick}
          className={`w-full bg-[#0F172A] hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all cursor-pointer flex items-center ${
            isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2 justify-between'
          }`}
          title="Search Workspace (⌘K)"
        >
          <div className="flex items-center space-x-2.5 text-slate-400">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            {!isCollapsed && <span className="text-xs font-medium">Quick Search...</span>}
          </div>
          {!isCollapsed && (
            <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 rounded">
              ⌘K
            </kbd>
          )}
        </button>

      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
            WORKSPACE
          </p>
        )}

        {navItems.map((item) => {
          const targetAppId = item.appId || item.id;
          const isActive = activeApp === targetAppId;

          return (
            <button
              key={item.id}
              onClick={() => onOpenApp(targetAppId)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                isActive
                  ? 'bg-blue-600/15 border border-blue-500/40 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              )}
            </button>
          );
        })}

        <div className="my-3 border-t border-slate-800/80" />

        {!isCollapsed && (
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
            SYSTEM
          </p>
        )}

        <button
          onClick={() => onOpenApp('settings')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
            activeApp === 'settings'
              ? 'bg-blue-600/15 border border-blue-500/40 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
          }`}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </button>

      </div>

      {/* Bottom User / Account Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#050816]/60">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-600 p-0.5 shrink-0">
                <div className="w-full h-full bg-[#0A0E1A] rounded-md flex items-center justify-center text-xs font-bold text-white">
                  S
                </div>
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">Sales Workspace</p>
                <p className="text-[10px] text-slate-400 truncate">admin@salespilot.ai</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
