import React from 'react';
import { Activity, Cpu, HardDrive, Zap, CheckCircle2, AlertTriangle, Link2, Link2Off } from 'lucide-react';

const APIs = [
  { name: 'OpenAI', status: 'Connected', usage: '1.2M tokens', latency: '24ms' },
  { name: 'Gemini', status: 'Connected', usage: '450k tokens', latency: '42ms' },
  { name: 'Twilio', status: 'Connected', usage: '14.2k calls', latency: '12ms' },
  { name: 'WhatsApp Business', status: 'Disconnected', usage: '-', latency: '-' },
  { name: 'SendGrid SMTP', status: 'Connected', usage: '8.4k emails', latency: '18ms' },
];

const SystemHealthAndAPIs = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
      
      {/* System Health */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col">
         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
           <Activity className="w-4 h-4 text-green-500" />
           System Health
         </h3>

         <div className="grid grid-cols-2 gap-4 mb-8">
            <HealthMetric icon={<Cpu className="w-5 h-5 text-blue-500" />} label="CPU Usage" value="24%" status="Healthy" />
            <HealthMetric icon={<HardDrive className="w-5 h-5 text-purple-500" />} label="Memory" value="4.2 GB" status="Healthy" />
            <HealthMetric icon={<Zap className="w-5 h-5 text-yellow-500" />} label="Avg Response" value="124ms" status="Optimal" />
            <HealthMetric icon={<Activity className="w-5 h-5 text-green-500" />} label="Uptime" value="99.99%" status="Excellent" />
         </div>

         <h4 className="text-sm font-bold text-text-main mb-4">Core Services</h4>
         <div className="space-y-3 flex-1 overflow-y-auto">
            {['Database', 'AI Engine', 'Email Queue', 'Call Server'].map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-border">
                 <span className="text-sm font-bold text-text-main">{service}</span>
                 <div className="flex items-center gap-2">
                   <span className="text-xs text-text-muted">Operational</span>
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* API Management */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col">
         <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-6">
           <Link2 className="w-4 h-4 text-primary" />
           API Integrations
         </h3>

         <div className="space-y-3 flex-1 overflow-y-auto">
           {APIs.map(api => (
             <div key={api.name} className={`p-4 rounded-2xl border transition-colors ${api.status === 'Connected' ? 'bg-bg-primary border-border hover:border-primary/50' : 'bg-red-500/5 border-red-500/20'}`}>
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2">
                   {api.status === 'Connected' ? <Link2 className="w-4 h-4 text-green-500" /> : <Link2Off className="w-4 h-4 text-red-500" />}
                   <h4 className="font-bold text-text-main text-sm">{api.name}</h4>
                 </div>
                 <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${api.status === 'Connected' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                   {api.status}
                 </span>
               </div>
               
               <div className="flex items-center gap-6 text-xs">
                 <div>
                   <span className="text-text-muted font-bold block mb-0.5">Usage (30d)</span>
                   <span className="text-text-main font-medium">{api.usage}</span>
                 </div>
                 <div>
                   <span className="text-text-muted font-bold block mb-0.5">Latency</span>
                   <span className="text-text-main font-medium">{api.latency}</span>
                 </div>
                 <div className="flex-1 text-right">
                   <button className="text-primary font-bold hover:underline">Manage Keys</button>
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>

    </div>
  );
};

const HealthMetric = ({ icon, label, value, status }) => (
  <div className="p-4 bg-bg-primary rounded-2xl border border-border flex flex-col justify-between h-28 relative overflow-hidden">
    <div className="flex justify-between items-start z-10 relative">
      <div className="p-2 bg-bg-secondary rounded-xl border border-border">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{status}</span>
    </div>
    <div className="z-10 relative mt-2">
      <p className="text-xs font-bold text-text-muted mb-0.5">{label}</p>
      <h4 className="text-2xl font-extrabold text-text-main">{value}</h4>
    </div>
  </div>
);

export default SystemHealthAndAPIs;
