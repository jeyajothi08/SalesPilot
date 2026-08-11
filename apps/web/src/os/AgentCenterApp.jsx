import React from 'react';
import { Window } from './Window';
import AgentCenterPage from '../pages/agents/AgentCenterPage';

export const AgentCenterApp = ({ id, isActive, onFocus, onClose }) => {
  return (
    <Window 
      id={id} 
      title="SalesPilot Agent Center" 
      isActive={isActive} 
      onFocus={onFocus} 
      onClose={onClose}
      defaultWidth={1200}
      defaultHeight={800}
    >
       <AgentCenterPage />
    </Window>
  );
};
