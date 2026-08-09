import React from 'react';
import { ShieldCheck, HardDrive, Smartphone, Monitor, RefreshCw, DownloadCloud } from 'lucide-react';

const SecurityAndBackup = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
      
      {/* Security */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col">
         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
           <ShieldCheck className="w-4 h-4 text-green-500" />
           Security & Sessions
         </h3>

         <div className="p-5 bg-bg-primary rounded-2xl border border-border mb-6 flex items-center justify-between">
            <div>
               <h4 className="font-bold text-text-main text-sm mb-1">Two-Factor Authentication</h4>
               <p className="text-xs text-text-muted">Require 2FA for all administrator accounts.</p>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
               <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
         </div>

         <h4 className="text-sm font-bold text-text-main mb-4">Active Sessions</h4>
         <div className="space-y-3 flex-1 overflow-y-auto">
            <SessionRow icon={<Monitor className="w-4 h-4 text-text-muted" />} device="MacBook Pro" location="San Francisco, CA" current={true} />
            <SessionRow icon={<Smartphone className="w-4 h-4 text-text-muted" />} device="iPhone 14 Pro" location="San Francisco, CA" />
            <SessionRow icon={<Monitor className="w-4 h-4 text-text-muted" />} device="Windows PC" location="New York, NY" />
         </div>
      </div>

      {/* Backup */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col">
         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
           <HardDrive className="w-4 h-4 text-primary" />
           System Backups
         </h3>

         <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="p-4 bg-bg-primary rounded-2xl border border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
               <RefreshCw className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
               <span className="text-sm font-bold text-text-main">Manual Backup</span>
            </button>
            <button className="p-4 bg-bg-primary rounded-2xl border border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 group text-center">
               <DownloadCloud className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
               <span className="text-sm font-bold text-text-main">Restore Backup</span>
            </button>
         </div>

         <h4 className="text-sm font-bold text-text-main mb-4">Backup History</h4>
         <div className="space-y-3 flex-1 overflow-y-auto">
            <BackupRow name="Auto Backup - Daily" size="1.2 GB" date="Today, 02:00 AM" status="Success" />
            <BackupRow name="Manual Pre-deployment" size="1.1 GB" date="Oct 12, 14:30 PM" status="Success" />
            <BackupRow name="Auto Backup - Daily" size="1.1 GB" date="Oct 11, 02:00 AM" status="Success" />
         </div>
      </div>

    </div>
  );
};

const SessionRow = ({ icon, device, location, current }) => (
  <div className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-border">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-bg-secondary rounded-lg border border-border">{icon}</div>
      <div>
        <p className="text-sm font-bold text-text-main flex items-center gap-2">
          {device}
          {current && <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Current</span>}
        </p>
        <p className="text-xs text-text-muted">{location}</p>
      </div>
    </div>
    {!current && <button className="text-xs font-bold text-red-500 hover:underline">Revoke</button>}
  </div>
);

const BackupRow = ({ name, size, date, status }) => (
  <div className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-border">
    <div>
      <p className="text-sm font-bold text-text-main">{name}</p>
      <p className="text-xs text-text-muted">{date} • {size}</p>
    </div>
    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20 uppercase tracking-wider">{status}</span>
  </div>
);

export default SecurityAndBackup;
