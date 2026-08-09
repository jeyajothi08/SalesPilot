import React from 'react';
import { DownloadCloud, Mail, Printer, Share2, FileText, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

const DocumentPreview = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
      
      {/* Document A4 Container */}
      <div className="flex-1 bg-white rounded-md shadow-2xl overflow-hidden text-black relative mx-auto" style={{ aspectRatio: '1/1.414', maxHeight: '800px' }}>
         <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-12">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
               <div>
                  <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900 mb-2">SalesPilot AI</h1>
                  <p className="text-sm font-medium text-gray-500">123 Innovation Drive<br/>San Francisco, CA 94105</p>
               </div>
               <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-2">Proposal</h2>
                  <p className="text-sm font-bold text-gray-800">Date: <span className="font-medium text-gray-600">Oct 17, 2026</span></p>
                  <p className="text-sm font-bold text-gray-800">Valid Until: <span className="font-medium text-gray-600">Nov 17, 2026</span></p>
                  <p className="text-sm font-bold text-gray-800">Ref: <span className="font-medium text-gray-600">PRP-2026-104</span></p>
               </div>
            </div>

            {/* Client Info */}
            <div className="mb-12">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Prepared For</h3>
               <p className="text-lg font-bold text-gray-900">Acme Corporation</p>
               <p className="text-sm text-gray-600">John Doe, Technical Director</p>
               <p className="text-sm text-gray-600">john@acmecorp.com</p>
            </div>

            {/* Executive Summary */}
            <div className="mb-12">
               <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Executive Summary</h3>
               <p className="text-sm text-gray-600 leading-relaxed">
                 Based on our discovery call, Acme Corporation is looking to modernize its internal CRM by integrating an AI-driven automation pipeline. This proposal outlines the scope of work, methodology, and financial investment required to develop a custom React dashboard backed by LangChain AI capabilities.
               </p>
            </div>

            {/* Pricing Table */}
            <div className="mb-12">
               <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Investment Breakdown</h3>
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="border-b border-gray-200">
                        <th className="py-2 font-bold text-gray-900">Description</th>
                        <th className="py-2 font-bold text-gray-900 text-right">Price</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">Custom React Dashboard</td>
                        <td className="py-3 text-gray-900 font-medium text-right">$5,000</td>
                     </tr>
                     <tr className="border-b border-gray-100">
                        <td className="py-3 text-gray-600">AI Chatbot Integration</td>
                        <td className="py-3 text-gray-900 font-medium text-right">$3,500</td>
                     </tr>
                  </tbody>
               </table>
               <div className="flex justify-end mt-4">
                  <div className="w-48">
                     <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-500 font-bold">Subtotal</span>
                        <span className="text-gray-900">$8,500</span>
                     </div>
                     <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-500 font-bold">Tax (10%)</span>
                        <span className="text-gray-900">$850</span>
                     </div>
                     <div className="flex justify-between text-base py-2 border-t-2 border-gray-900 mt-2">
                        <span className="font-extrabold text-gray-900">Total</span>
                        <span className="font-extrabold text-blue-600">$9,350</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Signatures */}
            <div className="mt-24 grid grid-cols-2 gap-12">
               <div>
                  <div className="border-b border-gray-300 pb-8"></div>
                  <p className="text-sm font-bold text-gray-900 mt-2">SalesPilot AI Representative</p>
                  <p className="text-xs text-gray-500">Date</p>
               </div>
               <div>
                  <div className="border-b border-gray-300 pb-8"></div>
                  <p className="text-sm font-bold text-gray-900 mt-2">Client Signature</p>
                  <p className="text-xs text-gray-500">Date</p>
               </div>
            </div>

         </div>
      </div>

      {/* Action Panel */}
      <div className="w-full md:w-64 flex flex-col gap-4 shrink-0">
         <h3 className="text-sm font-bold text-text-main mb-2 px-1">Document Actions</h3>
         
         <button className="flex items-center gap-3 w-full p-4 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all group">
            <DownloadCloud className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Download PDF</span>
         </button>
         
         <button className="flex items-center gap-3 w-full p-4 bg-bg-secondary border border-border rounded-xl text-text-main hover:border-primary/50 hover:text-primary transition-all group">
            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Send via Email</span>
         </button>

         <button className="flex items-center gap-3 w-full p-4 bg-bg-secondary border border-border rounded-xl text-text-main hover:border-green-500 hover:text-green-500 transition-all group">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            <span className="font-bold text-sm">Send via WhatsApp</span>
         </button>

         <div className="flex gap-4 mt-2">
            <button className="flex-1 flex flex-col items-center gap-1 p-3 bg-bg-secondary rounded-xl text-text-muted hover:text-text-main transition-colors">
               <Printer className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Print</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 p-3 bg-bg-secondary rounded-xl text-text-muted hover:text-text-main transition-colors">
               <Share2 className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Share Link</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default DocumentPreview;
