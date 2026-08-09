import React, { useState } from 'react';
import { Shield, Plus, MoreVertical, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoleManagement() {
  const [roles] = useState([
    { id: 1, name: 'Super Admin', isCustom: false, users: 1, desc: 'Full access to all settings and billing.' },
    { id: 2, name: 'Sales Exec', isCustom: true, users: 15, desc: 'Can manage deals, leads, and outbound campaigns.' },
    { id: 3, name: 'Support Agent', isCustom: true, users: 8, desc: 'Can manage inbox, live chat, and customer profiles.' }
  ]);

  const [permissions] = useState([
    { module: 'CRM', scopes: ['crm:read', 'crm:write', 'crm:delete'] },
    { module: 'Communication', scopes: ['comm:inbox', 'comm:send', 'comm:campaigns'] },
    { module: 'Billing', scopes: ['billing:read', 'billing:manage'] },
    { module: 'Settings', scopes: ['org:read', 'org:write', 'users:manage', 'roles:manage'] }
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-500 mt-1">Configure custom roles and manage granular access control across the platform.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-500/20">
          <Plus size={16} className="mr-2" /> Create Custom Role
        </button>
      </div>

      <div className="flex flex-1 min-h-0 space-x-6">
        {/* Roles List */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-semibold text-gray-800 flex items-center">
              <Shield size={16} className="mr-2 text-blue-600" /> Active Roles
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
            {roles.map(role => (
              <div key={role.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{role.name}</h3>
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {role.users} Users
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{role.desc}</p>
                <div className="mt-2 text-[10px] text-gray-400 font-medium">
                  {role.isCustom ? 'Custom Role' : 'System Default (Read Only)'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Sales Exec Permissions</h2>
                <p className="text-sm text-gray-500">Configure access levels for this role across platform modules.</p>
              </div>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                 Save Permissions
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
              {permissions.map((module) => (
                <div key={module.module} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-800">{module.module}</h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {module.scopes.map(scope => (
                      <div key={scope} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                         <div>
                            <p className="text-sm font-medium text-gray-900">{scope.split(':')[1].charAt(0).toUpperCase() + scope.split(':')[1].slice(1)} Access</p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{scope}</p>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={scope.includes('read') || scope === 'crm:write'} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                         </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
