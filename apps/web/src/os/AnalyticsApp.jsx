import React from 'react';
import { Window } from './Window';
import AnalyticsDashboard from '../pages/analytics/AnalyticsDashboard';

export const AnalyticsApp = ({ id, isActive, onFocus, onClose }) => {
  return (
    <Window
      id={id}
      title="SalesPilot Analytics"
      isActive={isActive}
      onFocus={onFocus}
      onClose={onClose}
      defaultWidth={1200}
      defaultHeight={800}
    >
      <AnalyticsDashboard />
    </Window>
  );
};
