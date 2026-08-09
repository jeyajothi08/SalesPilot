import React from 'react';
import { Window } from './Window';
import CommunicationDashboard from '../pages/communication/CommunicationDashboard';

export const CommunicationApp = ({ id, isActive, onFocus, onClose }) => {
  return (
    <Window 
      id={id} 
      title="SalesPilot Communication Hub" 
      isActive={isActive} 
      onFocus={onFocus} 
      onClose={onClose}
      defaultWidth={1200}
      defaultHeight={800}
    >
       <CommunicationDashboard />
    </Window>
  );
};
