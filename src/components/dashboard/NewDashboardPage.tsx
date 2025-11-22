import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Users, Wrench, Clock, CheckCircle, AlertTriangle, Calendar, BarChart3, PieChart as PieChartIcon, Bell, Activity, Package } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRealTimeDashboardData } from '@/hooks/useRealTimeDashboardData';
import { useCompany } from '@/hooks/useCompany';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface NewDashboardPageProps {
  onNavigate?: (tab: string) => void;
}

const NewDashboardPage = ({ onNavigate }: NewDashboardPageProps) => {
  const isMobile = useIsMobile();
  const { metrics, monthlyData, serviceCategories, loading, error } = useRealTimeDashboardData();
  const { company } = useCompany();
  const { userProfile } = useAuth();
  const [selectedChart, setSelectedChart] = useState<'workOrders' | 'revenue' | 'services' | null>(null);

  const chartConfig = {
    workOrders: {
      label: "Work Orders",
      color: "hsl(var(--primary))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--accent))",
    },
    completion: {
      label: "Completion Rate",
      color: "hsl(var(--secondary))",
    },
  };

  // Distinct color palette with varied hues for better visual distinction
  const colorPalette = [
    'hsl(210 80% 60%)', // bright blue
    'hsl(0 85% 65%)',   // crimson red
    'hsl(140 70% 55%)', // green
    'hsl(280 70% 65%)', // purple
    'hsl(35 90% 60%)',  // orange
    'hsl(190 75% 55%)', // cyan
  ];

  // Transform monthly data to pie chart format for work orders
  const workOrdersPieData = monthlyData.map((item, index) => ({
    name: item.month,
    value: item.workOrders,
    color: colorPalette[index % colorPalette.length]
  }));

  // Transform monthly data to pie chart format for revenue
  const revenuePieData = monthlyData.map((item, index) => ({
    name: item.month,
    value: item.revenue,
    color: colorPalette[index % colorPalette.length]
  }));

  // Mobile-first chart configuration
  const getPieChartHeight = () => isMobile ? '200px' : '280px';

  const getLegendFontSize = () => isMobile ? 10 : 12;

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 rounded-2xl">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-400">
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Mobile view (keep existing simple design)
  if (isMobile) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Stats Overview - Modern Card Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gun-metal/10 dark:bg-gun-metal/20">
                    <Wrench className="h-5 w-5 text-accent" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${metrics.monthlyGrowth >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
                    {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(0)}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{metrics.totalWorkOrders}</div>
                <p className="text-xs text-muted-foreground">Work Orders</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gun-metal/10 dark:bg-gun-metal/20">
                    <CheckCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center">
                    <span className="text-xs font-bold">{metrics.completionRate.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{metrics.completionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gun-metal/10 dark:bg-gun-metal/20">
                    <DollarSign className="h-5 w-5 text-accent" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">
                  ${(metrics.monthlyRevenue / 1000).toFixed(1)}k
                </div>
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gun-metal/10 dark:bg-gun-metal/20">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <AlertTriangle className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{metrics.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section - Stacked Cards */}
          <div>
            <div className="space-y-3">
              {/* Work Orders Distribution Card */}
              <Card 
                className="rounded-2xl border-border/50 bg-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedChart('workOrders')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10">
                        <BarChart3 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Work Orders Distribution</h3>
                        <p className="text-sm text-muted-foreground">Monthly work order breakdown</p>
                      </div>
                    </div>
                    <PieChartIcon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Distribution Card */}
              <Card 
                className="rounded-2xl border-border/50 bg-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedChart('revenue')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10">
                        <DollarSign className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Revenue Distribution</h3>
                        <p className="text-sm text-muted-foreground">Monthly revenue breakdown</p>
                      </div>
                    </div>
                    <PieChartIcon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </CardContent>
              </Card>

              {/* Service Categories Card */}
              <Card 
                className="rounded-2xl border-border/50 bg-card backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedChart('services')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10">
                        <Wrench className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Service Categories</h3>
                        <p className="text-sm text-muted-foreground">Distribution by appliance type</p>
                      </div>
                    </div>
                    <PieChartIcon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Categories as Cards */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {serviceCategories.slice(0, 5).map((category, index) => (
                <Card key={index} className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gun-metal/10 dark:bg-gun-metal/20">
                        <Wrench className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted">
                        {category.value}%
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">{category.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">devices</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Chart Sheet - Slides up from bottom */}
        <Sheet open={selectedChart !== null} onOpenChange={() => setSelectedChart(null)}>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>
                {selectedChart === 'workOrders' && 'Work Orders Distribution'}
                {selectedChart === 'revenue' && 'Revenue Distribution'}
                {selectedChart === 'services' && 'Service Categories'}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 h-[calc(100%-80px)]">
              <ChartContainer 
                config={chartConfig} 
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        selectedChart === 'workOrders' ? workOrdersPieData :
                        selectedChart === 'revenue' ? revenuePieData :
                        serviceCategories
                      }
                      cx="50%"
                      cy="50%"
                      outerRadius="60%"
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {(selectedChart === 'workOrders' ? workOrdersPieData :
                        selectedChart === 'revenue' ? revenuePieData :
                        serviceCategories).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      formatter={(value, name) => {
                        if (selectedChart === 'revenue') return [`$${(Number(value) / 1000).toFixed(1)}k`, name];
                        if (selectedChart === 'services') return [`${value}%`, name];
                        return [`${value} orders`, name];
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom"
                      height={36}
                      wrapperStyle={{ 
                        fontSize: 10,
                        color: 'hsl(var(--foreground))'
                      }}
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop view (new detailed design)
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-shrink-0 border-b">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center h-[52px]">
          <h1 className="text-sm font-bold text-foreground">Welcome, {userProfile?.full_name || 'User'}</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-8 space-y-6">
              {/* What's New Section */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">What's new</CardTitle>
                    <Badge variant="secondary" className="rounded-full">3 updates</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10">
                      <Bell className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">New work order assigned</h4>
                      <p className="text-sm text-muted-foreground">Refrigerator repair scheduled for tomorrow</p>
                      <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Work order completed</h4>
                      <p className="text-sm text-muted-foreground">Washing machine repair marked as complete</p>
                      <p className="text-xs text-muted-foreground mt-2">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/10">
                      <Package className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Parts inventory low</h4>
                      <p className="text-sm text-muted-foreground">3 items below reorder point</p>
                      <p className="text-xs text-muted-foreground mt-2">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Dashboard Section */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Your dashboard</CardTitle>
                  <CardDescription>Key metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <Wrench className="h-5 w-5 text-primary" />
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                          +{metrics.monthlyGrowth.toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-3xl font-bold mb-1">{metrics.totalWorkOrders}</div>
                      <p className="text-sm text-muted-foreground">Total Work Orders</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                      <div className="flex items-center justify-between mb-3">
                        <DollarSign className="h-5 w-5 text-accent" />
                        <TrendingUp className="h-5 w-5 text-accent" />
                      </div>
                      <div className="text-3xl font-bold mb-1">${(metrics.monthlyRevenue / 1000).toFixed(1)}k</div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                      <div className="flex items-center justify-between mb-3">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        <div className="text-sm font-bold">{metrics.completionRate.toFixed(0)}%</div>
                      </div>
                      <div className="text-3xl font-bold mb-1">{metrics.completionRate.toFixed(1)}%</div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <Clock className="h-5 w-5 text-foreground" />
                        <AlertTriangle className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="text-3xl font-bold mb-1">{metrics.avgResponseTime}</div>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Center */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Action center</CardTitle>
                  <CardDescription>Items requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>
                        <span className="font-medium">Approve pending work orders</span>
                      </div>
                      <span className="text-sm text-muted-foreground">3 items</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-500 hover:bg-blue-600">Review</Badge>
                        <span className="font-medium">Review completed jobs</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2 items</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive">Urgent</Badge>
                        <span className="font-medium">Low inventory alerts</span>
                      </div>
                      <span className="text-sm text-muted-foreground">3 items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="col-span-4 space-y-6">
              {/* Service Categories */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Service Categories</CardTitle>
                  <CardDescription>Distribution by type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceCategories.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10">
                          <Wrench className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary">{category.value}%</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Build Log / Activity */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 pb-3 border-b border-border">
                    <Activity className="h-4 w-4 text-accent mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">New customer added</p>
                      <p className="text-xs text-muted-foreground">2 min ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-border">
                    <Activity className="h-4 w-4 text-primary mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Invoice sent</p>
                      <p className="text-xs text-muted-foreground">15 min ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-border">
                    <Activity className="h-4 w-4 text-secondary mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Technician updated schedule</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Parts inventory updated</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Jobs</span>
                    <span className="text-lg font-bold">{metrics.totalWorkOrders - Math.round(metrics.totalWorkOrders * metrics.completionRate / 100)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="text-lg font-bold">{Math.round(metrics.totalWorkOrders * metrics.completionRate / 100)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue/Order</span>
                    <span className="text-lg font-bold">${metrics.totalWorkOrders > 0 ? (metrics.monthlyRevenue / metrics.totalWorkOrders).toFixed(0) : '0'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Chart Sheet - Slides up from bottom */}
      <Sheet open={selectedChart !== null} onOpenChange={() => setSelectedChart(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>
              {selectedChart === 'workOrders' && 'Work Orders Distribution'}
              {selectedChart === 'revenue' && 'Revenue Distribution'}
              {selectedChart === 'services' && 'Service Categories'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 h-[calc(100%-80px)]">
            <ChartContainer 
              config={chartConfig} 
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      selectedChart === 'workOrders' ? workOrdersPieData :
                      selectedChart === 'revenue' ? revenuePieData :
                      serviceCategories
                    }
                    cx="50%"
                    cy="50%"
                    outerRadius="60%"
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {(selectedChart === 'workOrders' ? workOrdersPieData :
                      selectedChart === 'revenue' ? revenuePieData :
                      serviceCategories).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    formatter={(value, name) => {
                      if (selectedChart === 'revenue') return [`$${(Number(value) / 1000).toFixed(1)}k`, name];
                      if (selectedChart === 'services') return [`${value}%`, name];
                      return [`${value} orders`, name];
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ 
                      fontSize: 12,
                      color: 'hsl(var(--foreground))'
                    }}
                    iconSize={14}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NewDashboardPage;
