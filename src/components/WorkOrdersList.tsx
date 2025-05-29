
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Case } from '@/types/case';

interface WorkOrdersListProps {
  cases: Case[];
  loading: boolean;
  onCaseClick: (case_: Case) => void;
}

const WorkOrdersList = React.memo(({ cases, loading, onCaseClick }: WorkOrdersListProps) => {
  const formatDate = useMemo(() => (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  }, []);

  const displayedCases = useMemo(() => cases.slice(0, 10), [cases]);

  const getBadgeVariant = useMemo(() => (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  }, []);

  // Determine if we're showing completed cases
  const isCompletedView = cases.length > 0 && cases.every(case_ => case_.status === 'Completed');
  const title = isCompletedView ? "Completed Work Orders" : "Work Orders";

  if (loading) {
    return (
      <div className="flex justify-center">
        <Card className="dark:bg-slate-800 dark:border-slate-700 w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="dark:text-slate-100">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">Loading work orders...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cases.length === 0) {
    const emptyMessage = isCompletedView 
      ? "No completed work orders found."
      : "No work orders found. Create your first work order using the Add WO tab.";

    return (
      <div className="flex justify-center">
        <Card className="dark:bg-slate-800 dark:border-slate-700 w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="dark:text-slate-100">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">{emptyMessage}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Card className="dark:bg-slate-800 dark:border-slate-700 w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="dark:text-slate-100">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedCases.map((case_) => (
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
                <Badge variant={getBadgeVariant(case_.status)}>
                  {case_.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

WorkOrdersList.displayName = 'WorkOrdersList';

export default WorkOrdersList;
