import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  { q: "How realistic does the AI sound?", a: "Our AI uses state-of-the-art text-to-speech models with sub-second latency. It includes filler words, natural pauses, and tone adjustments to sound virtually indistinguishable from a human SDR." },
  { q: "Can it integrate with my CRM?", a: "Yes! SalesPilot AI natively integrates with Salesforce, HubSpot, Pipedrive, and offers webhooks and a REST API for custom integrations." },
  { q: "What happens if the AI doesn't know the answer?", a: "If a prospect asks a highly specific question outside the provided Knowledge Base, the AI will gracefully defer the question and schedule a follow-up meeting with a human expert." },
  { q: "Are there international calling rates?", a: "The Professional plan includes global outbound calling to 150+ countries. Specific rates may apply for premium numbers." }
];

export const FAQSection = () => {
  return (
    <section className="py-32 px-6 max-w-3xl mx-auto border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <FaqItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </section>
  );
};

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
      >
        <h4 className="text-lg font-medium text-white">{question}</h4>
        <span className="text-gray-400 text-2xl font-light">{isOpen ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
         {isOpen && (
           <motion.div 
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             className="px-6 pb-6"
           >
             <p className="text-gray-400 font-light leading-relaxed">{answer}</p>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};
