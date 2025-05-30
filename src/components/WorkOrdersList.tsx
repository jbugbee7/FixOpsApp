
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, User, Wrench, Calendar } from 'lucide-react';
import type { Case } from '@/types/case';

interface WorkOrdersListProps {
  cases: Case[];
  loading: boolean;
  onCaseClick: (case_: Case) => void;
}

const WorkOrdersList = React.memo(({ cases, loading, onCaseClick }: WorkOrdersListProps) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

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

  const toggleCardExpansion = (caseId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(caseId)) {
        newSet.delete(caseId);
      } else {
        newSet.add(caseId);
      }
      return newSet;
    });
  };

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
            {displayedCases.map((case_) => {
              const isExpanded = expandedCards.has(case_.id);
              const Icon = isExpanded ? ChevronUp : ChevronDown;
              
              return (
                <Card key={case_.id} className="dark:bg-slate-700 dark:border-slate-600">
                  <CardHeader 
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600/50 transition-colors"
                    onClick={() => onCaseClick(case_)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">{case_.customer_name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{case_.appliance_brand} {case_.appliance_type}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(case_.created_at)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={getBadgeVariant(case_.status)}>
                          {case_.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => toggleCardExpansion(case_.id, e)}
                          className="p-1"
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="animate-fade-in border-t dark:border-slate-600">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Customer Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <User className="h-4 w-4" />
                            <span>Customer</span>
                          </div>
                          <div className="text-sm">
                            <p className="dark:text-slate-200">{case_.customer_phone || 'No phone'}</p>
                            <p className="dark:text-slate-200">{case_.customer_email || 'No email'}</p>
                            <p className="dark:text-slate-200">{case_.customer_address || 'No address'}</p>
                          </div>
                        </div>

                        {/* Appliance Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Wrench className="h-4 w-4" />
                            <span>Appliance</span>
                          </div>
                          <div className="text-sm">
                            <p className="dark:text-slate-200">Model: {case_.appliance_model || 'N/A'}</p>
                            <p className="dark:text-slate-200">Serial: {case_.serial_number || 'N/A'}</p>
                            <p className="dark:text-slate-200">Warranty: {case_.warranty_status || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Service Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Calendar className="h-4 w-4" />
                            <span>Service</span>
                          </div>
                          <div className="text-sm">
                            <p className="dark:text-slate-200">Type: {case_.service_type || 'General'}</p>
                            <p className="dark:text-slate-200">Time: {case_.estimated_time || 'TBD'}</p>
                            <p className="dark:text-slate-200 truncate">Issue: {case_.problem_description}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

WorkOrdersList.displayName = 'WorkOrdersList';

export default WorkOrdersList;
