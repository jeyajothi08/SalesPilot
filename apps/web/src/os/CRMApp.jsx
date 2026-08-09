import React from 'react';
import { Window } from './Window';
import CRMDashboard from '../pages/crm/CRMDashboard';

export const CRMApp = ({ id, isActive, onFocus, onClose }) => {
  return (
    <Window 
      id={id} 
      title="SalesPilot CRM Engine" 
      isActive={isActive} 
      onFocus={onFocus} 
      onClose={onClose}
      defaultWidth={1200}
      defaultHeight={800}
    >
       <CRMDashboard />
    </Window>
  );
};
