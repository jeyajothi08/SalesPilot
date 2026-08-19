import React, { useState } from 'react';
import { Settings, Users, Shield, Activity, Building, Lock, Zap } from 'lucide-react';
import { Window } from './Window';

import OrganizationSettings from '../pages/settings/OrganizationSettings';
import TeamManagement from '../pages/settings/TeamManagement';
import RoleManagement from '../pages/settings/RoleManagement';
import AuditLogViewer from '../pages/settings/AuditLogViewer';
import SecuritySettings from '../pages/settings/SecuritySettings';
import IntegrationsSettings from '../pages/settings/IntegrationsSettings';

export const SettingsApp = ({ id, isActive, onFocus, onClose }) => {
  const [activeTab, setActiveTab] = useState('organization');

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'integrations', label: 'Integrations & Telephony', icon: Zap },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <Window
      id={id}
      title="Enterprise Settings"
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      defaultWidth={1000}
      defaultHeight={700}
    >
      <div className="flex h-full bg-[#050816] text-[#F8FAFC]">
        {/* Sidebar */}
        <div className="w-64 bg-[#070B18]/80 border-r border-slate-800 flex flex-col pt-4">
          <div className="px-6 mb-4">
            <h2 className="text-base font-bold text-white flex items-center">
              <Settings size={18} className="mr-2 text-[#3B82F6]" />
              Settings
            </h2>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border-none ${
                  activeTab === tab.id 
                    ? 'bg-[#2563EB]/20 border border-[#3B82F6]/40 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <tab.icon size={16} className={`mr-3 ${activeTab === tab.id ? 'text-[#3B82F6]' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#050816] custom-scrollbar">
           {activeTab === 'organization' && <OrganizationSettings />}
           {activeTab === 'integrations' && <IntegrationsSettings />}
           {activeTab === 'team' && <TeamManagement />}
           {activeTab === 'roles' && <RoleManagement />}
           {activeTab === 'audit' && <AuditLogViewer />}
           {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </Window>
  );
};
