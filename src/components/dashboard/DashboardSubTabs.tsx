
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Home, CheckCircle } from 'lucide-react';
import DashboardWorkOrders from './DashboardWorkOrders';
import DashboardCompletedOrders from './DashboardCompletedOrders';
import type { Case } from '@/types/case';

interface DashboardSubTabsProps {
  isOnline: boolean;
  hasOfflineData: boolean;
  cases: Case[];
  loading: boolean;
  isResyncing: boolean;
  displayName: string;
  onNavigate: (tab: string) => void;
  onModelFound: (model: any) => void;
  onPartFound: (part: any) => void;
  onCaseClick: (case_: Case) => void;
  onResync: () => void;
}

const DashboardSubTabs = (props: DashboardSubTabsProps) => {
  // Filter out cancelled work orders from both tabs
  const activeCases = props.cases.filter(case_ => 
    case_.status !== 'Completed' && case_.status !== 'cancel'
  );
  
  const completedCases = props.cases.filter(case_ => 
    case_.status === 'Completed'
  );

  return (
    <Tabs defaultValue="work-orders" className="w-full">
      <div className="flex justify-center mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="work-orders" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Work Orders ({activeCases.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedCases.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="work-orders" className="m-0">
        <DashboardWorkOrders 
          {...props} 
          cases={props.cases}
        />
      </TabsContent>

      <TabsContent value="completed" className="m-0">
        <DashboardCompletedOrders 
          {...props} 
          cases={props.cases}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardSubTabs;
