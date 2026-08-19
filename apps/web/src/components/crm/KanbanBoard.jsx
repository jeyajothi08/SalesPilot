import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { useCRM } from '../../context/CRMContext';
import { DealDetailsModal } from '../../pages/landing/components/DealDetailsModal';

const STAGES = [
  { id: 'lead_in', altId: 'lead', title: 'Lead In' },
  { id: 'qualified', altId: 'contacted', title: 'Qualified' },
  { id: 'proposal', altId: 'proposal', title: 'Proposal Sent' },
  { id: 'negotiation', altId: 'negotiation', title: 'Negotiation' },
  { id: 'won', altId: 'won', title: 'Closed Won' },
  { id: 'lost', altId: 'lost', title: 'Closed Lost' }
];

export default function KanbanBoard({ dealsOverride }) {
  const crmContext = useCRM();
  const deals = Array.isArray(crmContext?.deals) ? crmContext.deals : [];
  const loading = !!crmContext?.loading;
  const updateDealStage = crmContext?.updateDealStage || (() => {});
  const updateDeal = crmContext?.updateDeal || (() => {});
  const deleteDeal = crmContext?.deleteDeal || (() => {});
  const [selectedDeal, setSelectedDeal] = useState(null);

  const activeDealsList = Array.isArray(dealsOverride) ? dealsOverride : deals;

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, stageId) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId && stageId) {
      await updateDealStage(dealId, stageId);
    }
  };

  const handleSelectDeal = (deal) => {
    setSelectedDeal(deal);
  };

  const handleUpdateDeal = (updatedData) => {
    if (updatedData.stage && updatedData.stage !== selectedDeal?.stage) {
      updateDealStage(updatedData.id, updatedData.stage);
    }
    updateDeal(updatedData.id, updatedData);
    setSelectedDeal(prev => prev ? { ...prev, ...updatedData } : null);
  };

  const handleDeleteDeal = (dealId) => {
    deleteDeal(dealId);
    setSelectedDeal(null);
  };

  if (loading) {
    return <div className="p-8 text-white flex items-center justify-center">Loading Pipeline...</div>;
  }

  // Keep selectedDeal synced with live deals array
  const currentSelectedDeal = selectedDeal ? deals.find(d => d.id === selectedDeal.id) || selectedDeal : null;

  return (
    <div className="flex gap-5 overflow-x-auto pb-2 h-full items-stretch px-2 relative select-none">
      {STAGES.map(stage => {
        const stageDeals = activeDealsList.filter(d => {
          if (!d) return false;
          const st = (d.stage || '').toLowerCase();
          return st === stage.id || st === stage.altId || (stage.id === 'lead_in' && st === 'lead') || (stage.id === 'qualified' && st === 'contacted');
        });

        return (
          <KanbanColumn
            key={stage.id}
            id={stage.id}
            title={stage.title}
            deals={stageDeals}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onSelectDeal={handleSelectDeal}
          />
        );
      })}

      {currentSelectedDeal && (
        <DealDetailsModal
          deal={currentSelectedDeal}
          isOpen={!!currentSelectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdateDeal={handleUpdateDeal}
          onDeleteDeal={handleDeleteDeal}
        />
      )}
    </div>
  );
}
