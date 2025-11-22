import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, Users, Wrench, Clock, CheckCircle, AlertTriangle, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRealTimeDashboardData } from '@/hooks/useRealTimeDashboardData';
import { useCompany } from '@/hooks/useCompany';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const NewDashboardPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
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

  // Mobile-first chart configuration
  const getChartHeight = () => isMobile ? '200px' : '300px';
  const getAreaChartHeight = () => isMobile ? '220px' : '300px';
  const getPieChartHeight = () => isMobile ? '180px' : '250px';

  const getChartMargins = () => ({
    top: isMobile ? 10 : 20,
    right: isMobile ? 5 : 30,
    left: isMobile ? 0 : 20,
    bottom: isMobile ? 30 : 20
  });

  const getTickFontSize = () => isMobile ? 8 : 12;
  const getLegendFontSize = () => isMobile ? 8 : 12;
  const getAxisWidth = () => isMobile ? 20 : 60;

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
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-black dark:from-red-500 dark:to-white bg-clip-text text-transparent">
              {company?.name || 'FixOps'} Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="text-sm font-medium">Just now</p>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <Card className="px-4 py-2.5 rounded-2xl bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-8">
          {/* Stats Overview - Modern Card Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30">
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
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-600/30">
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
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-800 shadow-lg shadow-red-700/30">
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
            
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-800 to-red-900 shadow-lg shadow-red-800/30">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{metrics.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'workOrders' }))}
                className="p-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">New Order</span>
                </div>
              </button>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'crm' }))}
                className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium">Customers</span>
                </div>
              </button>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'crm' }))}
                className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium">Analytics</span>
                </div>
              </button>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'accounting' }))}
                className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PieChartIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium">Reports</span>
                </div>
              </button>
            </div>
          </div>

          {/* Charts Section with Section Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Performance</h2>
              <button className="text-sm text-red-600 dark:text-red-400 hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Monthly Trends</CardTitle>
                  <CardDescription className="text-sm">Work orders and revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getAreaChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData} margin={getChartMargins()}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: getTickFontSize() }}
                          interval={0}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? 'end' : 'middle'}
                          height={isMobile ? 40 : 30}
                        />
                        <YAxis 
                          yAxisId="left" 
                          tick={{ fontSize: getTickFontSize() }}
                          width={getAxisWidth()}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          tick={{ fontSize: getTickFontSize() }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          width={isMobile ? 15 : 40}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {!isMobile && (
                          <Legend 
                            wrapperStyle={{ fontSize: getLegendFontSize() }}
                            iconSize={12}
                          />
                        )}
                        <Area 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="workOrders" 
                          stackId="1"
                          stroke="#DC2626" 
                          fill="#DC2626"
                          fillOpacity={0.3}
                          name="Work Orders"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#991B1B" 
                          strokeWidth={isMobile ? 2 : 3}
                          name="Revenue ($)"
                          dot={{ fill: '#991B1B', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
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
                          outerRadius={isMobile ? "45%" : "60%"}
                          fill="#8884d8"
                          dataKey="value"
                          labelLine={false}
                        >
                          {serviceCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend 
                          verticalAlign="bottom"
                          height={isMobile ? 20 : 36}
                          wrapperStyle={{ fontSize: getLegendFontSize() }}
                          iconSize={isMobile ? 8 : 18}
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
