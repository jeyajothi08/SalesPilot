import React, { useState, useEffect } from 'react';
import { communicationAPI } from '../../api/communication';
import { motion } from 'framer-motion';

export default function MessageInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    communicationAPI.getMessages().then(data => {
      setMessages(data);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      opened: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      delivered: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      bounced: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };
    const style = styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${style}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getChannelIcon = (channel) => {
    if (channel === 'email') return <span className="text-gray-400 font-bold">@</span>;
    if (channel === 'whatsapp') return <span className="text-emerald-400 font-bold">W</span>;
    return <span className="text-gray-400 font-bold">#</span>;
  };

  if (loading) return <div className="p-8 text-white">Loading Inbox...</div>;

  return (
    <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
         <h2 className="text-white font-medium">Outbound History</h2>
         <div className="flex gap-2">
            <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">142 Sent Today</span>
         </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <tbody>
            {messages.map((m, i) => (
              <motion.tr 
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 w-12 text-center">{getChannelIcon(m.channel)}</td>
                <td className="px-6 py-4 font-medium text-white">
                  {m.customer_name}
                  {m.is_ai && <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">AI DRAFTED</span>}
                </td>
                <td className="px-6 py-4 text-gray-400">{m.subject}</td>
                <td className="px-6 py-4 text-right">{getStatusBadge(m.status)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
