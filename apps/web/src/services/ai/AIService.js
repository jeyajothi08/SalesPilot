/**
 * SalesPilot AI — Common AI Service Layer
 * Prompts & AI Business Logic separated from UI components.
 */

import { CRMContextBuilder } from './CRMContextBuilder';

export const AIService = {

  /**
   * Generate personalized sales email based on CRM context
   */
  generateEmail: (customerContext, purpose = 'follow-up') => {
    const company = customerContext.company || 'Enterprise Prospect';
    const contact = customerContext.contact || 'Decision Maker';
    const stage = customerContext.stage || 'Lead In';
    const dealTitle = customerContext.activeDeal?.title || `${company} License`;
    const dealValue = customerContext.activeDeal?.value ? `$${Number(customerContext.activeDeal.value).toLocaleString()}` : '$35,000';

    const subject = `Following up on ${dealTitle} — SalesPilot AI`;
    const greeting = `Hi ${contact.split(' ')[0]},`;
    
    let body = `I hope you're having a productive week.\n\n` +
      `Following up on our recent conversation regarding ${company}'s sales automation goals. As we discussed, deploying SalesPilot AI for your team (valued at ${dealValue}) will help automate inbound lead qualification and increase meeting conversion rates by 3x.\n\n` +
      `Since your deal is currently in the ${stage} stage, I wanted to share a quick video demo demonstrating how our AI SDR handles high-volume lead qualification seamlessly.`;

    if (purpose.includes('pricing') || purpose.includes('proposal')) {
      body = `Following up on your request for custom enterprise pricing for ${company}.\n\n` +
        `We have prepared a tailored proposal for ${dealTitle} (${dealValue}) including multi-lingual voice SDR, WhatsApp integration, and SOC2 compliance guarantees.\n\n` +
        `I'd love to walk you and the leadership team through the rate sheet and SLA terms this Thursday.`;
    }

    const cta = `Would you have 15 minutes this Thursday at 10:00 AM EST for a quick 1-on-1 walkthrough?`;
    const closing = `Best regards,\nAlex Rivera\nSales Executive | SalesPilot AI\nalex.rivera@salespilot.ai`;

    return {
      to: customerContext.email || `${contact.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      subject,
      greeting,
      body,
      cta,
      closing,
      fullMessage: `${greeting}\n\n${body}\n\n${cta}\n\n${closing}`,
      state: 'Draft',
    };
  },

  /**
   * Analyze incoming email text for Intent, Sentiment, Buying Signals, Objections, and Recommended Action
   */
  analyzeEmail: (emailContent = '') => {
    const text = emailContent.toLowerCase();

    let intent = 'General Inquiry';
    let buyingSignal = 'MEDIUM';
    let sentiment = 'Positive';
    let objection = 'None detected';
    let recommendedAction = 'Send standard product overview and schedule discovery call';

    if (text.includes('pricing') || text.includes('cost') || text.includes('quote') || text.includes('rate')) {
      intent = 'Pricing Request';
      buyingSignal = 'HIGH';
      recommendedAction = 'Send pricing proposal and schedule commercial review';
    } else if (text.includes('demo') || text.includes('walkthrough') || text.includes('call') || text.includes('meeting')) {
      intent = 'Demo Request';
      buyingSignal = 'VERY HIGH';
      recommendedAction = 'Send calendar booking link immediately';
    } else if (text.includes('budget') || text.includes('expensive') || text.includes('next year') || text.includes('freeze')) {
      intent = 'Budget Objection';
      buyingSignal = 'LOW';
      sentiment = 'Hesitant';
      objection = 'Budget constraints for current fiscal quarter';
      recommendedAction = 'Share ROI calculator and offer flexible payment terms';
    } else if (text.includes('contract') || text.includes('sign') || text.includes('msa') || text.includes('legal')) {
      intent = 'Contract / Legal Review';
      buyingSignal = 'VERY HIGH';
      recommendedAction = 'Notify legal team and send DocuSign link';
    }

    return {
      intent,
      buyingSignal,
      sentiment,
      objection,
      recommendedAction,
      confidenceScore: 94,
    };
  },

  /**
   * Calculate AI Lead Score (0-100) and rationale checklist based on CRM data
   */
  calculateLeadScore: (customerContext) => {
    let score = 50;
    const reasons = [];

    const val = customerContext.activeDeal?.value || customerContext.totalValue || 0;
    if (val >= 100000) {
      score += 25;
      reasons.push('High-value enterprise opportunity ($100k+)');
    } else if (val >= 35000) {
      score += 15;
      reasons.push('Substantial contract value ($35k+)');
    }

    const stage = (customerContext.stage || '').toLowerCase();
    if (stage.includes('proposal') || stage.includes('negot')) {
      score += 20;
      reasons.push('Advanced pipeline stage (Proposal / Negotiation)');
    } else if (stage.includes('qual')) {
      score += 10;
      reasons.push('Qualified decision maker');
    }

    if (customerContext.notes && customerContext.notes.length > 0) {
      score += 10;
      reasons.push('Active internal sales notes recorded');
    }

    if (customerContext.activities && customerContext.activities.length > 2) {
      score += 10;
      reasons.push('Frequent multi-channel engagement');
    }

    const finalScore = Math.min(100, Math.max(10, score));

    let category = 'LOW';
    if (finalScore >= 81) category = 'VERY HIGH';
    else if (finalScore >= 61) category = 'HIGH';
    else if (finalScore >= 31) category = 'MEDIUM';

    const recommendedAction = finalScore >= 80 
      ? 'Schedule executive sales call today and send contract' 
      : finalScore >= 60 
      ? 'Send customized ROI proposal and schedule demo' 
      : 'Include in automated email nurture campaign';

    return {
      score: finalScore,
      category,
      reasons,
      recommendedAction,
    };
  },

  /**
   * Identify deals requiring follow-up action and generate priority recommendations
   */
  generateFollowUpRecommendations: (deals = []) => {
    const recommendations = [];

    deals.forEach((deal, i) => {
      const val = Number(deal.value) || 0;
      const prob = Number(deal.probability) || 50;
      const stage = (deal.stage || '').toLowerCase();

      if (stage === 'won' || stage === 'lost') return;

      if (val >= 50000 && prob <= 50) {
        recommendations.push({
          id: `rec_${deal.id || i}`,
          company: deal.company,
          dealTitle: deal.title,
          value: val,
          priority: 'HIGH',
          reason: `High-value deal ($${val.toLocaleString()}) with low win probability (${prob}%)`,
          channel: 'Email + Phone Call',
          suggestedMessage: `Hi ${deal.contact?.split(' ')[0] || 'there'}, following up on our proposal for ${deal.company}. Would you have 10 minutes for a quick status update this week?`,
          recommendedDate: 'Today at 2:00 PM',
          expectedOutcome: 'Re-engage decision maker and increase probability to 70%',
          dealId: deal.id,
        });
      } else if (stage.includes('propos') || stage.includes('negot')) {
        recommendations.push({
          id: `rec_${deal.id || i}`,
          company: deal.company,
          dealTitle: deal.title,
          value: val,
          priority: 'MEDIUM',
          reason: `Proposal sent in stage ${deal.stageTitle || deal.stage} awaiting response`,
          channel: 'Email',
          suggestedMessage: `Following up on the master proposal for ${deal.company}. Please let me know if your legal team has any questions.`,
          recommendedDate: 'Tomorrow at 10:00 AM',
          expectedOutcome: 'Secure contract approval',
          dealId: deal.id,
        });
      }
    });

    return recommendations;
  },

  /**
   * Analyze voice speech transcript intent for multilingual audio input
   */
  analyzeVoiceIntent: (transcript = '', langInfo = { name: 'English' }) => {
    const text = transcript.toLowerCase();

    // CRM Tool Action Intent
    if (text.includes('follow up') || text.includes('task') || text.includes('reminder') || text.includes('Schedule')) {
      const matchedCompany = text.includes('acme') ? 'Acme Health Systems' : text.includes('apex') ? 'Apex Cloud' : text.includes('starlight') ? 'Starlight Logistics' : 'Acme Enterprise';
      return {
        type: 'CRM_MUTATION',
        action: 'CREATE_TASK',
        targetCompany: matchedCompany,
        title: `Follow up with ${matchedCompany}`,
        dueDate: 'Next Friday at 10:00 AM',
        responseSpeech: `I have created a follow-up task for ${matchedCompany} for next Friday.`,
      };
    }

    if (text.includes('move') || text.includes('change stage') || text.includes('proposal')) {
      return {
        type: 'CRM_MUTATION',
        action: 'UPDATE_STAGE',
        targetCompany: 'Acme Enterprise',
        targetStage: 'proposal',
        responseSpeech: `Moved Acme Enterprise deal to Proposal Sent stage.`,
      };
    }

    return {
      type: 'CRM_QUERY',
      responseSpeech: `I analyzed your CRM pipeline. You have active opportunities with strong conversion velocity.`,
    };
  }
};
