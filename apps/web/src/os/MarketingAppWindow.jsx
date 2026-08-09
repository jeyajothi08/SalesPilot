import React from 'react';
import { Window } from './Window';
import MarketingApp from './apps/marketing/MarketingApp';

export const MarketingAppWindow = ({ id, isActive, onFocus, onClose }) => {
  return (
    <Window 
      id={id} 
      title="Marketing Engine" 
      isActive={isActive} 
      onFocus={onFocus} 
      onClose={onClose}
      defaultWidth={1100}
      defaultHeight={750}
    >
       <MarketingApp />
    </Window>
  );
};
