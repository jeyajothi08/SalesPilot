import React from 'react';
import { Lightbulb, Trophy, Briefcase, Clock, Award } from 'lucide-react';

const AICoachAndInsights = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* AI Coach */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          AI Coaching Tips
        </h3>
        
        <ul className="space-y-3">
          {[
            'Ask better discovery questions about their Q3 goals.',
            'Discuss pricing later; focus on value first.',
            'Recommend the AI Automation module based on their team size.',
            'Mention the TechNova case study to build credibility.'
          ].map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-bg-primary rounded-xl border border-border">
              <span className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
              <p className="text-sm font-medium text-text-main mt-0.5">{tip}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Team Insights */}
      <div className="glass-card bg-bg-secondary/40 backdrop-blur-md rounded-3xl border border-border/60 p-6 flex-1 shadow-sm">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Team Insights
        </h3>
        
        <div className="space-y-4">
          <InsightRow icon={<Award className="w-4 h-4 text-purple-500" />} label="Top Script" value="Enterprise Outbound v2" />
          <InsightRow icon={<Clock className="w-4 h-4 text-blue-500" />} label="Best Call Time" value="Tuesday 10:00 AM" />
          <InsightRow icon={<Briefcase className="w-4 h-4 text-green-500" />} label="Highest Conv. Industry" value="SaaS & Tech" />
        </div>
      </div>

    </div>
  );
};

const InsightRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-3 bg-bg-primary rounded-xl border border-border">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs font-bold text-text-muted">{label}</span>
    </div>
    <span className="text-sm font-bold text-text-main">{value}</span>
  </div>
);

export default AICoachAndInsights;
