import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Download, Upload, Plus, MoreHorizontal, Mail, Phone, ExternalLink } from 'lucide-react';
import { mockCustomers, getStatusBadge } from '../../data/mockCustomers';

const CustomerList = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      
      {/* Header & Description */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-main">Customer Management</h1>
        <p className="text-sm text-text-muted mt-1 max-w-2xl">
          Manage all customers, leads, conversations, follow-ups, and sales activities in one place.
        </p>
      </div>

      {/* Top Action Bar */}
      <div className="glass-card bg-bg-primary p-4 rounded-2xl border border-border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
         
         <div className="flex flex-1 w-full lg:max-w-xl gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search customers by name, company, or email..." 
                className="w-full pl-9 pr-4 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2.5 bg-bg-secondary border border-border rounded-xl hover:bg-border transition-colors flex items-center gap-2 text-sm font-medium text-text-main">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced Filter</span>
            </button>
            <button className="px-4 py-2.5 bg-bg-secondary border border-border rounded-xl hover:bg-border transition-colors flex items-center gap-2 text-sm font-medium text-text-main">
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline">Sort</span>
            </button>
         </div>

         <div className="flex w-full lg:w-auto gap-3">
            <button className="flex-1 lg:flex-none px-4 py-2.5 bg-bg-secondary border border-border rounded-xl hover:bg-border transition-colors flex justify-center items-center gap-2 text-sm font-medium text-text-main">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button className="flex-1 lg:flex-none px-4 py-2.5 bg-bg-secondary border border-border rounded-xl hover:bg-border transition-colors flex justify-center items-center gap-2 text-sm font-medium text-text-main">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex-1 lg:flex-none px-5 py-2.5 btn-primary flex justify-center items-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
         </div>
      </div>

      {/* Customer Table */}
      <div className="glass-card bg-bg-primary border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar min-h-[500px]">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-bg-secondary/80 border-b border-border backdrop-blur-md">
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted sticky top-0 bg-bg-secondary/90 backdrop-blur-md">Customer</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted sticky top-0 bg-bg-secondary/90 backdrop-blur-md">Contact</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted sticky top-0 bg-bg-secondary/90 backdrop-blur-md">Business / Service</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted sticky top-0 bg-bg-secondary/90 backdrop-blur-md">Lead Score</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted sticky top-0 bg-bg-secondary/90 backdrop-blur-md">Status</th>
                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-text-muted sticky top-0 bg-bg-secondary/90 backdrop-blur-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-bg-secondary/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectCustomer(customer)}
                >
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full border border-border shadow-sm group-hover:scale-105 transition-transform" />
                      <div>
                        <p className="font-semibold text-sm text-text-main group-hover:text-primary transition-colors">{customer.name}</p>
                        <p className="text-xs text-text-muted mt-0.5 font-medium">{customer.company}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-text-main">
                        <Mail className="w-3.5 h-3.5 mr-2 text-text-muted" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-xs text-text-main">
                        <Phone className="w-3.5 h-3.5 mr-2 text-text-muted" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-text-main">{customer.type}</p>
                      <p className="text-xs text-text-muted">{customer.service}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-bg-secondary rounded-full h-1.5 overflow-hidden border border-border">
                        <div 
                          className={`h-1.5 rounded-full ${customer.score > 80 ? 'bg-green-500' : customer.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${customer.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-text-main">{customer.score}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectCustomer(customer); }}
                        className="p-2 bg-white dark:bg-bg-secondary border border-border rounded-lg text-text-muted hover:text-primary hover:border-primary/50 transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted hover:text-text-main"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-border flex justify-between items-center bg-bg-secondary/30">
          <span className="text-xs font-medium text-text-muted">Showing 1 to 5 of 45,210 entries</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-border rounded-lg bg-bg-primary text-xs font-medium text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-primary bg-primary text-white rounded-lg text-xs font-medium shadow-sm shadow-primary/30">1</button>
            <button className="px-3 py-1 border border-border rounded-lg bg-bg-primary text-xs font-medium text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors">2</button>
            <button className="px-3 py-1 border border-border rounded-lg bg-bg-primary text-xs font-medium text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors">3</button>
            <button className="px-3 py-1 border border-border rounded-lg bg-bg-primary text-xs font-medium text-text-muted hover:text-text-main hover:bg-bg-secondary transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default CustomerList;
