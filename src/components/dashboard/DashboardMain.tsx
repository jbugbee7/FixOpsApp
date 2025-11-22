
import React, { useMemo } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSubTabs from './DashboardSubTabs';
import type { Case } from '@/types/case';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, CheckCircle, Clock, AlertCircle, TrendingUp, Activity, RefreshCw, Calendar } from 'lucide-react';

interface DashboardMainProps {
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

const DashboardMain = React.memo((props: DashboardMainProps) => {
  const isMobile = useIsMobile();

  // Calculate stats from cases
  const stats = useMemo(() => {
    const activeCases = props.cases.filter(c => 
      c.status !== 'Completed' && c.status !== 'cancel' && c.spt_status !== 'spr'
    );
    const completedCases = props.cases.filter(c => c.status === 'Completed');
    const sprCases = props.cases.filter(c => c.spt_status === 'spr');
    const urgentCases = activeCases.filter(c => 
      c.status === 'Urgent' || c.status === 'In Progress'
    );
    
    return {
      active: activeCases.length,
      completed: completedCases.length,
      spr: sprCases.length,
      urgent: urgentCases.length,
      total: props.cases.length
    };
  }, [props.cases]);

  // Recent activity (last 5 cases)
  const recentCases = useMemo(() => 
    [...props.cases]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 5),
    [props.cases]
  );

  // Mobile view - keep existing simple design
  if (isMobile) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 relative">
        <DashboardHeader />
        <DashboardSubTabs {...props} />
      </div>
    );
  }

  // Desktop view - new detailed design
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-shrink-0 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold mb-1">Work Orders Management</h1>
          <p className="text-muted-foreground">Track and manage all work orders, service requests, and repairs</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-8 space-y-6">
              <DashboardSubTabs {...props} />
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="col-span-4 space-y-6">
              {/* Quick Stats */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Work Order Overview</CardTitle>
                  <CardDescription>Key metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Active Orders</span>
                    </div>
                    <Badge variant="secondary">{stats.active}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <Badge variant="secondary">{stats.completed}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-secondary" />
                      <span className="text-sm font-medium">SPR Orders</span>
                    </div>
                    <Badge variant="secondary">{stats.spr}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-sm font-medium">Urgent</span>
                    </div>
                    <Badge variant="destructive">{stats.urgent}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={props.onResync}
                    disabled={props.isResyncing}
                    className="w-full justify-start h-auto p-3"
                    variant="outline"
                  >
                    <RefreshCw className={`h-4 w-4 mr-3 flex-shrink-0 ${props.isResyncing ? 'animate-spin' : ''}`} />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {props.isResyncing ? 'Syncing...' : props.isOnline ? 'Sync Data' : 'Load Cache'}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {props.isResyncing ? 'Please wait...' : 'Refresh work orders'}
                      </div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => props.onNavigate('scheduling')}
                    className="w-full justify-start h-auto p-3"
                    variant="outline"
                  >
                    <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-sm">Schedule Jobs</div>
                      <div className="text-xs text-muted-foreground truncate">Manage schedules</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest work orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentCases.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  ) : (
                    recentCases.map((case_) => (
                      <div 
                        key={case_.id} 
                        className="flex items-start gap-3 pb-3 border-b border-border last:border-0 cursor-pointer hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-colors"
                        onClick={() => props.onCaseClick(case_)}
                      >
                        <Activity className="h-4 w-4 text-accent mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {case_.customer_name || 'Unknown Customer'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {case_.appliance_type} - {case_.status || 'Pending'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {case_.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="font-medium">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Orders</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Response Time</span>
                    <span className="font-medium">2.4 hrs</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardMain.displayName = 'DashboardMain';

export default DashboardMain;
