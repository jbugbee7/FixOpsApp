
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, User, Wrench } from 'lucide-react';
import { Case } from '@/types/case';

interface WorkOrderReferenceProps {
  workOrder: Case;
  onViewDetails: (workOrder: Case) => void;
}

const WorkOrderReference = ({ workOrder, onViewDetails }: WorkOrderReferenceProps) => {
  const handleClick = () => {
    onViewDetails(workOrder);
  };

  return (
    <Card 
      className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors my-2"
      onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                {workOrder.wo_number || `WO-${workOrder.id.slice(0, 8)}`}
              </h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                workOrder.status === 'Completed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : workOrder.status === 'In Progress'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {workOrder.status}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                <User className="h-3 w-3 mr-1" />
                <span className="truncate">{workOrder.customer_name}</span>
              </div>
              
              <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                <Wrench className="h-3 w-3 mr-1" />
                <span className="truncate">{workOrder.appliance_brand} {workOrder.appliance_type}</span>
              </div>
              
              <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                <Clock className="h-3 w-3 mr-1" />
                <span>{new Date(workOrder.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 line-clamp-2">
              {workOrder.problem_description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderReference;
