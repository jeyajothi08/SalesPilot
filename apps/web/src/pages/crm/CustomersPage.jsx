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
        <button disabled className="px-4 py-2 bg-blue-600/50 text-white/50 text-sm font-medium rounded-lg shadow-lg shadow-blue-500/10 cursor-not-allowed">
          + Add Customer (Coming Soon)
        </button>
      </div>

      <div className="flex-1">
        <CustomerTable />
      </div>
    </div>
  );
}
