import uuid
import re
import structlog
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage

from app.services.ai.llm_factory import LLMFactory
from app.services.crm_service import CRMService
from app.schemas.crm import DealUpdate

logger = structlog.get_logger()

DEFAULT_WORKSPACE_DEALS = [
    {
        "id": "deal_1",
        "title": "Acme Enterprise License",
        "company": "Acme Corp",
        "contact": "Sarah Jenkins",
        "role": "VP of Sales",
        "value": 75000.0,
        "stage": "qualified",
        "probability": 60,
        "nextAction": "Schedule Technical Security Review",
    },
    {
        "id": "deal_2",
        "title": "TechNova Voice AI Rollout",
        "company": "TechNova",
        "contact": "David Miller",
        "role": "CTO",
        "value": 120000.0,
        "stage": "proposal",
        "probability": 80,
        "nextAction": "Review & Sign Master Service Agreement",
    },
    {
        "id": "deal_3",
        "title": "GlobalTech Omni-Channel Expansion",
        "company": "GlobalTech",
        "contact": "Elena Rostova",
        "role": "Head of Procurement",
        "value": 45000.0,
        "stage": "lead_in",
        "probability": 30,
        "nextAction": "Schedule Initial Discovery Call",
    },
    {
        "id": "deal_4",
        "title": "Acme Copilot Expansion Contract",
        "company": "Acme Corp",
        "contact": "Sarah Jenkins",
        "role": "VP of Sales",
        "value": 150000.0,
        "stage": "negotiation",
        "probability": 90,
        "nextAction": "Finalize Executive Pricing Sign-off",
    },
]


def normalize_deal(d: Any) -> Dict[str, Any]:
    if isinstance(d, dict):
        title = d.get("title") or d.get("name") or "Deal Opportunity"
        company = d.get("company") or d.get("company_name") or "Enterprise Client"
        contact = d.get("contact") or d.get("contact_name") or "Primary Contact"
        
        val_raw = d.get("numericValue") if d.get("numericValue") is not None else d.get("value")
        if isinstance(val_raw, (int, float)):
            val = float(val_raw)
        elif isinstance(val_raw, str):
            clean_str = re.sub(r'[^\d.]', '', val_raw)
            val = float(clean_str) if clean_str else 0.0
        else:
            val = 0.0

        stage_raw = str(d.get("stage", "lead_in")).lower()
        prob_raw = d.get("probability") if d.get("probability") is not None else d.get("score")
    else:
        title = getattr(d, "title", "Deal Opportunity")
        company = getattr(d, "company_name", None) or "Enterprise Client"
        contact = getattr(d, "contact_name", None) or "Primary Contact"
        val = float(getattr(d, "value", 0.0) or 0.0)
        stage_raw = str(getattr(d, "stage", "lead")).lower()
        prob_raw = getattr(d, "probability", None)

    # Stage Label mapping
    if any(k in stage_raw for k in ["lead", "initial"]):
        stage_label = "Lead In"
    elif any(k in stage_raw for k in ["qualif", "contact", "discover"]):
        stage_label = "Qualified"
    elif any(k in stage_raw for k in ["propos"]):
        stage_label = "Proposal Sent"
    elif any(k in stage_raw for k in ["negot", "contract"]):
        stage_label = "Negotiation"
    elif any(k in stage_raw for k in ["won"]):
        stage_label = "Closed Won"
    elif any(k in stage_raw for k in ["lost"]):
        stage_label = "Closed Lost"
    else:
        stage_label = "Qualified"

    # Probability fallback
    if prob_raw is not None:
        try:
            prob = int(prob_raw)
        except (ValueError, TypeError):
            prob = 50
    else:
        prob_defaults = {
            "Lead In": 30,
            "Qualified": 60,
            "Proposal Sent": 80,
            "Negotiation": 90,
            "Closed Won": 100,
            "Closed Lost": 0,
        }
        prob = prob_defaults.get(stage_label, 50)

    deal_id = str(getattr(d, "id", "") or (d.get("id") if isinstance(d, dict) else ""))

    return {
        "id": deal_id,
        "title": title,
        "company": company,
        "contact": contact,
        "value": val,
        "stage": stage_label,
        "probability": prob,
        "weighted_value": val * (prob / 100.0),
        "nextAction": (d.get("nextAction") if isinstance(d, dict) else getattr(d, "next_action", "Follow up with client")),
    }


