import React, { useState, useEffect } from 'react';
import { voiceAPI } from '../../api/voice';
import { motion } from 'framer-motion';

export default function CallHistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    voiceAPI.getCallHistory().then(data => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const getSentimentBadge = (score) => {
    if (score >= 80) return <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">Positive</span>;
    if (score >= 50) return <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">Neutral</span>;
    return <span className="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-400">Negative</span>;
  };

  if (loading) return <div className="p-8 text-white">Loading History...</div>;

  return (
    <div className="w-full overflow-x-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 font-medium">Customer</th>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Duration</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Sentiment</th>
            <th className="px-6 py-4 font-medium text-right">Cost</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <motion.tr 
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 font-medium text-white">{h.customer_name}</td>
              <td className="px-6 py-4 text-gray-400">{new Date(h.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-gray-400">{h.duration}</td>
              <td className="px-6 py-4 capitalize">{h.status}</td>
              <td className="px-6 py-4">{getSentimentBadge(h.sentiment)}</td>
              <td className="px-6 py-4 text-right text-gray-400">{h.cost}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
