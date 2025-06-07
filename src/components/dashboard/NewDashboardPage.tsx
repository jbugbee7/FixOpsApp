import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, Users, Wrench, Clock, CheckCircle, AlertTriangle, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const NewDashboardPage = () => {
  const isMobile = useIsMobile();

  // Mock data for reporting
  const monthlyMetrics = [
    { month: 'Aug', workOrders: 45, revenue: 8400, completion: 92 },
    { month: 'Sep', workOrders: 52, revenue: 9600, completion: 89 },
    { month: 'Oct', workOrders: 61, revenue: 11200, completion: 94 },
    { month: 'Nov', workOrders: 58, revenue: 10800, completion: 91 },
    { month: 'Dec', workOrders: 67, revenue: 12400, completion: 96 },
    { month: 'Jan', workOrders: 73, revenue: 13800, completion: 93 }
  ];

  const serviceCategories = [
    { name: 'HVAC', value: 35, count: 156, color: '#8B5CF6' },
    { name: 'Plumbing', value: 25, count: 112, color: '#06B6D4' },
    { name: 'Electrical', value: 20, count: 89, color: '#10B981' },
    { name: 'Appliance', value: 15, count: 67, color: '#F59E0B' },
    { name: 'Other', value: 5, count: 22, color: '#EF4444' }
  ];

  const weeklyPerformance = [
    { week: 'Week 1', completed: 18, pending: 3, cancelled: 1 },
    { week: 'Week 2', completed: 22, pending: 2, cancelled: 0 },
    { week: 'Week 3', completed: 19, pending: 4, cancelled: 2 },
    { week: 'Week 4', completed: 25, pending: 1, cancelled: 1 }
  ];

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

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Business Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Comprehensive reporting and business analytics
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
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">347</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">93.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">$13,800</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-0.3h</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Monthly Work Orders & Revenue</CardTitle>
                <CardDescription className="text-sm">Track work order volume and revenue trends</CardDescription>
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
                        data={monthlyMetrics}
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
                <CardDescription className="text-sm">Distribution of work orders by service type</CardDescription>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Weekly Performance</CardTitle>
                <CardDescription className="text-sm">Work order completion status by week</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="w-full overflow-hidden">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={weeklyPerformance}
                        margin={getChartMargins()}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="week" 
                          tick={{ fontSize: getTickFontSize() }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? 'end' : 'middle'}
                          height={isMobile ? 40 : 30}
                        />
                        <YAxis 
                          tick={{ fontSize: getTickFontSize() }}
                          width={getAxisWidth()}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {!isMobile && (
                          <Legend 
                            wrapperStyle={{ fontSize: getLegendFontSize() }}
                            iconSize={12}
                          />
                        )}
                        <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                        <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
                        <Bar dataKey="cancelled" stackId="a" fill="#EF4444" name="Cancelled" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Completion Rate Trend</CardTitle>
                <CardDescription className="text-sm">Monthly completion rate percentage</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="w-full overflow-hidden">
                  <ChartContainer 
                    config={chartConfig} 
                    className="w-full"
                    style={{ height: getChartHeight() }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={monthlyMetrics}
                        margin={getChartMargins()}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: getTickFontSize() }}
                          angle={isMobile ? -45 : 0}
                          textAnchor={isMobile ? 'end' : 'middle'}
                          height={isMobile ? 40 : 30}
                        />
                        <YAxis 
                          domain={[85, 100]} 
                          tick={{ fontSize: getTickFontSize() }}
                          width={getAxisWidth()}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="completion" 
                          stroke="#8B5CF6" 
                          strokeWidth={isMobile ? 2 : 3}
                          name="Completion Rate (%)"
                          dot={{ fill: '#8B5CF6', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <span className="font-semibold">$13,800</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Month</span>
                  <span className="font-semibold">$12,400</span>
                </div>
                <div className="flex justify-between">
                  <span>YTD Total</span>
                  <span className="font-semibold">$156,200</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Growth Rate</span>
                  <span className="font-semibold">+18.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Avg Job Value</span>
                  <span className="font-semibold">$189</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Labor Hours</span>
                  <span className="font-semibold">3.2h</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Parts Cost</span>
                  <span className="font-semibold">$67</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin</span>
                  <span className="font-semibold text-green-600">42%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Services</CardTitle>
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
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Intelligence</CardTitle>
              <CardDescription>Advanced analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-sm text-muted-foreground">Customer Rating</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-muted-foreground">Customer Retention</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm text-muted-foreground">On-Time Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">23%</div>
                  <div className="text-sm text-muted-foreground">Monthly Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewDashboardPage;
