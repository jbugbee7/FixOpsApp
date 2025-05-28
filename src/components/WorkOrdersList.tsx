
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Case {
  id: string;
  customer_name: string;
  appliance_brand: string;
  appliance_type: string;
  status: string;
  created_at: string;
  customer_phone?: string;
  customer_address?: string;
  problem_description: string;
  initial_diagnosis?: string;
}

interface WorkOrdersListProps {
  cases: Case[];
  loading: boolean;
  onCaseClick: (case_: Case) => void;
}

const WorkOrdersList = ({ cases, loading, onCaseClick }: WorkOrdersListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex justify-center">
      <Card className="dark:bg-slate-800 dark:border-slate-700 w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="dark:text-slate-100">Recent Workorders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">Loading work orders...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">No work orders found. Create your first work order using the Add WO tab.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.slice(0, 5).map((case_) => (
                <div 
                  key={case_.id} 
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => onCaseClick(case_)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{case_.customer_name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{case_.appliance_brand} {case_.appliance_type}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(case_.created_at)}</p>
                  </div>
                  <Badge 
                    variant={case_.status === 'Completed' ? 'default' : case_.status === 'In Progress' ? 'secondary' : 'outline'}
                  >
                    {case_.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrdersList;
