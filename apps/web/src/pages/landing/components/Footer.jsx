import React from 'react';
import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="pt-20 pb-10 px-6 border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
        
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
             <Bot className="w-6 h-6 text-white" />
             <span className="text-xl font-bold tracking-tight text-white">SalesPilot AI</span>
          </div>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Your autonomous sales engine. Book more meetings, close more deals, and scale revenue without scaling headcount.
          </p>
          <div className="flex gap-4">
             {/* Social placeholders */}
             <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"></div>
             <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"></div>
             <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"></div>
          </div>
        </div>

        <div>
           <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
           <ul className="space-y-3">
              <li><button onClick={() => navigate('/features')} className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none p-0 text-left">Features</button></li>
              <li><span className="text-gray-700 text-sm cursor-not-allowed">Integrations (Coming Soon)</span></li>
              <li><button onClick={() => navigate('/pricing')} className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none p-0 text-left">Pricing</button></li>
              <li><span className="text-gray-700 text-sm cursor-not-allowed">Changelog</span></li>
           </ul>
        </div>
        
        <div>
           <h4 className="font-semibold text-white mb-4 text-sm">Resources</h4>
           <ul className="space-y-3">
              <li><span className="text-gray-700 text-sm cursor-not-allowed">Documentation</span></li>
              <li><span className="text-gray-700 text-sm cursor-not-allowed">Blog</span></li>
              <li><span className="text-gray-700 text-sm cursor-not-allowed">Community</span></li>
              <li><button onClick={() => navigate('/demo')} className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-none p-0 text-left">Contact</button></li>
           </ul>
        </div>
        
        <div>
           <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
           <ul className="space-y-3">
              <li><span className="text-gray-700 text-sm cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-gray-700 text-sm cursor-not-allowed">Terms of Service</span></li>
           </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="text-gray-600 text-sm">© {new Date().getFullYear()} SalesPilot AI Inc. All rights reserved.</div>
         <div className="flex gap-4">
            <div className="text-gray-600 text-sm flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500"></span> All systems operational
            </div>
         </div>
      </div>
    </footer>
  );
};
