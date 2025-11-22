
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CRMMetrics from './CRMMetrics';
import CRMCharts from './CRMCharts';
import AnalyticsTab from './AnalyticsTab';
import AutomationTab from './AutomationTab';
import CustomerList from './CustomerList';
import CustomerFilters from './CustomerFilters';
import AddCustomerDialog from './AddCustomerDialog';
import { useCRMData } from '@/hooks/useCRMData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContactInteraction {
  id: string;
  customer_id: number;
  interaction_type: string;
  subject: string;
  description?: string;
  interaction_date: string;
  status: string;
  priority: string;
  outcome?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

interface CommunicationHistory {
  id: string;
  customer_id: number;
  type: string;
  subject?: string;
  content?: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
}

interface CRMTabsProps {
  interactions: ContactInteraction[];
  communications: CommunicationHistory[];
  loading: boolean;
}

const CRMTabs = ({ interactions, communications, loading }: CRMTabsProps) => {
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const crmData = useCRMData();

  return (
    <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
        <TabsTrigger value="contacts" className="text-xs sm:text-sm">Contacts</TabsTrigger>
        <TabsTrigger value="interactions" className="text-xs sm:text-sm">Interactions</TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        <TabsTrigger value="automation" className="text-xs sm:text-sm">Automation</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 sm:space-y-6">
        <CRMMetrics />
        <CRMCharts />
      </TabsContent>

      <TabsContent value="contacts" className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold">Contacts & Leads</h3>
            <p className="text-sm text-muted-foreground">Manage your customer contacts and leads</p>
          </div>
          <Button onClick={() => setShowAddCustomer(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
        <CustomerFilters
          searchTerm={crmData.searchTerm}
          setSearchTerm={crmData.setSearchTerm}
          statusFilter={crmData.statusFilter}
          setStatusFilter={crmData.setStatusFilter}
          segmentFilter={crmData.segmentFilter}
          setSegmentFilter={crmData.setSegmentFilter}
        />
        <CustomerList customers={crmData.customers} />
        <AddCustomerDialog 
          open={showAddCustomer} 
          onOpenChange={setShowAddCustomer}
        />
      </TabsContent>

      <TabsContent value="interactions" className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Interactions</h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{interaction.subject}</h4>
                  <p className="text-sm text-gray-600">{interaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(interaction.interaction_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="automation" className="space-y-4 sm:space-y-6">
        <AutomationTab />
      </TabsContent>
    </Tabs>
  );
};

export default CRMTabs;