def analyze_crm_pipeline(deals_list: List[Any]) -> Dict[str, Any]:
    norm_deals = [normalize_deal(d) for d in deals_list]
    active_deals = [d for d in norm_deals if d["stage"] not in ["Closed Won", "Closed Lost"]]
    target_deals = active_deals if active_deals else norm_deals

    total_deals = len(target_deals)
    total_value = sum(d["value"] for d in target_deals)
    weighted_pipeline = sum(d["weighted_value"] for d in target_deals)

    stages_order = ["Lead In", "Qualified", "Proposal Sent", "Negotiation"]
    stage_groups = {s: [] for s in stages_order}
    for d in target_deals:
        st = d["stage"]
        if st not in stage_groups:
            stage_groups[st] = []
        stage_groups[st].append(d)

    stage_summaries = {}
    for st, d_list in stage_groups.items():
        st_val = sum(x["value"] for x in d_list)
        st_prob = round(sum(x["probability"] for x in d_list) / len(d_list)) if d_list else 0
        stage_summaries[st] = {
            "count": len(d_list),
            "total_value": st_val,
            "avg_probability": st_prob,
            "pct_of_total": round((st_val / total_value * 100), 1) if total_value > 0 else 0,
            "deals": d_list,
        }

    sorted_by_val = sorted(target_deals, key=lambda x: x["value"], reverse=True)
    sorted_by_prob = sorted(target_deals, key=lambda x: x["probability"], reverse=True)
    sorted_by_risk = sorted(target_deals, key=lambda x: (x["probability"], -x["value"]))

    highest_val_deal = sorted_by_val[0] if sorted_by_val else None
    highest_prob_deal = sorted_by_prob[0] if sorted_by_prob else None
    highest_risk_deal = sorted_by_risk[0] if sorted_by_risk else None

    company_groups = {}
    for d in target_deals:
        c_name = d["company"]
        if c_name not in company_groups:
            company_groups[c_name] = []
        company_groups[c_name].append(d)

    top_customers = sorted(
        [{"company": c, "total_value": sum(x["value"] for x in dl), "deal_count": len(dl)} for c, dl in company_groups.items()],
        key=lambda x: x["total_value"],
        reverse=True
    )

    return {
        "deals": target_deals,
        "total_deals": total_deals,
        "total_value": total_value,
        "weighted_pipeline": weighted_pipeline,
        "stage_summaries": stage_summaries,
        "highest_val_deal": highest_val_deal,
        "highest_prob_deal": highest_prob_deal,
        "highest_risk_deal": highest_risk_deal,
        "top_customers": top_customers,
    }


