import React, { useState } from 'react';
import { Settings, Users, Shield, Activity, Building, Lock } from 'lucide-react';
// import { motion } from 'framer-motion';
import { Window } from './Window';

import OrganizationSettings from '../pages/settings/OrganizationSettings';
import TeamManagement from '../pages/settings/TeamManagement';
import RoleManagement from '../pages/settings/RoleManagement';
import AuditLogViewer from '../pages/settings/AuditLogViewer';
import SecuritySettings from '../pages/settings/SecuritySettings';

export const SettingsApp = ({ id, isActive, onFocus, onClose }) => {
  const [activeTab, setActiveTab] = useState('organization');

  const tabs = [
    { id: 'organization', label: 'Organization', icon: Building },
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
      <div className="flex h-full bg-gray-50/50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col pt-4">
          <div className="px-6 mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Settings size={20} className="mr-2 text-gray-700" />
              Settings
            </h2>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} className={`mr-3 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
           {activeTab === 'organization' && <OrganizationSettings />}
           {activeTab === 'team' && <TeamManagement />}
           {activeTab === 'roles' && <RoleManagement />}
           {activeTab === 'audit' && <AuditLogViewer />}
           {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </Window>
  );
};
