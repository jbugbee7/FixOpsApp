
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Users } from 'lucide-react';
import AddCustomerDialog from './AddCustomerDialog';

const CRMHeader = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          CRM
        </h1>
        
        <Button onClick={() => setShowAddCustomer(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <AddCustomerDialog 
        open={showAddCustomer} 
        onOpenChange={setShowAddCustomer} 
      />
    </div>
  );
};

export default CRMHeader;