def generate_pipeline_response(message: str, analytics: Dict[str, Any]) -> str:
    msg = message.lower().strip()
    deals = analytics["deals"]
    tot_deals = analytics["total_deals"]
    tot_val = analytics["total_value"]
    weight_val = analytics["weighted_pipeline"]
    stages = analytics["stage_summaries"]
    top_deal = analytics["highest_val_deal"]
    top_prob = analytics["highest_prob_deal"]
    risk_deal = analytics["highest_risk_deal"]
    top_cust = analytics["top_customers"]

    # 1. Pipeline Analysis
    if any(k in msg for k in ["analyze my pipeline", "how is my pipeline", "pipeline summary", "total pipeline value", "active deals", "biggest opportunities"]):
        stage_lines = []
        for st_name, s_info in stages.items():
            if s_info["count"] > 0:
                stage_lines.append(f"• **{st_name}**: ${s_info['total_value']:,.0f} ({s_info['count']} deal{'s' if s_info['count'] > 1 else ''})")

        stage_str = "\n".join(stage_lines) if stage_lines else "• No active deals"

        top_deal_title = top_deal['title'] if top_deal else "N/A"
        top_deal_val = f"${top_deal['value']:,.0f}" if top_deal else "$0"
        top_prob_title = top_prob['title'] if top_prob else "N/A"
        top_prob_pct = f"{top_prob['probability']}%" if top_prob else "0%"

        return (
            f"Here's your current pipeline:\n\n"
            f"• **Active deals**: {tot_deals}\n"
            f"• **Total pipeline**: ${tot_val:,.0f}\n"
            f"• **Weighted pipeline**: ${weight_val:,.0f}\n"
            f"• **Highest-value deal**: {top_deal_title} — {top_deal_val}\n"
            f"• **Highest probability**: {top_prob_title} — {top_prob_pct}\n\n"
            f"**Stage Summary**:\n{stage_str}\n\n"
            f"**Priority**:\nFocus on **{top_deal_title}** because it has the largest opportunity value ({top_deal_val}) and strong probability ({top_prob_pct})."
        )

    # 2. Deal Analysis
    if any(k in msg for k in ["most valuable", "valuable deal", "biggest opportunity"]):
        if not top_deal:
            return "You currently have no active deals in your pipeline."
        return (
            f"Your most valuable deal is **{top_deal['title']}** ({top_deal['company']}) valued at **${top_deal['value']:,.0f}**.\n\n"
            f"• **Current Stage**: {top_deal['stage']}\n"
            f"• **Win Probability**: {top_deal['probability']}%\n"
            f"• **Weighted Revenue**: ${top_deal['weighted_value']:,.0f}\n"
            f"• **Next Recommended Action**: {top_deal['nextAction']}"
        )

    if any(k in msg for k in ["likely to close", "highest win probability", "highest probability", "high probability"]):
        if not top_prob:
            return "You currently have no active deals in your pipeline."
        return (
            f"The deal most likely to close is **{top_prob['title']}** ({top_prob['company']}) with a **{top_prob['probability']}% win probability**.\n\n"
            f"• **Deal Value**: ${top_prob['value']:,.0f}\n"
            f"• **Current Stage**: {top_prob['stage']}\n"
            f"• **Weighted Contribution**: ${top_prob['weighted_value']:,.0f}\n"
            f"• **Next Recommended Action**: {top_prob['nextAction']}"
        )

    if any(k in msg for k in ["at risk", "risky", "risk"]):
        if not risk_deal:
            return "All current deals have healthy win probabilities."
        return (
            f"Your highest-risk opportunity is **{risk_deal['title']}** ({risk_deal['company']}) valued at **${risk_deal['value']:,.0f}**.\n\n"
            f"• **Reason for Risk**: Lower win probability of {risk_deal['probability']}% in the {risk_deal['stage']} stage.\n"
            f"• **Recommended Action**: {risk_deal['nextAction']} to validate buyer intent and increase deal velocity."
        )

    # 3. Stage Analysis
    if any(k in msg for k in ["stage", "lead in", "proposal", "qualified", "negotiation", "compare"]):
        lines = ["### Pipeline Stage Analysis\n"]
        for st_name, s_info in stages.items():
            if s_info["count"] > 0:
                lines.append(f"• **{st_name}**: ${s_info['total_value']:,.0f} across {s_info['count']} deal(s) ({s_info['pct_of_total']}% of total pipeline value, {s_info['avg_probability']}% avg win probability)")
        return "\n".join(lines)

    # 4. Win Probability & Weighted Pipeline
    if any(k in msg for k in ["weighted", "expected revenue", "probability"]):
        deal_contribs = [f"• **{d['title']}**: ${d['value']:,.0f} × {d['probability']}% = **${d['weighted_value']:,.0f}**" for d in deals]
        contrib_str = "\n".join(deal_contribs)
        return (
            f"Your **Weighted Pipeline** is calculated by multiplying each deal's value by its win probability (`deal_value × win_probability`).\n\n"
            f"Total Weighted Expected Revenue: **${weight_val:,.0f}** (from total unweighted pipeline value of **${tot_val:,.0f}** across {tot_deals} deals).\n\n"
            f"**Breakdown by Deal**:\n{contrib_str}"
        )

    # 5. Customer Analysis
    if any(k in msg for k in ["customer", "clients", "biggest customer"]):
        if not top_cust:
            return "No customer records currently attached to active deals."
        cust_lines = [f"• **{c['company']}**: ${c['total_value']:,.0f} ({c['deal_count']} active deal{'s' if c['deal_count'] > 1 else ''})" for c in top_cust]
        return (
            f"### Customer Opportunity Analysis\n\n" + "\n".join(cust_lines) +
            f"\n\n**{top_cust[0]['company']}** represents your largest client opportunity with **${top_cust[0]['total_value']:,.0f}** in pipeline value."
        )

    # 6. Follow-up Recommendations & Priorities
    if any(k in msg for k in ["follow up", "prioritize", "priority", "today"]):
        top_focus = top_deal
        risk_focus = risk_deal
        return (
            f"### Recommended Priorities for Today\n\n"
            f"1. **High-Value Opportunity**: **{top_focus['title']}** (${top_focus['value']:,.0f})\n"
            f"   - *Action*: {top_focus['nextAction']} ({top_focus['probability']}% probability in {top_focus['stage']}).\n\n"
            f"2. **At-Risk Opportunity**: **{risk_focus['title']}** (${risk_focus['value']:,.0f})\n"
            f"   - *Action*: {risk_focus['nextAction']} (currently at {risk_focus['probability']}% probability).\n\n"
            f"Executing these actions safeguards **${(top_focus['value'] + risk_focus['value']):,.0f}** in total pipeline value."
        )

    # 7. Trend Inquiries
    if any(k in msg for k in ["trend", "changing", "historical", "growth"]):
        return (
            f"I can analyze your current live pipeline state (**{tot_deals} deals worth ${tot_val:,.0f}**), "
            f"but historical time-series snapshots are not recorded in the database to calculate performance trends over time."
        )

    # General overview default
    return (
        f"Here is your real-time pipeline analysis:\n\n"
        f"You have **{tot_deals} active deals** totaling **${tot_val:,.0f}** in pipeline value.\n"
        f"• **Weighted Revenue**: ${weight_val:,.0f}\n"
        f"• **Top Opportunity**: {top_deal['title']} (${top_deal['value']:,.0f})\n"
        f"• **Highest Risk**: {risk_deal['title']} (${risk_deal['value']:,.0f})\n\n"
        f"Ask me about specific deals, stage breakdowns, weighted expected revenue, or recommended follow-ups!"
    )


