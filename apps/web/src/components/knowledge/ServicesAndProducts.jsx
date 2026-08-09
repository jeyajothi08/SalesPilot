import React, { useState } from 'react';
import { Plus, Briefcase, DollarSign, LayoutList, Package, ExternalLink } from 'lucide-react';

const mockServices = [
  { id: 1, name: 'Website Development', desc: 'Custom tailored websites built with React and Tailwind CSS.', price: 'Starts at $2,500', time: '2-4 Weeks', category: 'Service' },
  { id: 2, name: 'AI Chatbot Integration', desc: 'Add a 24x7 AI Sales Employee to your website to handle leads automatically.', price: 'Starts at $5,000', time: '1 Week', category: 'Service' },
  { id: 3, name: 'Premium UI/UX Design', desc: 'Apple-inspired glassmorphism design system for SaaS products.', price: 'Starts at $3,500', time: '3 Weeks', category: 'Service' },
];

const ServicesAndProducts = () => {
  const [filter, setFilter] = useState('all'); // all, services, products

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-text-main">Services & Pricing Manager</h2>
           <p className="text-sm text-text-muted mt-1 font-medium">Train the AI on what you sell and how much it costs.</p>
        </div>
        
        <div className="flex bg-bg-secondary p-1 rounded-xl border border-border">
           <button 
             onClick={() => setFilter('all')}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             All
           </button>
           <button 
             onClick={() => setFilter('services')}
             className={`flex items-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'services' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             <Briefcase className="w-4 h-4 mr-2" /> Services
           </button>
           <button 
             onClick={() => setFilter('products')}
             className={`flex items-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'products' ? 'bg-white text-text-main shadow-sm dark:bg-bg-primary' : 'text-text-muted hover:text-text-main'}`}
           >
             <Package className="w-4 h-4 mr-2" /> Products
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar pb-6">
        
        {/* Add New Button Card */}
        <div className="border-2 border-dashed border-primary/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer min-h-[300px]">
           <div className="w-16 h-16 bg-white dark:bg-bg-primary rounded-2xl shadow-sm border border-border flex items-center justify-center mb-4 text-primary">
             <Plus className="w-8 h-8" />
           </div>
           <h4 className="text-base font-bold text-text-main">Add Offering</h4>
           <p className="text-xs text-text-muted mt-2 max-w-[200px]">Add a new Service, Product, or Pricing Tier.</p>
        </div>

        {/* Existing Services Cards */}
        {mockServices.map((item) => (
          <div key={item.id} className="bg-bg-primary border border-border rounded-3xl p-6 flex flex-col hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group overflow-hidden relative">
            
            {/* Top Badge */}
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center text-text-main">
                {item.category === 'Service' ? <Briefcase className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              </div>
              <button className="p-2 text-text-muted hover:text-primary transition-colors">
                 <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-text-main mb-2">{item.name}</h3>
            <p className="text-sm text-text-muted font-medium mb-6 flex-1 line-clamp-3">
              {item.desc}
            </p>

            <div className="space-y-3 bg-bg-secondary/50 p-4 rounded-2xl border border-border">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-text-muted font-semibold flex items-center"><DollarSign className="w-4 h-4 mr-1" /> Pricing</span>
                 <span className="font-bold text-text-main">{item.price}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-text-muted font-semibold flex items-center"><LayoutList className="w-4 h-4 mr-1" /> Timeline</span>
                 <span className="font-bold text-text-main">{item.time}</span>
               </div>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default ServicesAndProducts;
