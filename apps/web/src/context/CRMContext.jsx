import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { crmAPI } from '../api/crm';
import { INITIAL_SHOWCASE_DEALS } from '../data/crmShowcaseData';

const CRMContext = createContext(null);

// Normalize deal objects to a consistent schema across the app
export const normalizeDealObject = (d) => {
  const numericVal = typeof d.value === 'number' 
    ? d.value 
    : (d.numericValue || parseFloat(String(d.value || 0).replace(/[^\d.]/g, '') || '0'));
    
  const stageRaw = (d.stage || 'lead_in').toLowerCase();
  let stageId = 'lead_in';
  let stageTitle = 'Lead In';

  if (stageRaw.includes('qual') || stageRaw.includes('contact')) {
    stageId = 'qualified';
    stageTitle = 'Qualified';
  } else if (stageRaw.includes('propos')) {
    stageId = 'proposal';
    stageTitle = 'Proposal Sent';
  } else if (stageRaw.includes('negot') || stageRaw.includes('contract')) {
    stageId = 'negotiation';
    stageTitle = 'Negotiation';
  } else if (stageRaw.includes('won')) {
    stageId = 'won';
    stageTitle = 'Closed Won';
  } else if (stageRaw.includes('lost')) {
    stageId = 'lost';
    stageTitle = 'Closed Lost';
  } else if (stageRaw.includes('lead')) {
    stageId = 'lead_in';
    stageTitle = 'Lead In';
  }

  const prob = d.probability !== undefined 
    ? d.probability 
    : (d.score !== undefined ? d.score : (stageId === 'won' ? 100 : stageId === 'proposal' ? 80 : stageId === 'qualified' ? 60 : 30));

  return {
    id: String(d.id || `deal_${Math.random().toString(36).substring(2, 9)}`),
    title: d.title || d.name || 'Untitled Deal',
    company: d.company || d.company_name || 'Enterprise Client',
    contact: d.contact || d.contact_name || 'Primary Contact',
    role: d.role || 'Decision Maker',
    email: d.email || `${(d.contact || 'contact').toLowerCase().replace(/\s+/g, '.')}@${(d.company || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
    phone: d.phone || '+1 (555) 392-1049',
    value: numericVal,
    numericValue: numericVal,
    stage: stageId,
    stageTitle: d.stageTitle || stageTitle,
    stageTag: d.stageTag || stageTitle,
    probability: prob,
    closingDate: d.closingDate || 'End of Q3',
    nextAction: d.nextAction || 'Schedule follow-up review',
    summary: d.summary || 'Evaluating SalesPilot AI deployment.',
    intent: d.intent || 'high',
    score: d.score || prob,
    avatarBg: d.avatarBg || 'bg-blue-600',
    initials: d.initials || (d.contact ? d.contact.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DC'),
    timeline: d.timeline || [
      { id: 't1', title: 'Deal Record Created', time: 'Recently', type: 'system', desc: 'Added to CRM pipeline.' }
    ],
    notes: d.notes || [],
  };
};

export const CRMProvider = ({ children }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInitialDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await crmAPI.getDeals();
      if (Array.isArray(data)) {
        setDeals(data.map(normalizeDealObject));
      } else {
        setDeals([]);
      }
    } catch (err) {
      console.warn('CRM API error:', err);
      setDeals([]);
      setError('Failed to fetch deals from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialDeals();
  }, [loadInitialDeals]);

  // Update a deal's stage (e.g. drag & drop or Copilot action command)
  const updateDealStage = useCallback(async (dealId, newStageId) => {
    const stageIdClean = newStageId.toLowerCase();
    
    // Optimistic UI update
    setDeals(prevDeals => prevDeals.map(d => {
      if (d.id === dealId || d.title.toLowerCase().includes(dealId.toLowerCase()) || d.company.toLowerCase().includes(dealId.toLowerCase())) {
        let stageTitle = 'Lead In';
        if (stageIdClean.includes('qual')) stageTitle = 'Qualified';
        else if (stageIdClean.includes('propos')) stageTitle = 'Proposal Sent';
        else if (stageIdClean.includes('negot')) stageTitle = 'Negotiation';
        else if (stageIdClean.includes('won')) stageTitle = 'Closed Won';
        else if (stageIdClean.includes('lost')) stageTitle = 'Closed Lost';

        const updatedProb = stageIdClean.includes('won') ? 100 
          : stageIdClean.includes('propos') ? 80 
          : stageIdClean.includes('qual') ? 60 
          : stageIdClean.includes('lost') ? 0 : 30;

        return {
          ...d,
          stage: stageIdClean,
          stageTitle,
          stageTag: stageTitle,
          probability: updatedProb
        };
      }
      return d;
    }));

    // Perform API call
    try {
      await crmAPI.updateDealStage(dealId, newStageId);
    } catch {
      console.warn('Backend API update failed, updated local state optimistically.');
    }
  }, []);

  // Full update for deal properties (Edit modal)
  const updateDeal = useCallback((dealId, updatedFields) => {
    setDeals(prevDeals => prevDeals.map(d => {
      if (d.id === dealId || d.title.toLowerCase().includes(String(dealId).toLowerCase())) {
        const merged = { ...d, ...updatedFields };
        if (updatedFields.value !== undefined) {
          merged.value = Number(updatedFields.value);
          merged.numericValue = Number(updatedFields.value);
        }
        if (updatedFields.stage !== undefined) {
          const stClean = String(updatedFields.stage).toLowerCase();
          let stTitle = 'Lead In';
          if (stClean.includes('qual')) stTitle = 'Qualified';
          else if (stClean.includes('propos')) stTitle = 'Proposal Sent';
          else if (stClean.includes('negot')) stTitle = 'Negotiation';
          else if (stClean.includes('won')) stTitle = 'Closed Won';
          else if (stClean.includes('lost')) stTitle = 'Closed Lost';
          merged.stage = stClean;
          merged.stageTitle = stTitle;
          merged.stageTag = stTitle;
        }
        return merged;
      }
      return d;
    }));
  }, []);

  // Update deal value specifically
  const updateDealValue = useCallback((dealId, newValue) => {
    setDeals(prevDeals => prevDeals.map(d => {
      if (d.id === dealId || d.title.toLowerCase().includes(dealId.toLowerCase())) {
        return {
          ...d,
          value: Number(newValue),
          numericValue: Number(newValue)
        };
      }
      return d;
    }));
  }, []);

  // Delete deal
  const deleteDeal = useCallback((dealId) => {
    setDeals(prevDeals => prevDeals.filter(d => 
      d.id !== dealId && !d.title.toLowerCase().includes(String(dealId).toLowerCase())
    ));
  }, []);

  // Add new deal
  const addDeal = useCallback((newDeal) => {
    const normalized = normalizeDealObject(newDeal);
    setDeals(prev => [normalized, ...prev]);
  }, []);

  // Compute live analytics from current deals state
  const computeAnalytics = useCallback(() => {
    const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost' && d.stage !== 'closed won' && d.stage !== 'closed lost');
    const targetDeals = activeDeals.length > 0 ? activeDeals : deals;

    const totalDeals = targetDeals.length;
    const totalValue = targetDeals.reduce((sum, d) => sum + (d.value || 0), 0);
    const weightedPipeline = targetDeals.reduce((sum, d) => sum + ((d.value || 0) * ((d.probability || 50) / 100)), 0);

    const sortedByVal = [...targetDeals].sort((a, b) => b.value - a.value);
    const sortedByProb = [...targetDeals].sort((a, b) => b.probability - a.probability);
    const sortedByRisk = [...targetDeals].sort((a, b) => a.probability - b.probability);

    const highestValueDeal = sortedByVal[0] || null;
    const highestProbDeal = sortedByProb[0] || null;
    const highestRiskDeal = sortedByRisk[0] || null;

    // Stage summaries
    const stageSummaries = {};
    targetDeals.forEach(d => {
      const st = d.stageTitle || d.stage;
      if (!stageSummaries[st]) {
        stageSummaries[st] = { count: 0, total_value: 0, deals: [] };
      }
      stageSummaries[st].count += 1;
      stageSummaries[st].total_value += (d.value || 0);
      stageSummaries[st].deals.push(d);
    });

    return {
      deals: targetDeals,
      allDeals: deals,
      totalDeals,
      totalValue,
      weightedPipeline,
      highestValueDeal,
      highestProbDeal,
      highestRiskDeal,
      stageSummaries,
    };
  }, [deals]);

  const safeDeals = Array.isArray(deals) ? deals : [];

  return (
    <CRMContext.Provider value={{
      deals: safeDeals,
      loading,
      error,
      refreshDeals: loadInitialDeals,
      updateDealStage,
      updateDealValue,
      updateDeal,
      deleteDeal,
      addDeal,
      computeAnalytics,
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

export default CRMContext;
