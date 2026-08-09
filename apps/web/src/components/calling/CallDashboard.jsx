import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Download, CheckCircle, XCircle } from 'lucide-react';

const analyticsData = [
  { name: 'Mon', calls: 120, answered: 90, booked: 20 },
  { name: 'Tue', calls: 150, answered: 110, booked: 25 },
  { name: 'Wed', calls: 180, answered: 140, booked: 35 },
  { name: 'Thu', calls: 140, answered: 100, booked: 22 },
  { name: 'Fri', calls: 200, answered: 160, booked: 45 },
  { name: 'Sat', calls: 50, answered: 30, booked: 5 },
  { name: 'Sun', calls: 40, answered: 20, booked: 2 },
];

const mockRecordings = [
  { id: 1, name: 'Michael Scott', company: 'Dunder Mifflin', date: 'Today, 2:30 PM', duration: '04:12', outcome: 'Meeting Booked' },
  { id: 2, name: 'Jim Halpert', company: 'Athlead', date: 'Yesterday, 11:15 AM', duration: '01:45', outcome: 'Voicemail' },
  { id: 3, name: 'Dwight Schrute', company: 'Schrute Farms', date: 'Oct 24, 2026', duration: '08:30', outcome: 'Not Interested' },
];

const CallDashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* Analytics Chart */}
      <div className="glass-card bg-bg-primary p-6 rounded-3xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-text-main">Weekly Call Analytics</h2>
          <select className="bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm font-medium text-text-main outline-none cursor-pointer">
            <option>Last 7 days</option>
            <option>This Month</option>
          </select>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--theme-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--theme-text-muted)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: '1px solid var(--theme-border)', backgroundColor: 'var(--theme-bg-primary)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="calls" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" name="Total Calls" />
              <Area type="monotone" dataKey="answered" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAnswered)" name="Answered" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Recordings */}
      <div className="glass-card bg-bg-primary p-6 rounded-3xl border border-border">
        <h2 className="text-lg font-bold text-text-main mb-6">Recent Call Recordings</h2>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-secondary/50 border-b border-border">
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Customer</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Duration</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted">Outcome</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockRecordings.map((rec) => (
                <tr key={rec.id} className="hover:bg-bg-secondary/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-text-main">{rec.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{rec.company}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-main font-medium">{rec.date}</td>
                  <td className="px-6 py-4 text-sm text-text-main font-medium">{rec.duration}</td>
                  <td className="px-6 py-4">
                     <span className={`flex items-center text-sm font-medium ${rec.outcome === 'Meeting Booked' ? 'text-green-500' : rec.outcome === 'Voicemail' ? 'text-yellow-500' : 'text-red-500'}`}>
                        {rec.outcome === 'Meeting Booked' ? <CheckCircle className="w-4 h-4 mr-1.5" /> : <XCircle className="w-4 h-4 mr-1.5" />}
                        {rec.outcome}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                       <button className="px-3 py-1.5 bg-bg-secondary border border-border rounded-lg text-sm font-medium hover:text-primary transition-colors flex items-center">
                         <Play className="w-3.5 h-3.5 mr-1.5" /> Replay
                       </button>
                       <button className="p-1.5 bg-bg-secondary border border-border rounded-lg text-text-muted hover:text-text-main transition-colors flex items-center justify-center">
                         <Download className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CallDashboard;
