import React from 'react';
import { CreditCard, Settings, Building, Palette, Globe, FileText } from 'lucide-react';

const SubscriptionAndSettings = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
      
      {/* Subscription */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col">
         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
           <CreditCard className="w-4 h-4 text-purple-500" />
           Subscription & Billing
         </h3>

         <div className="p-6 bg-gradient-to-br from-purple-500/10 to-bg-primary rounded-2xl border border-purple-500/20 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <CreditCard className="w-24 h-24 text-purple-500 transform rotate-12" />
            </div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2 relative z-10">Current Plan</h4>
            <div className="flex items-end gap-3 mb-4 relative z-10">
               <h2 className="text-4xl font-extrabold text-text-main tracking-tight">Enterprise</h2>
               <span className="text-sm font-bold text-text-muted mb-1">$999/mo</span>
            </div>
            <div className="flex gap-3 relative z-10">
               <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md transition-colors">Upgrade Plan</button>
               <button className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-text-main text-sm font-bold hover:bg-bg-secondary/80 transition-colors">Manage Billing</button>
            </div>
         </div>

         <h4 className="text-sm font-bold text-text-main mb-4">Recent Invoices</h4>
         <div className="space-y-3 flex-1 overflow-y-auto">
            <InvoiceRow id="INV-2026-10" amount="$999.00" date="Oct 01, 2026" status="Paid" />
            <InvoiceRow id="INV-2026-09" amount="$999.00" date="Sep 01, 2026" status="Paid" />
            <InvoiceRow id="INV-2026-08" amount="$999.00" date="Aug 01, 2026" status="Paid" />
         </div>
      </div>

      {/* Settings Options */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col">
         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
           <Settings className="w-4 h-4 text-text-muted" />
           Platform Settings
         </h3>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <SettingCard icon={<Building className="w-5 h-5" />} title="Company Profile" desc="Address, TAX ID, Info" />
            <SettingCard icon={<Palette className="w-5 h-5" />} title="Branding" desc="Logos, Colors, Domain" />
            <SettingCard icon={<Globe className="w-5 h-5" />} title="Localization" desc="Language & Timezone" />
            <SettingCard icon={<FileText className="w-5 h-5" />} title="Legal Docs" desc="Terms, Privacy Policy" />
         </div>
      </div>

    </div>
  );
};

const InvoiceRow = ({ id, amount, date, status }) => (
  <div className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-border">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-bg-secondary rounded-lg border border-border"><FileText className="w-4 h-4 text-text-muted" /></div>
      <div>
        <p className="text-sm font-bold text-text-main">{id}</p>
        <p className="text-xs text-text-muted">{date}</p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1">
       <span className="text-sm font-bold text-text-main">{amount}</span>
       <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20 uppercase tracking-wider">{status}</span>
    </div>
  </div>
);

const SettingCard = ({ icon, title, desc }) => (
  <div className="p-4 bg-bg-primary rounded-2xl border border-border hover:border-primary/50 transition-colors cursor-pointer group flex items-start gap-3">
     <div className="p-2 bg-bg-secondary rounded-xl border border-border group-hover:text-primary transition-colors">
        {icon}
     </div>
     <div>
        <h4 className="font-bold text-text-main text-sm mb-0.5 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-text-muted">{desc}</p>
     </div>
  </div>
);

export default SubscriptionAndSettings;
