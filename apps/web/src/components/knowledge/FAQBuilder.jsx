import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Tag } from 'lucide-react';

const mockFaqs = [
  { id: 1, q: 'How much does a custom website cost?', a: 'Our custom websites start at $2,500. The final price depends on the number of pages, complexity of animations, and backend requirements.', category: 'Pricing' },
  { id: 2, q: 'Do you provide React Development?', a: 'Yes, we specialize in React and Next.js development for modern web applications.', category: 'Services' },
  { id: 3, q: 'How many days will it take to build a chatbot?', a: 'A standard AI chatbot takes about 2 weeks to develop and integrate into your existing systems.', category: 'Timeline' },
];

const FAQBuilder = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-text-main">FAQ Manager</h2>
           <p className="text-sm text-text-muted mt-1 font-medium">Create exact Q&A pairs for the AI to memorize.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
             <input 
               type="text" 
               placeholder="Search FAQs..." 
               className="w-full pl-9 pr-4 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button className="px-5 py-2.5 btn-primary flex items-center justify-center gap-2 text-sm font-bold shadow-sm">
             <Plus className="w-4 h-4" /> Add FAQ
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pb-6">
        
        {/* New FAQ Card Form (Mock) */}
        <div className="border-2 border-dashed border-border rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-bg-secondary/30 hover:bg-bg-secondary/50 transition-colors cursor-pointer min-h-[250px]">
           <div className="w-12 h-12 bg-white dark:bg-bg-primary rounded-full shadow-sm border border-border flex items-center justify-center mb-3 text-text-muted">
             <Plus className="w-6 h-6" />
           </div>
           <h4 className="text-sm font-bold text-text-main">Create New FAQ</h4>
        </div>

        {/* FAQ Cards */}
        {mockFaqs.map((faq) => (
          <div key={faq.id} className="bg-bg-secondary border border-border rounded-3xl p-6 flex flex-col hover:border-border/80 hover:shadow-md transition-all group">
            
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-white dark:bg-bg-primary border border-border rounded-full text-xs font-bold text-text-muted flex items-center">
                <Tag className="w-3 h-3 mr-1.5" /> {faq.category}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                 <button className="p-1.5 text-text-muted hover:text-primary bg-white dark:bg-bg-primary rounded-lg border border-border shadow-sm"><Edit2 className="w-3.5 h-3.5" /></button>
                 <button className="p-1.5 text-text-muted hover:text-red-500 bg-white dark:bg-bg-primary rounded-lg border border-border shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <h3 className="text-base font-bold text-text-main mb-3 leading-tight">{faq.q}</h3>
            <div className="flex-1">
              <p className="text-sm text-text-muted font-medium leading-relaxed bg-white dark:bg-bg-primary p-4 rounded-2xl border border-border/50">
                {faq.a}
              </p>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default FAQBuilder;
