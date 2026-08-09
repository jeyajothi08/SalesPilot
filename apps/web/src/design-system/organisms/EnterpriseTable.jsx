import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, MoreHorizontal, Filter, Download } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { TextInput } from '../atoms/TextInput';

// Mock Data for the Table
const defaultData = [
  { id: '1', name: 'Acme Corp', contact: 'john@acme.com', status: 'Active', value: '$45,000', lastContact: '2 hours ago' },
  { id: '2', name: 'TechNova', contact: 'sarah@technova.io', status: 'Pending', value: '$12,500', lastContact: '1 day ago' },
  { id: '3', name: 'Global Ind.', contact: 'mike@global.net', status: 'Lost', value: '$85,000', lastContact: '1 week ago' },
  { id: '4', name: 'Startup Inc', contact: 'founder@startup.com', status: 'Active', value: '$4,200', lastContact: 'Just now' },
  { id: '5', name: 'Mega Retail', contact: 'buyers@mega.com', status: 'Pending', value: '$120,000', lastContact: '3 days ago' },
];

export const EnterpriseTable = ({ title = "Accounts", data = defaultData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc'); // asc or desc

  // Handlers
  const toggleAll = () => {
    if (selectedRows.size === data.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(data.map(d => d.id)));
  };

  const toggleRow = (id) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <Badge variant="success" pulse>{status}</Badge>;
      case 'Pending': return <Badge variant="warning">{status}</Badge>;
      case 'Lost': return <Badge variant="danger">{status}</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="w-full bg-ds-surface border border-ds-border rounded-ds-2xl overflow-hidden shadow-ds-sm flex flex-col">
      
      {/* Table Toolbar */}
      <div className="p-4 border-b border-ds-border bg-ds-surface flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-lg font-bold text-ds-text-primary whitespace-nowrap">{title}</h2>
            <div className="h-6 w-px bg-ds-border hidden md:block"></div>
            <div className="w-full md:w-64">
               <TextInput 
                 placeholder="Search records..." 
                 icon={<Search className="w-4 h-4" />} 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="secondary" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</Button>
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
            {selectedRows.size > 0 && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                 <Button variant="danger" size="sm">Delete ({selectedRows.size})</Button>
               </motion.div>
            )}
         </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto w-full custom-scrollbar">
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="bg-ds-surface-hover border-b border-ds-border text-[11px] font-bold text-ds-text-secondary uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.size === data.length}
                      onChange={toggleAll}
                      className="rounded border-ds-border text-ds-accent focus:ring-ds-accent cursor-pointer"
                    />
                  </th>
                  <SortableHeader label="Company" field="name" currentSort={sortField} direction={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Contact" field="contact" currentSort={sortField} direction={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Status" field="status" currentSort={sortField} direction={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Pipeline Value" field="value" currentSort={sortField} direction={sortDirection} onSort={handleSort} />
                  <SortableHeader label="Last Contact" field="lastContact" currentSort={sortField} direction={sortDirection} onSort={handleSort} />
                  <th className="p-4 w-12 text-center"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-ds-border">
               <AnimatePresence>
                 {data.map((row) => (
                   <motion.tr 
                     layout
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     key={row.id} 
                     className={`group hover:bg-ds-surface-hover transition-colors ${selectedRows.has(row.id) ? 'bg-ds-accent-glass/30' : ''}`}
                   >
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="rounded border-ds-border text-ds-accent focus:ring-ds-accent cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </td>
                      <td className="p-4 font-bold text-sm text-ds-text-primary">{row.name}</td>
                      <td className="p-4 text-sm text-ds-text-secondary">{row.contact}</td>
                      <td className="p-4">{getStatusBadge(row.status)}</td>
                      <td className="p-4 font-bold text-sm text-ds-text-primary">{row.value}</td>
                      <td className="p-4 text-xs font-medium text-ds-text-tertiary">{row.lastContact}</td>
                      <td className="p-4 text-center">
                        <button className="p-1.5 text-ds-text-tertiary hover:text-ds-text-primary hover:bg-ds-border rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                           <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                   </motion.tr>
                 ))}
               </AnimatePresence>
            </tbody>
         </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-ds-border bg-ds-surface flex justify-between items-center text-sm text-ds-text-secondary">
         <span>Showing 1 to 5 of 124 records</span>
         <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" isDisabled>Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
         </div>
      </div>

    </div>
  );
};

const SortableHeader = ({ label, field, currentSort, direction, onSort }) => (
  <th 
    className="p-4 cursor-pointer hover:text-ds-text-primary transition-colors group select-none"
    onClick={() => onSort(field)}
  >
    <div className="flex items-center gap-1">
      {label}
      <span className={`transition-opacity ${currentSort === field ? 'opacity-100 text-ds-accent' : 'opacity-0 group-hover:opacity-50'}`}>
        {currentSort === field && direction === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
      </span>
    </div>
  </th>
);
