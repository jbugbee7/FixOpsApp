import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, Users, Wrench, Clock, CheckCircle, AlertTriangle, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRealTimeDashboardData } from '@/hooks/useRealTimeDashboardData';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NewDashboardPage = () => {
  const isMobile = useIsMobile();
  const { metrics, monthlyData, serviceCategories, loading, error } = useRealTimeDashboardData();

  const chartConfig = {
    workOrders: {
      label: "Work Orders",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
    completion: {
      label: "Completion Rate",
      color: "hsl(var(--chart-3))",
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
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card>
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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Business Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Real-time business analytics and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Card className="px-3 py-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-medium">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
            <TabsTrigger value="financial" className="text-xs sm:text-sm">Financial</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Work Orders</CardTitle>
                  <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{metrics.totalWorkOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={metrics.monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                      {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}%
                    </span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Completion Rate</CardTitle>
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">Good performance</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                    ${metrics.monthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className={metrics.monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                      {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}%
                    </span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{metrics.avgResponseTime}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">Good response</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Monthly Trends</CardTitle>
                  <CardDescription className="text-sm">Work orders and revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className="w-full overflow-hidden">
                    <ChartContainer 
                      config={chartConfig} 
                      className="w-full"
                      style={{ height: getAreaChartHeight() }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                          data={monthlyData}
                          margin={getChartMargins()}
                        >
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
                            stroke="#8B5CF6" 
                            fill="#8B5CF6"
                            fillOpacity={0.3}
                            name="Work Orders"
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#10B981" 
                            strokeWidth={isMobile ? 2 : 3}
                            name="Revenue ($)"
                            dot={{ fill: '#10B981', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Service Categories</CardTitle>
                  <CardDescription className="text-sm">Distribution by appliance type</CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
                  <div className="w-full overflow-hidden">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{metrics.avgResponseTime}</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Wrench className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{metrics.totalWorkOrders}</div>
                    <div className="text-sm text-muted-foreground">Total Work Orders</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{metrics.monthlyGrowth.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Monthly Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">${metrics.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth Rate</span>
                    <span className={`font-semibold ${metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.monthlyGrowth >= 0 ? '+' : ''}{metrics.monthlyGrowth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Work Orders</span>
                    <span className="font-semibold">{metrics.totalWorkOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold text-green-600">{metrics.completionRate.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceCategories.slice(0, 4).map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{service.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Avg Response Time</span>
                    <span className="font-semibold">{metrics.avgResponseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Categories</span>
                    <span className="font-semibold">{serviceCategories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Category</span>
                    <span className="font-semibold">{serviceCategories[0]?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-semibold text-green-600">{metrics.completionRate.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Intelligence</CardTitle>
                <CardDescription>Advanced analytics and insights from real data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{serviceCategories.length}</div>
                    <div className="text-sm text-muted-foreground">Service Types</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{metrics.avgResponseTime}</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{metrics.monthlyGrowth.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default NewDashboardPage;
