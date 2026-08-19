import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import { Search, Filter, Building2, User, Mail, Phone, Calendar, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function CustomerTable() {
  const crmContext = useCRM();
  const deals = Array.isArray(crmContext?.deals) ? crmContext.deals : [];
  const loading = !!crmContext?.loading;
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('value-desc');

  // Derive customer records from live CRM deals
  const customersList = useMemo(() => {
    const customerMap = {};

    deals.forEach(d => {
      const companyKey = (d.company || d.title || 'Enterprise Client').trim();
      
      if (!customerMap[companyKey]) {
        customerMap[companyKey] = {
          id: `cust_${companyKey.toLowerCase().replace(/[^\w]/g, '_')}`,
          company: companyKey,
          contact: d.contact || 'Primary Contact',
          role: d.role || 'Decision Maker',
          email: d.email || `${(d.contact || 'contact').toLowerCase().replace(/\s+/g, '.')}@${companyKey.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: d.phone || '+1 (555) 392-1049',
          industry: d.industry || (companyKey.toLowerCase().includes('health') ? 'Healthcare' : companyKey.toLowerCase().includes('cloud') ? 'Technology' : companyKey.toLowerCase().includes('fintech') ? 'Financial Services' : 'Enterprise SaaS'),
          companySize: d.companySize || (companyKey.toLowerCase().includes('enterprise') ? '500+ employees' : '50-250 employees'),
          owner: d.owner || 'Alex Rivera (AI SDR)',
          leadScore: d.score || (d.stage === 'won' ? 98 : d.probability || 75),
          status: d.stage === 'won' ? 'Active' : d.stage === 'lost' ? 'Churned' : 'Prospect',
          totalValue: Number(d.value) || 0,
          lastInteraction: d.activityTime || '2h ago',
          nextFollowUp: d.nextAction || 'Schedule quarterly account review',
          deals: [d],
          dealCount: 1,
          notes: d.notes || [],
          activities: d.timeline || [],
        };
      } else {
        customerMap[companyKey].deals.push(d);
        customerMap[companyKey].dealCount += 1;
        customerMap[companyKey].totalValue += (Number(d.value) || 0);
        if (d.notes) customerMap[companyKey].notes.push(...d.notes);
        if (d.timeline) customerMap[companyKey].activities.push(...d.timeline);
      }
    });

    return Object.values(customerMap);
  }, [deals]);

  // Filter & Sort Customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        c.company.toLowerCase().includes(q) || 
        c.contact.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesIndustry = industryFilter === 'all' || c.industry.toLowerCase().includes(industryFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesIndustry;
    }).sort((a, b) => {
      if (sortBy === 'value-desc') return b.totalValue - a.totalValue;
      if (sortBy === 'value-asc') return a.totalValue - b.totalValue;
      if (sortBy === 'score-desc') return b.leadScore - a.leadScore;
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      return 0;
    });
  }, [customersList, searchTerm, statusFilter, industryFilter, sortBy]);

  const getStatusBadge = (status) => {
    const safeStatus = (status || 'Active').toLowerCase();
    const styles = {
      active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      prospect: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      churned: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };
    const style = styles[safeStatus] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-white flex items-center justify-center">Loading Customer Directory...</div>;

  return (
    <div className="h-full flex flex-col space-y-3 font-sans text-white">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/3 border border-white/10 p-2.5 rounded-xl shrink-0">
        
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, contact, email..."
            className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-gray-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#121214]">All Statuses</option>
              <option value="active" className="bg-[#121214]">Active</option>
              <option value="prospect" className="bg-[#121214]">Prospect</option>
              <option value="churned" className="bg-[#121214]">Churned</option>
            </select>
          </div>

          {/* Industry Filter */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-transparent text-gray-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#121214]">All Industries</option>
              <option value="healthcare" className="bg-[#121214]">Healthcare</option>
              <option value="technology" className="bg-[#121214]">Technology</option>
              <option value="financial" className="bg-[#121214]">Financial Services</option>
              <option value="saas" className="bg-[#121214]">Enterprise SaaS</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-gray-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="value-desc" className="bg-[#121214]">Value: High to Low</option>
              <option value="value-asc" className="bg-[#121214]">Value: Low to High</option>
              <option value="score-desc" className="bg-[#121214]">Lead Score: High to Low</option>
              <option value="company" className="bg-[#121214]">Company Name</option>
            </select>
          </div>

        </div>

      </div>

      {/* Customer Directory Table */}
      <div className="flex-1 overflow-x-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl relative custom-scrollbar">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="text-[11px] text-gray-400 uppercase bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Company Name</th>
              <th className="px-5 py-3.5 font-semibold">Primary Contact</th>
              <th className="px-5 py-3.5 font-semibold">Industry & Size</th>
              <th className="px-5 py-3.5 font-semibold">Owner</th>
              <th className="px-5 py-3.5 font-semibold">AI Lead Score</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Total Deal Value</th>
              <th className="px-5 py-3.5 font-semibold">Last Interaction</th>
              <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c, i) => {
              const score = c.leadScore;
              return (
                <motion.tr 
                  key={c.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedCustomer(c)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-semibold text-white group-hover:text-blue-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {c.company.charAt(0)}
                      </div>
                      <span>{c.company}</span>
                    </div>
                  </td>
                  
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{c.contact}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{c.email}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-gray-200">{c.industry}</span>
                      <span className="text-[10px] text-gray-500">{c.companySize}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-gray-300 font-medium">
                    {c.owner}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/10 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-gray-300 font-mono">{score}/100</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">{getStatusBadge(c.status)}</td>

                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                    ${c.totalValue.toLocaleString()}
                  </td>

                  <td className="px-5 py-3.5 text-gray-400 text-[11px]">
                    {c.lastInteraction}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedCustomer(c); }}
                      className="text-blue-400 hover:text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center text-gray-500 italic">
            No customers found matching your criteria.
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
