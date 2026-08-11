/**
 * SalesPilot Agentic AI Engine
 * Tool-based CRM Agent that executes real data tools to answer user queries.
 */

export const SalesPilotCRMAgent = {
  // Tool 1: Get complete active pipeline
  get_pipeline: (deals = []) => {
    const activeDeals = deals.filter(d => {
      const st = (d.stage || '').toLowerCase();
      return st !== 'won' && st !== 'lost' && st !== 'closed won' && st !== 'closed lost';
    });
    const totalVal = activeDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    return {
      activeDealCount: activeDeals.length,
      totalPipelineValue: totalVal,
      deals: activeDeals,
    };
  },

  // Tool 2: Get active deals list
  get_active_deals: (deals = []) => {
    return deals.filter(d => {
      const st = (d.stage || '').toLowerCase();
      return st !== 'won' && st !== 'lost' && st !== 'closed won' && st !== 'closed lost';
    });
  },

  // Tool 3: Search and get specific deal details
  get_deal_details: (deals = [], query = '') => {
    const q = query.toLowerCase();
    return deals.find(d => 
      d.title?.toLowerCase().includes(q) || 
      d.company?.toLowerCase().includes(q)
    ) || null;
  },

  // Tool 4: Get list of unique customers/companies
  get_customers: (deals = []) => {
    const companies = [...new Set(deals.map(d => d.company).filter(Boolean))];
    return companies.map(comp => {
      const compDeals = deals.filter(d => d.company === comp);
      const totalVal = compDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
      return { company: comp, dealCount: compDeals.length, totalValue: totalVal };
    });
  },

  // Tool 5: Get customer specific details
  get_customer_details: (deals = [], customerName = '') => {
    const q = customerName.toLowerCase();
    const customerDeals = deals.filter(d => d.company?.toLowerCase().includes(q));
    if (customerDeals.length === 0) return null;

    const totalValue = customerDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    return {
      company: customerDeals[0].company,
      deals: customerDeals,
      totalValue,
    };
  },

  // Tool 6: Calculate total pipeline value
  calculate_pipeline_value: (deals = []) => {
    const activeDeals = SalesPilotCRMAgent.get_active_deals(deals);
    return activeDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  },

  // Tool 7: Calculate weighted expected revenue
  calculate_weighted_revenue: (deals = []) => {
    const activeDeals = SalesPilotCRMAgent.get_active_deals(deals);
    return activeDeals.reduce((sum, d) => {
      const prob = Number(d.probability) || 50;
      return sum + ((Number(d.value) || 0) * (prob / 100));
    }, 0);
  },

  // Tool 8: Find high-risk deals (probability < 50%)
  find_high_risk_deals: (deals = []) => {
    const activeDeals = SalesPilotCRMAgent.get_active_deals(deals);
    return activeDeals.filter(d => (Number(d.probability) || 50) < 50);
  },

  // Tool 9: Find top opportunities (highest value)
  find_top_opportunities: (deals = [], limit = 3) => {
    const activeDeals = SalesPilotCRMAgent.get_active_deals(deals);
    return [...activeDeals]
      .sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0))
      .slice(0, limit);
  },

  // Tool 10: Get overall sales metrics summary
  get_sales_metrics: (deals = []) => {
    const activeDeals = SalesPilotCRMAgent.get_active_deals(deals);
    const totalVal = SalesPilotCRMAgent.calculate_pipeline_value(deals);
    const weightedVal = SalesPilotCRMAgent.calculate_weighted_revenue(deals);
    const topDeals = SalesPilotCRMAgent.find_top_opportunities(deals, 1);
    const highRisk = SalesPilotCRMAgent.find_high_risk_deals(deals);

    return {
      totalDeals: activeDeals.length,
      totalValue: totalVal,
      weightedRevenue: weightedVal,
      topOpportunity: topDeals[0] || null,
      highRiskCount: highRisk.length,
    };
  },

  /**
   * Main Agent Decision Router
   * Evaluates query intent, executes corresponding tools, and formats data-grounded answers.
   */
  runAgent: (query = '', deals = [], langInfo = { name: 'English', isTanglish: false }) => {
    const q = query.toLowerCase().trim();
    const langName = langInfo.name;

    // Intent 1: Risk Analysis -> find_high_risk_deals
    if (q.includes('risk') || q.includes('danger') || q.includes('low probability') || q.includes('problem')) {
      const riskDeals = SalesPilotCRMAgent.find_high_risk_deals(deals);
      if (riskDeals.length === 0) {
        return langName.includes('Tamil') || langInfo.isTanglish
          ? `Good news! Unga active deals ellam solid probability (>50%) irukku. No high-risk deals found.`
          : `All your active opportunities have a healthy win probability (>50%). No high-risk deals currently identified.`;
      }
      const riskText = riskDeals.map(d => `• **${d.title}** (${d.company}): $${Number(d.value).toLocaleString()} - ${d.probability || 30}% probability`).join('\n');
      return langName.includes('Tamil') || langInfo.isTanglish
        ? `High risk-la irukura deals:\n${riskText}`
        : `Identified ${riskDeals.length} high-risk deal(s):\n${riskText}`;
    }

    // Intent 2: Specific Deal Details -> get_deal_details
    if (q.includes('acme') || q.includes('technova') || q.includes('globaltech')) {
      const deal = SalesPilotCRMAgent.get_deal_details(deals, q);
      if (deal) {
        return langName.includes('Tamil') || langInfo.isTanglish
          ? `**${deal.title}** (${deal.company}): Value **$${Number(deal.value).toLocaleString()}**, Stage: **${deal.stage}**, Probability: **${deal.probability}%**. Next action: ${deal.nextAction || 'Follow up'}.`
          : `**${deal.title}** (${deal.company}) is in stage **${deal.stage}** valued at **$${Number(deal.value).toLocaleString()}** (${deal.probability}% probability). Next action: ${deal.nextAction || 'Schedule review'}.`;
      }
    }

    // Intent 3: Highest Value / Top Opportunities -> find_top_opportunities
    if (q.includes('highest') || q.includes('top') || q.includes('biggest') || q.includes('large') || q.includes('அதிக')) {
      const topDeals = SalesPilotCRMAgent.find_top_opportunities(deals, 3);
      const topList = topDeals.map((d, idx) => `${idx + 1}. **${d.title}** (${d.company}) - $${Number(d.value).toLocaleString()}`).join('\n');
      return langName.includes('Tamil') || langInfo.isTanglish
        ? `Unga top opportunities:\n${topList}`
        : `Top pipeline opportunities:\n${topList}`;
    }

    // Intent 4: Pipeline Metrics / Weighted Revenue -> get_sales_metrics
    const metrics = SalesPilotCRMAgent.get_sales_metrics(deals);
    if (langName.includes('Tamil') || langInfo.isTanglish) {
      return `Unga pipeline-la total **${metrics.totalDeals} active deals** irukku. Total value: **$${metrics.totalValue.toLocaleString()}**, Expected weighted revenue: **$${Math.round(metrics.weightedRevenue).toLocaleString()}**.`;
    }
    if (langName.includes('Hindi')) {
      return `Aapke pass **${metrics.totalDeals} active deals** hain. Total pipeline value: **$${metrics.totalValue.toLocaleString()}**, Weighted expected revenue: **$${Math.round(metrics.weightedRevenue).toLocaleString()}**.`;
    }

    return `You currently have **${metrics.totalDeals} active deals** with a total pipeline value of **$${metrics.totalValue.toLocaleString()}** (Expected weighted revenue: **$${Math.round(metrics.weightedRevenue).toLocaleString()}**).`;
  }
};
