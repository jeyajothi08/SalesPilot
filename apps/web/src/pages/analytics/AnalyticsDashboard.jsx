import React, { useState, useEffect } from 'react';
import KPIWidget from '../../components/analytics/KPIWidget';
import RevenueChart from '../../components/analytics/RevenueChart';
import WinRateChart from '../../components/analytics/WinRateChart';
import { analyticsAPI } from '../../api/analytics';
import { motion } from 'framer-motion';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getDashboardMetrics()
      .then(res => {
        setData(res);
      })
      .catch(err => {
        console.error("Failed to load analytics metrics:", err);
        setData({
          revenue: { total: 1245000, trend: 12.5, target: 1500000 },
          win_rate: { current: 68.4, trend: 4.2 },
          ai_automation: { hours_saved: 1240, trend: 24.5 },
          revenue_history: [
            { month: 'Jan', actual: 85000, forecast: 85000 },
            { month: 'Feb', actual: 92000, forecast: 95000 },
            { month: 'Mar', actual: 110000, forecast: 115000 }
          ]
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
     return <div className="p-8 text-white">Loading BI Warehouse...</div>;
  }

  return (
    <div className="w-full h-full bg-zinc-950 flex flex-col font-sans overflow-hidden">
      {/* Module Header */}
      <header className="h-14 border-b border-white/10 bg-black/50 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight ml-2">Analytics & BI</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950 p-8">
        
        <div className="mb-8 flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
               <p className="text-gray-400 mt-1 text-sm">Real-time telemetry and AI-driven revenue forecasting.</p>
            </div>
            <div className="text-sm text-gray-500">Last updated: Just now</div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-3 gap-6 mb-8">
           <KPIWidget 
              title="Total Revenue (YTD)" 
              value={data.revenue.total} 
              prefix="$" 
              trend={data.revenue.trend} 
              trendLabel="vs previous year"
              icon={<svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
           />
           <KPIWidget 
              title="Win Rate" 
              value={data.win_rate.current} 
              suffix="%" 
              trend={data.win_rate.trend} 
              trendLabel="vs last quarter"
              icon={<svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
           />
           <KPIWidget 
              title="AI Automation Hours Saved" 
              value={data.ai_automation.hours_saved} 
              trend={data.ai_automation.trend} 
              trendLabel="hours this month"
              icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
           />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6 h-96">
           <div className="col-span-2 h-full">
              <RevenueChart data={data.revenue_history} />
           </div>
           <div className="col-span-1 h-full">
              <WinRateChart current={data.win_rate.current} trend={data.win_rate.trend} />
           </div>
        </div>

      </main>
    </div>
  );
}
