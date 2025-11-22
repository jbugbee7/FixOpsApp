
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Users } from 'lucide-react';
import AddCustomerDialog from './AddCustomerDialog';

const CRMHeader = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  return (
    <div className="mb-6">
      <Button 
        onClick={() => setShowAddCustomer(true)} 
        className="w-full flex items-center justify-center gap-2 h-12"
      >
        <Plus className="h-4 w-4" />
        Add Customer
      </Button>

      <AddCustomerDialog 
        open={showAddCustomer} 
        onOpenChange={setShowAddCustomer} 
      />
    </div>
  );
};

export default CRMHeader;
