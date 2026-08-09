import React from 'react';
import { MessageSquare, Plus, Calendar, Handshake, FileText, CheckCircle, Clock, AlertCircle, Play, Edit3, Settings, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockAnalytics = [
  { name: 'Mon', sent: 120, read: 115, replied: 45 },
  { name: 'Tue', sent: 150, read: 142, replied: 62 },
  { name: 'Wed', sent: 130, read: 125, replied: 50 },
  { name: 'Thu', sent: 200, read: 195, replied: 85 },
  { name: 'Fri', sent: 180, read: 170, replied: 70 },
  { name: 'Sat', sent: 80, read: 75, replied: 20 },
  { name: 'Sun', sent: 95, read: 90, replied: 25 },
];

const mockTemplates = [
  { id: 1, title: 'Meeting Reminder', type: 'System', icon: <Clock className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
  { id: 2, title: 'Proposal Update', type: 'Sales', icon: <FileText className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' },
  { id: 3, title: 'Initial Greeting', type: 'Marketing', icon: <Handshake className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
  { id: 4, title: 'Payment Reminder', type: 'Billing', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' },
  { id: 5, title: 'Project Status', type: 'Support', icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' },
  { id: 6, title: 'Follow-up', type: 'Sales', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' },
  { id: 7, title: 'Invoice Attached', type: 'Billing', icon: <FileText className="w-5 h-5" />, color: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' },
  { id: 8, title: 'Thank You', type: 'Customer Success', icon: <Handshake className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400' },
];

const WhatsAppDashboard = ({ onCompose }) => {
  return (
    <div className="space-y-8">
      
      {/* Top Section: Analytics & Quick Compose */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         <div className="col-span-1 lg:col-span-2 glass-card bg-bg-secondary/40 backdrop-blur-md p-6 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-center mb-6 relative z-10">
             <h3 className="text-lg font-bold text-text-main">WhatsApp Engagement</h3>
             <button className="p-2 bg-bg-primary rounded-xl border border-border shadow-sm text-text-muted hover:text-text-main transition-colors">
               <Settings className="w-4 h-4" />
             </button>
           </div>
           <div className="h-[250px] w-full relative z-10">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={mockAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" strokeOpacity={0.5} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
                 <Tooltip 
                   cursor={{fill: 'var(--theme-bg-primary)', opacity: 0.5}}
                   contentStyle={{ borderRadius: '16px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)', backdropFilter: 'blur(10px)' }} 
                   itemStyle={{ color: 'var(--theme-text-main)', fontSize: '14px', fontWeight: 'bold' }}
                 />
                 <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--theme-text-muted)', paddingTop: '10px' }} />
                 <Bar dataKey="sent" fill="#10b981" radius={[4, 4, 0, 0]} name="Sent" maxBarSize={15} />
                 <Bar dataKey="read" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Read" maxBarSize={15} />
                 <Bar dataKey="replied" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Replied" maxBarSize={15} />
               </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/5 rounded-full blur-[50px] pointer-events-none"></div>
         </div>

         <div className="col-span-1 glass-card bg-gradient-to-br from-green-500/10 to-green-500/5 p-8 rounded-3xl border border-green-500/20 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-lg shadow-green-500/5">
            <div className="w-20 h-20 bg-white dark:bg-bg-primary rounded-2xl shadow-xl flex items-center justify-center mb-6 z-10 border border-green-500/20 transform rotate-3">
              <MessageSquare className="w-10 h-10 text-green-500 -rotate-3" />
            </div>
            <h3 className="text-2xl font-extrabold text-text-main mb-2 z-10">AI Message Generator</h3>
            <p className="text-sm font-medium text-text-muted mb-8 z-10">Create human-like WhatsApp messages in seconds.</p>
            <button onClick={onCompose} className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-green-500/30 z-10 flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
              <Zap className="w-4 h-4" />
              Generate Message
            </button>
            {/* Background Blob */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-500/20 rounded-full blur-[40px] pointer-events-none" />
         </div>

      </div>

      {/* Templates Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              WhatsApp Templates
            </h3>
            <p className="text-sm text-text-muted mt-1">Pre-approved templates for quick dispatch.</p>
          </div>
          <button className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-sm font-bold text-text-main hover:bg-bg-secondary/80 transition-colors">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           {/* Add New Template */}
           <div className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-bg-secondary/20 hover:bg-bg-secondary/60 hover:border-green-500/40 transition-all cursor-pointer min-h-[160px] group">
             <div className="w-12 h-12 rounded-full bg-bg-primary border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <Plus className="w-6 h-6 text-text-muted group-hover:text-green-500 transition-colors" />
             </div>
             <h4 className="text-sm font-bold text-text-main">Custom Template</h4>
           </div>

           {mockTemplates.map((template) => (
             <div key={template.id} className="glass-card bg-bg-secondary/40 border border-border/60 rounded-3xl p-5 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 cursor-pointer group flex flex-col relative overflow-hidden">
               <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className={`p-3 rounded-2xl ${template.color} shadow-sm`}>
                   {template.icon}
                 </div>
                 <button className="opacity-0 group-hover:opacity-100 p-2 bg-bg-primary rounded-lg border border-border text-text-muted hover:text-green-500 transition-all translate-y-2 group-hover:translate-y-0">
                   <Play className="w-4 h-4" />
                 </button>
               </div>
               <h4 className="text-base font-bold text-text-main mb-1 relative z-10">{template.title}</h4>
               <p className="text-xs font-bold uppercase tracking-wider text-text-muted relative z-10">{template.type}</p>
               
               {/* Hover Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none"></div>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default WhatsAppDashboard;
