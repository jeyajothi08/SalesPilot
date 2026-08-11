/**
 * SalesPilot AI — Reusable CRM Context Builder
 * Aggregates structured context for Customers, Deals, Activities, Notes, Tasks, and Pipeline Data.
 */

export const CRMContextBuilder = {
  /**
   * Aggregate complete context for a specific Customer
   */
  getCustomerContext: (customerOrCompany, deals = []) => {
    const companyName = typeof customerOrCompany === 'string' 
      ? customerOrCompany 
      : (customerOrCompany?.company || customerOrCompany?.name || 'Enterprise Client');

    const customerDeals = deals.filter(d => 
      (d.company || '').toLowerCase() === companyName.toLowerCase() ||
      (d.title || '').toLowerCase().includes(companyName.toLowerCase())
    );

    const totalValue = customerDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const activeDeal = customerDeals.find(d => d.stage !== 'won' && d.stage !== 'lost') || customerDeals[0] || null;

    const allTimelineEvents = customerDeals.flatMap(d => d.timeline || []);
    const allNotes = customerDeals.flatMap(d => d.notes || []);

    const primaryContact = activeDeal?.contact || 'Primary Contact';
    const email = activeDeal?.email || `${primaryContact.toLowerCase().replace(/\s+/g, '.')}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    const phone = activeDeal?.phone || '+1 (555) 392-1049';

    return {
      company: companyName,
      contact: primaryContact,
      email,
      phone,
      totalValue,
      dealCount: customerDeals.length,
      activeDeal,
      allDeals: customerDeals,
      stage: activeDeal?.stageTitle || activeDeal?.stage || 'Lead In',
      probability: activeDeal?.probability || 50,
      nextAction: activeDeal?.nextAction || 'Schedule follow-up call',
      notes: allNotes,
      activities: allTimelineEvents,
      leadScore: activeDeal?.score || (activeDeal?.probability ? Math.min(100, activeDeal.probability + 20) : 75),
    };
  },

  /**
   * Aggregate complete context for a specific Deal
   */
  getDealContext: (dealIdOrTitle, deals = []) => {
    const query = String(dealIdOrTitle).toLowerCase();
    const deal = deals.find(d => 
      d.id === dealIdOrTitle || 
      (d.title || '').toLowerCase().includes(query) ||
      (d.company || '').toLowerCase().includes(query)
    ) || null;

    if (!deal) return null;

    const weightedRevenue = (Number(deal.value) || 0) * ((Number(deal.probability) || 50) / 100);

    return {
      id: deal.id,
      title: deal.title,
      company: deal.company,
      contact: deal.contact,
      email: deal.email,
      phone: deal.phone,
      value: Number(deal.value) || 0,
      weightedRevenue: Math.round(weightedRevenue),
      stage: deal.stageTitle || deal.stage || 'Lead In',
      rawStage: deal.stage,
      probability: Number(deal.probability) || 50,
      expectedCloseDate: deal.closingDate || 'End of Q3',
      owner: deal.owner || 'Alex Rivera (AI SDR)',
      nextAction: deal.nextAction || 'Schedule discovery walkthrough',
      summary: deal.summary || 'Evaluating SalesPilot AI deployment.',
      notes: deal.notes || [],
      timeline: deal.timeline || [],
    };
  },

  /**
   * Aggregate global Pipeline context summary
   */
  getPipelineContext: (deals = []) => {
    const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const totalValue = activeDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const weightedPipeline = activeDeals.reduce((sum, d) => sum + ((Number(d.value) || 0) * ((Number(d.probability) || 50) / 100)), 0);

    const sortedByVal = [...activeDeals].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
    const sortedByRisk = [...activeDeals].sort((a, b) => (Number(a.probability) || 0) - (Number(b.probability) || 0));

    return {
      activeDealCount: activeDeals.length,
      totalPipelineValue: totalValue,
      weightedPipeline: Math.round(weightedPipeline),
      topOpportunity: sortedByVal[0] || null,
      highestRiskDeal: sortedByRisk[0] || null,
      allDeals: deals,
    };
  }
};
