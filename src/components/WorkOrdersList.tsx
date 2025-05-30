
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Wrench } from 'lucide-react';
import { Case } from '@/types/case';

interface WorkOrdersListProps {
  cases: Case[];
  onCaseClick: (caseItem: Case) => void;
}

const WorkOrdersList = ({ cases, onCaseClick }: WorkOrdersListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No work orders found</h3>
        <p className="text-gray-500 dark:text-gray-400">Get started by creating your first work order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <Card 
          key={caseItem.id} 
          className="cursor-pointer hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700"
          onClick={() => onCaseClick(caseItem)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg dark:text-slate-100">
                {caseItem.wo_number || `WO-${caseItem.id.slice(0, 8)}`}
              </CardTitle>
              <Badge className={getStatusColor(caseItem.status)}>
                {caseItem.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{caseItem.customer_name}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Wrench className="h-4 w-4" />
              <span>{caseItem.appliance_brand} {caseItem.appliance_type}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(caseItem.created_at)}</span>
            </div>

            {(caseItem.customer_city || caseItem.customer_state) && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>
                  {caseItem.customer_city}{caseItem.customer_city && caseItem.customer_state ? ', ' : ''}
                  {caseItem.customer_state}
                </span>
              </div>
            )}
            
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {caseItem.problem_description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkOrdersList;
