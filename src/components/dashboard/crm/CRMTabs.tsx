
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer } from '@/types/crm';
import CRMMetrics from './CRMMetrics';
import CustomerFilters from './CustomerFilters';
import CustomerList from './CustomerList';
import CRMCharts from './CRMCharts';
import AnalyticsTab from './AnalyticsTab';
import SegmentsTab from './SegmentsTab';
import AutomationTab from './AutomationTab';

interface CRMTabsProps {
  customers: Customer[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  segmentFilter: string;
  setSegmentFilter: (segment: string) => void;
}

const CRMTabs = ({
  customers,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  segmentFilter,
  setSegmentFilter
}: CRMTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
        <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
        <TabsTrigger value="customers" className="text-xs sm:text-sm">Customers</TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        <TabsTrigger value="segments" className="text-xs sm:text-sm">Segments</TabsTrigger>
        <TabsTrigger value="automation" className="text-xs sm:text-sm">Automation</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 sm:space-y-6">
        <CRMMetrics />
        <CRMCharts />
      </TabsContent>

      <TabsContent value="customers" className="space-y-4 sm:space-y-6">
        <CustomerFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          segmentFilter={segmentFilter}
          setSegmentFilter={setSegmentFilter}
        />
        <CustomerList customers={customers} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="segments" className="space-y-4 sm:space-y-6">
        <SegmentsTab />
      </TabsContent>

      <TabsContent value="automation" className="space-y-4 sm:space-y-6">
        <AutomationTab />
      </TabsContent>
    </Tabs>
  );
};

export default CRMTabs;