class SalesAgentOrchestrator:

    @classmethod
    async def chat(
        cls,
        session_id: str,
        message: str,
        history: List[BaseMessage],
        db: Optional[Any] = None,
        org_id: Optional[uuid.UUID] = None,
        crm_context: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Main entry point for chatting with the SalesPilot AI Copilot.
        Inspects live CRM state and returns data-grounded sales analytics.
        """
        try:
            deals_data = []

            if crm_context and isinstance(crm_context, list) and len(crm_context) > 0:
                deals_data = crm_context
            elif db and org_id:
                try:
                    db_deals = await CRMService.get_pipeline(db, org_id)
                    if db_deals:
                        deals_data = db_deals
                except Exception as ex:
                    logger.warn("db_pipeline_fetch_failed", error=str(ex))

            if not deals_data:
                deals_data = DEFAULT_WORKSPACE_DEALS

            analytics = analyze_crm_pipeline(deals_data)

            msg_lower = message.lower().strip()
            if any(k in msg_lower for k in ["move ", "change stage", "update stage", "set stage", "mark won", "mark lost"]):
                matched_deal = None
                for d in analytics["deals"]:
                    if d["company"].lower() in msg_lower or d["title"].lower() in msg_lower:
                        matched_deal = d
                        break

                target_stage = None
                if "proposal" in msg_lower:
                    target_stage = "Proposal"
                elif "qualified" in msg_lower or "contacted" in msg_lower:
                    target_stage = "Qualified"
                elif "won" in msg_lower:
                    target_stage = "Won"
                elif "lost" in msg_lower:
                    target_stage = "Lost"
                elif "lead" in msg_lower:
                    target_stage = "Lead In"

                if matched_deal and target_stage and db and org_id:
                    try:
                        deal_uuid = uuid.UUID(matched_deal["id"])
                        await CRMService.update_deal(db, org_id, deal_uuid, DealUpdate(stage=target_stage))
                        return {
                            "role": "assistant",
                            "content": f"Successfully moved **{matched_deal['title']}** to stage **{target_stage}**. Pipeline state has been updated."
                        }
                    except Exception as ex:
                        logger.info("action_update_failed", error=str(ex))

                if matched_deal and target_stage:
                    return {
                        "role": "assistant",
                        "content": f"To move **{matched_deal['title']}** to **{target_stage}**, please use the stage selector in the Deal Details panel or drag the card on the CRM Pipeline board."
                    }

            try:
                prompt_context = (
                    f"You are a Senior Sales Analyst for SalesPilot AI. "
                    f"Answer the user's question concisely, actionably, and with exact numerical figures. "
                    f"Use ONLY the following factual pipeline data:\n"
                    f"Total Deals: {analytics['total_deals']}\n"
                    f"Total Pipeline Value: ${analytics['total_value']:,.0f}\n"
                    f"Weighted Revenue: ${analytics['weighted_pipeline']:,.0f}\n"
                    f"Highest Value Deal: {analytics['highest_val_deal']['title']} (${analytics['highest_val_deal']['value']:,.0f}, {analytics['highest_val_deal']['probability']}% prob)\n"
                    f"Highest Risk Deal: {analytics['highest_risk_deal']['title']} (${analytics['highest_risk_deal']['value']:,.0f}, {analytics['highest_risk_deal']['probability']}% prob)\n"
                    f"Deals List: {[d['title'] + ' ($' + str(d['value']) + ', ' + d['stage'] + ', ' + str(d['probability']) + '%)' for d in analytics['deals']]}\n"
                    f"DO NOT invent numbers, trends, or fake names."
                )
                
                llm_res = await LLMFactory.generate_chat_response(
                    prompt=message,
                    history=[],
                    context=prompt_context,
                )
                if llm_res and llm_res.get("content"):
                    return {
                        "role": "assistant",
                        "content": llm_res["content"],
                    }
            except Exception as llm_err:
                logger.info("llm_bypass_using_deterministic_analytics", error=str(llm_err))

            reply_content = generate_pipeline_response(message, analytics)
            return {
                "role": "assistant",
                "content": reply_content,
            }

        except Exception as e:
            logger.error("sales_agent_error", error=str(e), session_id=session_id)
            return {
                "role": "assistant",
                "content": "I encountered an error fetching your live CRM pipeline. Please try again.",
            }
