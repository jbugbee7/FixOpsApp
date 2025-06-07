
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCRMData } from '@/hooks/useCRMData';

const AnalyticsTab = () => {
  const isMobile = useIsMobile();
  const { allCustomers, loading } = useCRMData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Process real data for charts
  const monthlyRevenue = allCustomers.reduce((acc, customer) => {
    const month = new Date(customer.acquisitionDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, revenue: 0, customers: 0 };
    }
    acc[month].revenue += customer.totalSpent;
    acc[month].customers += 1;
    return acc;
  }, {} as Record<string, any>);

  const monthlyData = Object.values(monthlyRevenue).slice(-6); // Last 6 months

  const segmentData = allCustomers.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const segmentChartData = Object.entries(segmentData).map(([segment, count]) => ({
    name: segment,
    value: count,
    revenue: allCustomers
      .filter(c => c.segment === segment)
      .reduce((sum, c) => sum + c.totalSpent, 0),
    color: segment === 'Premium' ? '#8B5CF6' : segment === 'Standard' ? '#3B82F6' : '#10B981'
  }));

  const statusData = allCustomers.reduce((acc, customer) => {
    acc[customer.status] = (acc[customer.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    customers: count
  }));

  const chartConfig = {
    revenue: {
      label: "Revenue ($)",
      color: "#8B5CF6",
    },
    customers: {
      label: "New Customers",
      color: "#06B6D4",
    },
  };

  const getChartHeight = () => isMobile ? '200px' : '300px';
  const getChartMargins = () => ({
    top: isMobile ? 10 : 20,
    right: isMobile ? 5 : 30,
    left: isMobile ? 0 : 20,
    bottom: isMobile ? 30 : 20
  });
  const getTickFontSize = () => isMobile ? 8 : 12;
  const getAxisWidth = () => isMobile ? 20 : 60;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Customer Acquisition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Customer Acquisition</CardTitle>
          <CardDescription className="text-sm">New customers over time</CardDescription>
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
                  data={monthlyData}
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
                    tick={{ fontSize: getTickFontSize() }}
                    width={getAxisWidth()}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="customers" fill="#06B6D4" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Revenue Trend</CardTitle>
          <CardDescription className="text-sm">Monthly revenue from work orders</CardDescription>
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
                  data={monthlyData}
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
                    tick={{ fontSize: getTickFontSize() }}
                    width={getAxisWidth()}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Customer Segments</CardTitle>
          <CardDescription className="text-sm">Distribution by segment</CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={parseInt(getChartHeight())}>
              <PieChart>
                <Pie
                  data={segmentChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {segmentChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Customer Status</CardTitle>
          <CardDescription className="text-sm">Current customer status distribution</CardDescription>
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
                  data={statusChartData}
                  margin={getChartMargins()}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="status"
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
                  <Bar dataKey="customers" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
