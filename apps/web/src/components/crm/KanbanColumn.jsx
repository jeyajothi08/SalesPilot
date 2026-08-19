import React from 'react';
import DealCard from './DealCard';

export default function KanbanColumn({ id, title, deals = [], onDragStart, onDrop, onDragOver, onSelectDeal }) {
  const safeDeals = Array.isArray(deals) ? deals : [];
  const totalValue = safeDeals.reduce((sum, deal) => sum + (Number(deal?.value) || 0), 0);

  return (
    <div 
      className="flex flex-col min-w-[320px] w-[320px] rounded-2xl bg-black/40 border border-white/5 overflow-hidden"
      onDrop={(e) => onDrop(e, id)}
      onDragOver={onDragOver}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white uppercase text-xs tracking-wider">{title}</h3>
          <span className="bg-white/10 text-gray-300 text-xs py-0.5 px-2 rounded-full font-medium">
            {safeDeals.length}
          </span>
        </div>
        <span className="text-blue-400 font-medium text-sm font-mono">
          ${totalValue.toLocaleString()}
        </span>
      </div>

      {/* Column Body - Droppable Area */}
      <div className="p-3 flex-1 overflow-y-auto min-h-50">
        {safeDeals.map(deal => (
          <DealCard 
            key={deal.id} 
            deal={deal} 
            onDragStart={onDragStart}
            onClick={onSelectDeal}
          />
        ))}
        {safeDeals.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-600 text-sm italic border-2 border-dashed border-white/5 rounded-xl p-8 text-center select-none">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}
