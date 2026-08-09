import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const QuotationTable = () => {
  const [items, setItems] = useState([
    { id: 1, service: 'Website Development', desc: 'Custom React Frontend + Dashboard', qty: 1, price: 5000 },
    { id: 2, service: 'AI Chatbot', desc: 'Integration with LangChain & OpenAI', qty: 1, price: 3500 },
  ]);

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const tax = subtotal * 0.10; // 10% tax mock
  const total = subtotal + tax;

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), service: '', desc: '', qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-bg-primary border border-border rounded-2xl overflow-hidden shadow-sm">
       <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse">
           <thead>
             <tr className="border-b border-border/60 bg-bg-secondary/50">
               <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-1/3">Service</th>
               <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Description</th>
               <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-24">Qty</th>
               <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-32">Price</th>
               <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider w-32">Total</th>
               <th className="px-6 py-4 w-16"></th>
             </tr>
           </thead>
           <tbody className="divide-y divide-border/60">
             {items.map(item => (
               <tr key={item.id} className="group hover:bg-bg-secondary/20 transition-colors">
                 <td className="px-6 py-3">
                   <input type="text" defaultValue={item.service} className="w-full bg-transparent text-sm font-bold text-text-main focus:outline-none" placeholder="Service name..." />
                 </td>
                 <td className="px-6 py-3">
                   <input type="text" defaultValue={item.desc} className="w-full bg-transparent text-xs text-text-muted focus:outline-none" placeholder="Description..." />
                 </td>
                 <td className="px-6 py-3">
                   <input type="number" defaultValue={item.qty} className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-text-main focus:outline-none" />
                 </td>
                 <td className="px-6 py-3">
                   <input type="number" defaultValue={item.price} className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-text-main focus:outline-none" />
                 </td>
                 <td className="px-6 py-3">
                   <span className="text-sm font-bold text-text-main">${(item.qty * item.price).toLocaleString()}</span>
                 </td>
                 <td className="px-6 py-3 text-right">
                   <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
       
       <div className="p-4 border-t border-border flex justify-between items-start bg-bg-secondary/30">
          <button onClick={handleAddItem} className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-text-main hover:bg-bg-secondary hover:text-primary transition-colors flex items-center gap-2 shadow-sm">
             <Plus className="w-4 h-4" /> Add Line Item
          </button>
          
          <div className="w-64 space-y-2">
             <div className="flex justify-between text-sm">
               <span className="font-bold text-text-muted">Subtotal</span>
               <span className="font-bold text-text-main">${subtotal.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="font-bold text-text-muted">Tax (10%)</span>
               <span className="font-bold text-text-main">${tax.toLocaleString()}</span>
             </div>
             <div className="pt-2 border-t border-border flex justify-between text-base">
               <span className="font-extrabold text-text-main">Total</span>
               <span className="font-extrabold text-primary">${total.toLocaleString()}</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default QuotationTable;
