import React, { useState } from 'react';
import { Shield, Plus } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans flex flex-col h-full overflow-hidden text-[#F8FAFC]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC]">Roles & Permissions</h1>
          <p className="text-[#94A3B8] mt-1 text-sm">Configure custom roles and manage granular access control across the platform.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
          <Plus size={16} className="mr-2" /> Create Custom Role
        </button>
      </div>

      <div className="flex flex-1 min-h-0 space-x-6">
        {/* Roles List */}
        <div className="w-1/3 bg-[#0F172A] rounded-2xl border border-[#1E293B] flex flex-col overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#1E293B] bg-[#070B14]">
            <h2 className="font-extrabold text-[#F8FAFC] flex items-center">
              <Shield size={16} className="mr-2 text-[#3B82F6]" /> Active Roles
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#1E293B] p-2">
            {roles.map(role => (
              <div key={role.id} className="p-4 rounded-xl hover:bg-[#1E293B]/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#60A5FA] transition-colors">{role.name}</h3>
                  <span className="text-[10px] font-semibold bg-[#070B14] text-[#94A3B8] border border-[#263247] px-2 py-0.5 rounded-full">
                    {role.users} Users
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{role.desc}</p>
                <div className="mt-2 text-[10px] text-[#64748B] font-semibold">
                  {role.isCustom ? 'Custom Role' : 'System Default (Read Only)'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 bg-[#0F172A] rounded-2xl border border-[#1E293B] flex flex-col overflow-hidden shadow-xl">
           <div className="p-6 border-b border-[#1E293B] bg-[#070B14] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#F8FAFC]">Sales Exec Permissions</h2>
                <p className="text-sm text-[#94A3B8]">Configure access levels for this role across platform modules.</p>
              </div>
              <button className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-xl transition-colors shadow-md cursor-pointer">
                 Save Permissions
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#050816]">
              {permissions.map((module) => (
                <div key={module.module} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-md">
                  <div className="bg-[#070B14] px-4 py-3 border-b border-[#1E293B]">
                    <h4 className="font-bold text-[#F8FAFC] text-sm">{module.module}</h4>
                  </div>
                  <div className="divide-y divide-[#1E293B]">
                    {module.scopes.map(scope => (
                      <div key={scope} className="flex items-center justify-between p-4 hover:bg-[#1E293B]/40 transition-colors">
                         <div>
                            <p className="text-sm font-semibold text-[#F8FAFC]">{scope.split(':')[1].charAt(0).toUpperCase() + scope.split(':')[1].slice(1)} Access</p>
                            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">{scope}</p>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={scope.includes('read') || scope === 'crm:write'} />
                            <div className="w-11 h-6 bg-[#070B14] border border-[#263247] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-[#94A3B8] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB] peer-checked:after:bg-white"></div>
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
