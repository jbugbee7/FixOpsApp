
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Wrench, Globe, ChevronRight } from 'lucide-react';
import { Case } from '@/types/case';

interface WorkOrdersListProps {
  cases: (Case | any)[];
  onCaseClick: (caseItem: Case | any) => void;
}

const WorkOrdersList = ({ cases, onCaseClick }: WorkOrdersListProps) => {
  console.log('WorkOrdersList received cases:', cases);
  console.log('Cases count:', cases.length);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'in progress':
        return 'bg-red-200 text-red-800 dark:bg-red-800/30 dark:text-red-200';
      case 'completed':
        return 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isPublicCase = (caseItem: any) => {
    return !caseItem.user_id;
  };

  if (cases.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
          <Wrench className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No work orders found</h3>
        <p className="text-sm text-muted-foreground">Get started by creating your first work order.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {cases.map((caseItem) => {
        console.log('Rendering case:', caseItem.id, 'isPublic:', isPublicCase(caseItem));
        return (
          <Card 
            key={caseItem.id} 
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl"
            onClick={() => onCaseClick(caseItem)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      {isPublicCase(caseItem) && (
                        <Globe className="h-4 w-4 text-primary" />
                      )}
                      {caseItem.wo_number || `WO-${caseItem.id.slice(0, 8)}`}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(caseItem.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPublicCase(caseItem) && (
                    <Badge variant="outline" className="text-xs rounded-full">
                      Public
                    </Badge>
                  )}
                  <Badge className={`${getStatusColor(caseItem.status)} rounded-full px-3`}>
                    {caseItem.status}
                  </Badge>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background">
                    <User className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="text-sm font-medium truncate">{caseItem.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background">
                    <Wrench className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Appliance</p>
                    <p className="text-sm font-medium truncate">{caseItem.appliance_brand} {caseItem.appliance_type}</p>
                  </div>
                </div>

                {(caseItem.customer_city || caseItem.customer_state) && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background">
                      <MapPin className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium truncate">
                        {caseItem.customer_city}{caseItem.customer_city && caseItem.customer_state ? ', ' : ''}
                        {caseItem.customer_state}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-3 p-3 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Issue</p>
                <p className="text-sm line-clamp-2">
                  {caseItem.problem_description}
                </p>
              </div>

              {isPublicCase(caseItem) && (
                <div className="mt-3 p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl border border-primary/30">
                  <p className="text-xs text-primary flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    This is a public work order. Edit it to claim ownership.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WorkOrdersList;
