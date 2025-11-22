import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const chartConfig = {
    workOrders: {
      label: "Work Orders",
      color: "#DC2626",
    },
    revenue: {
      label: "Revenue",
      color: "#991B1B",
    },
    completion: {
      label: "Completion Rate",
      color: "#B91C1C",
    },
  };

  // Red color palette for pie charts
  const redColorPalette = [
    '#DC2626', // red-600
    '#991B1B', // red-800
    '#B91C1C', // red-700
    '#EF4444', // red-500
    '#7F1D1D', // red-900
    '#FCA5A5', // red-300
  ];

  // Transform monthly data to pie chart format for work orders
  const workOrdersPieData = monthlyData.map((item, index) => ({
    name: item.month,
    value: item.workOrders,
    color: redColorPalette[index % redColorPalette.length]
  }));

  // Transform monthly data to pie chart format for revenue
  const revenuePieData = monthlyData.map((item, index) => ({
    name: item.month,
    value: item.revenue,
    color: redColorPalette[index % redColorPalette.length]
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
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${metrics.monthlyGrowth >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
                    {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(0)}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{metrics.totalWorkOrders}</div>
                <p className="text-xs text-muted-foreground">Work Orders</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-600/30">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center">
                    <span className="text-xs font-bold">{metrics.completionRate.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{metrics.completionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-pink-700 shadow-lg shadow-purple-700/30">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">
                  ${(metrics.monthlyRevenue / 1000).toFixed(1)}k
                </div>
                <p className="text-xs text-muted-foreground">Monthly Revenue</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-800 to-pink-800 shadow-lg shadow-purple-800/30">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{metrics.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section with Section Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Performance</h2>
              <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Work Orders Distribution</CardTitle>
                  <CardDescription className="text-sm">Monthly work order breakdown</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getPieChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={workOrdersPieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={isMobile ? "50%" : "65%"}
                          fill="#8884d8"
                          dataKey="value"
                          labelLine={false}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {workOrdersPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value, name) => [`${value} orders`, name]}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          height={isMobile ? 20 : 36}
                          wrapperStyle={{ fontSize: getLegendFontSize() }}
                          iconSize={isMobile ? 10 : 14}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Revenue Distribution</CardTitle>
                  <CardDescription className="text-sm">Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getPieChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenuePieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={isMobile ? "50%" : "65%"}
                          fill="#8884d8"
                          dataKey="value"
                          labelLine={false}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {revenuePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value, name) => [`$${(Number(value) / 1000).toFixed(1)}k`, name]}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          height={isMobile ? 20 : 36}
                          wrapperStyle={{ fontSize: getLegendFontSize() }}
                          iconSize={isMobile ? 10 : 14}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Service Categories</CardTitle>
                  <CardDescription className="text-sm">Distribution by appliance type</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getPieChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={isMobile ? "50%" : "65%"}
                          fill="#8884d8"
                          dataKey="value"
                          labelLine={false}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {serviceCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          height={isMobile ? 20 : 36}
                          wrapperStyle={{ fontSize: getLegendFontSize() }}
                          iconSize={isMobile ? 10 : 14}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Categories as Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Service Categories</h2>
              <button className="text-sm text-red-600 dark:text-red-400 hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {serviceCategories.slice(0, 5).map((category, index) => (
                <Card key={index} className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                        <Wrench className="h-5 w-5" style={{ color: category.color }} />
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
    </div>
  );
};

export default NewDashboardPage;
