import React from 'react';
import { Window } from './Window';
import ProposalCenter from '../components/ProposalCenter';

export const ProposalsApp = ({ id, isActive, onFocus, onClose }) => {
  return (
    <Window 
      id={id} 
      title="Proposal Center" 
      isActive={isActive} 
      onFocus={onFocus} 
      onClose={onClose}
      defaultWidth={1100}
      defaultHeight={750}
    >
       <ProposalCenter />
    </Window>
  );
};
