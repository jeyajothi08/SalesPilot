import React from 'react';
import { PhoneCall, Mail, MessageSquare, CalendarCheck, CheckCircle } from 'lucide-react';

const mockTimeline = [
  { id: 1, type: 'ai-call', title: 'AI Called Customer', desc: 'AI agent completed a 4m 12s discovery call.', time: 'Today, 2:30 PM', icon: <PhoneCall className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30' },
  { id: 2, type: 'meeting', title: 'Meeting Booked', desc: 'Customer agreed to a product demo.', time: 'Today, 2:34 PM', icon: <CalendarCheck className="w-4 h-4 text-green-500" />, bg: 'bg-green-100 dark:bg-green-500/20 border-green-200 dark:border-green-500/30' },
  { id: 3, type: 'email', title: 'Proposal Sent', desc: 'Automated pricing proposal sent via email.', time: 'Today, 3:00 PM', icon: <Mail className="w-4 h-4 text-purple-500" />, bg: 'bg-purple-100 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30' },
  { id: 4, type: 'whatsapp', title: 'WhatsApp Follow-up', desc: 'Sent a quick check-in message on WhatsApp.', time: 'Yesterday, 10:00 AM', icon: <MessageSquare className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30' },
  { id: 5, type: 'status', title: 'Status Updated', desc: 'Lead marked as Hot.', time: 'Oct 24, 2026', icon: <CheckCircle className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-100 dark:bg-orange-500/20 border-orange-200 dark:border-orange-500/30' },
];

const CustomerTimeline = () => {
  return (
    <div className="glass-card bg-bg-primary p-6 md:p-8 rounded-3xl border border-border relative">
      <h3 className="text-lg font-bold text-text-main mb-6">Activity Timeline</h3>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-border"></div>

        <div className="space-y-8 relative">
          {mockTimeline.map((item) => (
            <div key={item.id} className="flex items-start group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 border-4 border-bg-primary ${item.bg} transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <div className="ml-4 pt-1 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm text-text-main">{item.title}</h4>
                  <span className="text-xs text-text-muted font-medium bg-bg-secondary px-2 py-1 rounded-md">{item.time}</span>
                </div>
                <p className="text-sm text-text-muted mt-1">{item.desc}</p>
                
                {/* Expandable content based on type could go here */}
                {item.type === 'ai-call' && (
                  <div className="mt-3 p-3 bg-bg-secondary rounded-xl border border-border inline-block">
                    <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">View Call Transcript</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerTimeline;
