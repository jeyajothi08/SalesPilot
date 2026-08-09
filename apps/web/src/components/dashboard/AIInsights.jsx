import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target, Clock, Zap } from 'lucide-react';

const insights = [
  { id: 1, title: 'Best Performing Service', value: 'SaaS Demo', icon: <TrendingUp className="w-5 h-5 text-purple-500" /> },
  { id: 2, title: 'Most Interested Sector', value: 'Healthcare AI', icon: <Target className="w-5 h-5 text-blue-500" /> },
  { id: 3, title: 'Top Conversion Time', value: 'Tuesday, 2 PM', icon: <Clock className="w-5 h-5 text-orange-500" /> },
  { id: 4, title: 'Avg. Call Duration', value: '4m 12s', icon: <Zap className="w-5 h-5 text-yellow-500" /> },
];

const AIInsights = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card bg-bg-primary p-6 relative col-span-1 lg:col-span-2"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-main tracking-tight flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            AI Insights & Suggestions
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 rounded-2xl bg-bg-secondary border border-border flex flex-col justify-center transition-all hover:shadow-md hover:border-border/80">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 rounded-lg bg-white dark:bg-bg-primary shadow-sm border border-border">
                 {insight.icon}
              </div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{insight.title}</p>
            </div>
            <p className="text-lg font-bold text-text-main mt-1">{insight.value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start space-x-3">
         <BotIcon />
         <div>
            <h4 className="text-sm font-bold text-primary mb-1">Today's Suggestion</h4>
            <p className="text-xs text-text-main/80 font-medium">Consider increasing the volume of WhatsApp follow-ups for prospects who missed calls yesterday. Historical data shows a 15% higher reply rate on Wednesdays.</p>
         </div>
      </div>
    </motion.div>
  );
};

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5 shrink-0">
    <path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>
  </svg>
)

export default AIInsights;
