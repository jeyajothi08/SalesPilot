import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, MonitorSmartphone, Wand2, Eye, ArrowRight, Check } from 'lucide-react';
import QuotationTable from './QuotationTable';
import DocumentPreview from './DocumentPreview';

const servicesList = [
  { id: 'web', name: 'Website Development', price: '$5,000+' },
  { id: 'react', name: 'React App Development', price: '$8,000+' },
  { id: 'ai', name: 'AI Chatbot Integration', price: '$3,500+' },
  { id: 'seo', name: 'SEO Optimization', price: '$1,200/mo' },
  { id: 'design', name: 'UI/UX Design', price: '$4,000+' },
];

const ProposalBuilder = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(4);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-bg-secondary/20 rounded-[32px] border border-border shadow-inner">
      
      {/* Stepper Header */}
      <div className="flex justify-between items-center p-6 border-b border-border bg-bg-primary/50 backdrop-blur-xl relative z-10">
         <div className="flex items-center gap-8">
            <StepIndicator current={step} number={1} label="Client Details" icon={<Building className="w-4 h-4" />} />
            <StepIndicator current={step} number={2} label="Services & Pricing" icon={<MonitorSmartphone className="w-4 h-4" />} />
            <StepIndicator current={step} number={3} label="AI Generation" icon={<Wand2 className="w-4 h-4" />} />
            <StepIndicator current={step} number={4} label="Preview & Send" icon={<Eye className="w-4 h-4" />} />
         </div>
         <button onClick={onCancel} className="text-sm font-bold text-text-muted hover:text-text-main transition-colors">Cancel</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-0">
         <AnimatePresence mode="wait">
            
            {/* Step 1: Client Details */}
            {step === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-6">
                 <h2 className="text-2xl font-bold text-text-main mb-6">Client Information</h2>
                 <div className="grid grid-cols-2 gap-6">
                    <InputField label="Customer Name" placeholder="e.g. John Doe" />
                    <InputField label="Company Name" placeholder="e.g. Acme Corp" />
                    <InputField label="Email Address" placeholder="john@acmecorp.com" />
                    <InputField label="Phone Number" placeholder="+1 (555) 000-0000" />
                 </div>
                 <div className="space-y-6 mt-6">
                    <InputField label="Project Title" placeholder="e.g. E-Commerce Redesign" full />
                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Project Description</label>
                      <textarea rows={4} className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-text-main shadow-sm resize-none" placeholder="Briefly describe the project requirements..."></textarea>
                    </div>
                 </div>
               </motion.div>
            )}

            {/* Step 2: Services & Pricing */}
            {step === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-5xl mx-auto space-y-8">
                 <div>
                   <h2 className="text-2xl font-bold text-text-main mb-2">Select Services</h2>
                   <p className="text-sm text-text-muted mb-6">Choose the core services for this proposal. AI will build the scope based on these.</p>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {servicesList.map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => setSelectedServices(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${selectedServices.includes(s.id) ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-bg-primary border-border text-text-muted hover:border-primary/50'}`}
                        >
                           <MonitorSmartphone className="w-6 h-6" />
                           <span className="text-xs font-bold block">{s.name}</span>
                        </div>
                      ))}
                   </div>
                 </div>

                 <div>
                   <h2 className="text-xl font-bold text-text-main mb-4">Quotation Estimation</h2>
                   <QuotationTable />
                 </div>
               </motion.div>
            )}

            {/* Step 3: AI Generation */}
            {step === 3 && (
               <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center min-h-[400px]">
                 
                 {isGenerating ? (
                   <div className="flex flex-col items-center space-y-6">
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                        <Wand2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-text-main mb-2">AI is crafting your proposal...</h2>
                        <p className="text-sm text-text-muted">Writing Executive Summary, defining Scope of Work, and generating terms.</p>
                      </div>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center space-y-6">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2 border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <Wand2 className="w-10 h-10 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-text-main mb-2">Ready to Generate</h2>
                        <p className="text-sm text-text-muted max-w-md mx-auto">SalesPilot AI will use the client details and selected services to write a highly persuasive, 5-page proposal.</p>
                      </div>
                      <button onClick={handleGenerate} className="px-8 py-3.5 btn-primary rounded-xl font-bold text-sm shadow-xl shadow-primary/30 flex items-center gap-2 hover:-translate-y-1 transition-all">
                        <Wand2 className="w-4 h-4" />
                        Generate Complete Proposal
                      </button>
                   </div>
                 )}
               </motion.div>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
               <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-full flex justify-center">
                 <DocumentPreview />
               </motion.div>
            )}

         </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      {step < 3 && (
        <div className="p-6 bg-bg-primary/50 border-t border-border backdrop-blur-xl flex justify-between items-center z-10">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${step === 1 ? 'opacity-50 cursor-not-allowed text-text-muted bg-bg-secondary' : 'bg-bg-secondary border border-border text-text-main hover:bg-bg-secondary/80'}`}
          >
            Back
          </button>
          <button 
            onClick={() => setStep(step + 1)}
            className="px-6 py-2.5 btn-primary rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

const StepIndicator = ({ current, number, label, icon }) => {
  const isPast = current > number;
  const isActive = current === number;
  const isFuture = current < number;

  return (
    <div className="flex items-center gap-3">
       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
         isPast ? 'bg-primary text-white shadow-md' : 
         isActive ? 'bg-primary/20 border border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 
         'bg-bg-secondary border border-border text-text-muted'
       }`}>
          {isPast ? <Check className="w-4 h-4" /> : number}
       </div>
       <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-text-main' : isPast ? 'text-text-muted' : 'text-text-muted/50'}`}>
         {label}
       </span>
    </div>
  );
};

const InputField = ({ label, placeholder, full }) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">{label}</label>
    <input type="text" className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-text-main shadow-sm transition-colors" placeholder={placeholder} />
  </div>
);

export default ProposalBuilder;
