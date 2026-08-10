import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import { crmAPI } from '../../api/crm';

const STAGES = [
  { id: 'lead', title: 'Lead In' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'proposal', title: 'Proposal Sent' },
  { id: 'negotiation', title: 'Negotiation' },
  { id: 'won', title: 'Closed Won' }
];

export default function KanbanBoard() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmAPI.getDeals()
      .then(data => {
        setDeals(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.warn("Backend unavailable, loading dummy deals for UI interaction.");
        setDeals([
          { id: '1', title: 'Acme Corp Upgrade', value: 15000, company: 'Acme Corp', stage: 'qualified' },
          { id: '2', title: 'Globex Setup', value: 5000, company: 'Globex Inc', stage: 'lead' },
          { id: '3', title: 'Soylent Renewal', value: 25000, company: 'Soylent Corp', stage: 'proposal' },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, stageId) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    
    // Optimistic UI update
    setDeals(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, stage: stageId } : deal
    ));

    // API Call (catch error if backend doesn't exist)
    try {
      await crmAPI.updateDealStage(dealId, stageId);
    } catch (err) {
      console.warn("Backend unavailable, optimistic UI update persisted locally.");
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading Pipeline...</div>;
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 h-full items-start px-2">
      {STAGES.map(stage => (
        <KanbanColumn
          key={stage.id}
          id={stage.id}
          title={stage.title}
          deals={deals.filter(d => (d.stage || '').toLowerCase() === stage.id.toLowerCase())}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
