import React, { useState } from 'react';
import { 
  Megaphone, 
  BarChart2, 
  Mail, 
  MessageSquare, 
  Globe,
  Plus,
  Play,
  Pause,
  Trash2,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketingDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Active Campaigns', value: '12', icon: Megaphone, change: '+2 this week', changeType: 'positive' },
    { name: 'Total Reach', value: '145.2K', icon: Users, change: '+12.5%', changeType: 'positive' },
    { name: 'Avg CTR', value: '4.8%', icon: TrendingUp, change: '-0.2%', changeType: 'negative' },
    { name: 'Revenue Attributed', value: '$24,500', icon: DollarSign, change: '+18%', changeType: 'positive' },
  ];

  const recentCampaigns = [
    { id: 1, name: 'Q3 Product Launch', channel: 'Email', status: 'Running', sent: '12,540', ctr: '5.2%' },
    { id: 2, name: 'Webinar Follow-up', channel: 'WhatsApp', status: 'Draft', sent: '-', ctr: '-' },
    { id: 3, name: 'Holiday Special', channel: 'Social', status: 'Scheduled', sent: '-', ctr: '-' },
    { id: 4, name: 'Win-back Campaign', channel: 'Email', status: 'Completed', sent: '8,200', ctr: '3.1%' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-black text-white p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight">Marketing Engine</h1>
          <p className="text-gray-400 mt-1">Omnichannel campaigns & AI content</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            onClick={() => onNavigate('content-editor')}
            className="px-4 py-2 bg-neutral-900 border border-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center"
          >
            AI Content
          </button>
          <button 
            onClick={() => onNavigate('campaign-builder')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-white/10 mb-8">
        {['overview', 'email', 'social', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
              activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="marketingTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-md"
              />
            )}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <stat.icon size={20} className="text-blue-400" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Recent Campaigns</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-white/10">
                <tr>
                  <th className="pb-3 font-medium">Campaign</th>
                  <th className="pb-3 font-medium">Channel</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Sent</th>
                  <th className="pb-3 font-medium">CTR</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-white/5 group">
                    <td className="py-4 font-medium text-white">{campaign.name}</td>
                    <td className="py-4 text-gray-400">
                      <span className="flex items-center">
                        {campaign.channel === 'Email' && <Mail size={14} className="mr-2" />}
                        {campaign.channel === 'WhatsApp' && <MessageSquare size={14} className="mr-2" />}
                        {campaign.channel === 'Social' && <Globe size={14} className="mr-2" />}
                        {campaign.channel}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        campaign.status === 'Running' ? 'bg-green-500/20 text-green-400' :
                        campaign.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' :
                        campaign.status === 'Completed' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{campaign.sent}</td>
                    <td className="py-4 text-gray-400">{campaign.ctr}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {campaign.status === 'Running' ? (
                          <button className="p-1 hover:text-white text-gray-400"><Pause size={16} /></button>
                        ) : (
                          <button className="p-1 hover:text-white text-gray-400"><Play size={16} /></button>
                        )}
                        <button className="p-1 hover:text-red-400 text-gray-400"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Megaphone size={16} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-medium text-white">AI Recommendations</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-black/40 rounded-lg p-4 border border-white/5">
              <h4 className="text-sm font-medium text-white mb-1">Re-engage inactive leads</h4>
              <p className="text-xs text-gray-400 mb-3">240 leads haven't responded in 30 days. AI suggests a win-back email sequence.</p>
              <button 
                onClick={() => onNavigate('campaign-builder')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Create Campaign &rarr;
              </button>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 border border-white/5">
              <h4 className="text-sm font-medium text-white mb-1">Optimal Posting Time</h4>
              <p className="text-xs text-gray-400 mb-3">Your LinkedIn audience is most active on Tuesdays at 10 AM. Schedule your next post then.</p>
              <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                Schedule Post &rarr;
              </button>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 border border-white/5">
              <h4 className="text-sm font-medium text-white mb-1">A/B Test Results</h4>
              <p className="text-xs text-gray-400 mb-3">Variant B (Urgency subject line) is outperforming Variant A by 45% in open rate.</p>
              <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                Apply to all &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
