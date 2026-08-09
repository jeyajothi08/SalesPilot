import React, { useState } from 'react';
import CustomerList from './crm/CustomerList';
import CustomerProfile from './crm/CustomerProfile';

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="h-full">
      {selectedCustomer ? (
        <CustomerProfile 
          customer={selectedCustomer} 
          onBack={() => setSelectedCustomer(null)} 
        />
      ) : (
        <CustomerList 
          onSelectCustomer={(customer) => setSelectedCustomer(customer)} 
        />
      )}
    </div>
  );
};

export default Customers;
