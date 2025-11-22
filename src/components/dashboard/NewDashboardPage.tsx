import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Users, Wrench, Clock, CheckCircle, AlertTriangle, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRealTimeDashboardData } from '@/hooks/useRealTimeDashboardData';
import { useCompany } from '@/hooks/useCompany';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewDashboardPageProps {
  onNavigate?: (tab: string) => void;
}

const NewDashboardPage = ({ onNavigate }: NewDashboardPageProps) => {
  const isMobile = useIsMobile();
  const { metrics, monthlyData, serviceCategories, loading, error } = useRealTimeDashboardData();
  const { company } = useCompany();
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
                      fontSize: isMobile ? 10 : 12,
                      color: 'hsl(var(--foreground))'
                    }}
                    iconSize={isMobile ? 10 : 14}
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
