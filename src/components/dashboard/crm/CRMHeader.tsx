
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Download } from 'lucide-react';

const CRMHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Customer Relationship Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Comprehensive customer analytics and relationship management
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>
    </div>
  );
};

export default CRMHeader;
