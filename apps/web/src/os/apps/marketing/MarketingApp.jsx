import React, { useState } from 'react';
import MarketingDashboard from './MarketingDashboard';
import CampaignBuilder from './CampaignBuilder';
import AIContentEditor from './AIContentEditor';

export default function MarketingApp() {
  const [currentView, setCurrentView] = useState('dashboard');

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="w-full h-full bg-black">
      {currentView === 'dashboard' && <MarketingDashboard onNavigate={navigateTo} />}
      {currentView === 'campaign-builder' && <CampaignBuilder onBack={() => navigateTo('dashboard')} />}
      {currentView === 'content-editor' && <AIContentEditor onBack={() => navigateTo('dashboard')} />}
    </div>
  );
}
