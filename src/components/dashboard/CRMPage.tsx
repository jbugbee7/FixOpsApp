
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, TrendingUp, Mail, Phone, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CRMHeader from './crm/CRMHeader';
import CRMTabs from './crm/CRMTabs';
import { useRealtimeCRMData } from '@/hooks/useRealtimeCRMData';
import { useIsMobile } from '@/hooks/use-mobile';

const CRMPage = ({ fromDashboard = false, onNavigate }: { fromDashboard?: boolean; onNavigate?: (tab: string) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromDashboard = fromDashboard || location.state?.fromQuickAction;
  const { interactions, communications, loading, error } = useRealtimeCRMData();
  const isMobile = useIsMobile();

  // Mobile view (keep existing simple design)
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex-shrink-0 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <CRMHeader />
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-6 h-full">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <CRMTabs
              interactions={interactions} 
              communications={communications} 
              loading={loading} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop view (new detailed design)
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-shrink-0 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold mb-1">Customer Relationship Management</h1>
          <p className="text-muted-foreground">Manage customers, track interactions, and analyze relationships</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-8 space-y-6">
              <CRMTabs
                interactions={interactions} 
                communications={communications} 
                loading={loading} 
              />
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="col-span-4 space-y-6">
              {/* Quick Stats */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Customer Overview</CardTitle>
                  <CardDescription>Key metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Total Customers</span>
                    </div>
                    <Badge variant="secondary">{interactions.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <span className="text-sm font-medium">Active This Month</span>
                    </div>
                    <Badge variant="secondary">{Math.floor(interactions.length * 0.7)}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-secondary" />
                      <span className="text-sm font-medium">Communications</span>
                    </div>
                    <Badge variant="secondary">{communications.length}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest customer interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {interactions.slice(0, 4).map((interaction, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <Activity className="h-4 w-4 text-accent mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{interaction.subject}</p>
                        <p className="text-xs text-muted-foreground">{interaction.interaction_type} - {new Date(interaction.interaction_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pending Actions */}
              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Pending Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Follow-up calls</span>
                    </div>
                    <Badge>3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Email responses</span>
                    </div>
                    <Badge>5</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium">Scheduled meetings</span>
                    </div>
                    <Badge>2</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMPage;
