import React from 'react';
import { Window } from './Window';
import VoiceDashboard from '../pages/voice/VoiceDashboard';

export const VoiceApp = ({ id, isActive, onFocus, onClose }) => {
  return (
    <Window 
      id={id} 
      title="SalesPilot Voice AI" 
      isActive={isActive} 
      onFocus={onFocus} 
      onClose={onClose}
      defaultWidth={1200}
      defaultHeight={800}
    >
       <VoiceDashboard />
    </Window>
  );
};
