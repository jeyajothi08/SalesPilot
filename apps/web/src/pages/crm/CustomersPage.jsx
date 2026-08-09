import React from 'react';
import CustomerTable from '../../components/crm/CustomerTable';

export default function CustomersPage() {
  return (
    <div className="h-full flex flex-col p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Customer Directory</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your CRM contacts and AI health scores.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
          + Add Customer
        </button>
      </div>

      <div className="flex-1">
        <CustomerTable />
      </div>
    </div>
  );
}
