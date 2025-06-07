
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const CRMCharts = () => {
  const isMobile = useIsMobile();

  // Analytics data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12400, customers: 85 },
    { month: 'Feb', revenue: 15600, customers: 92 },
    { month: 'Mar', revenue: 18900, customers: 108 },
    { month: 'Apr', revenue: 16200, customers: 95 },
    { month: 'May', revenue: 21300, customers: 115 },
    { month: 'Jun', revenue: 24800, customers: 128 }
  ];

  const customerSegmentation = [
    { name: 'VIP', value: 25, color: '#8B5CF6' },
    { name: 'Premium', value: 35, color: '#06B6D4' },
    { name: 'Standard', value: 40, color: '#10B981' }
  ];

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

  // Mobile-first chart configuration
  const getComposedChartHeight = () => isMobile ? '220px' : '350px';
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
    <div className="space-y-4 sm:space-y-6">
      {/* Revenue & Customer Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Revenue & Customer Growth</CardTitle>
          <CardDescription className="text-sm">Monthly revenue and customer acquisition trends</CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="w-full overflow-hidden">
            <ChartContainer 
              config={chartConfig} 
              className="w-full"
              style={{ height: getComposedChartHeight() }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={monthlyRevenue} 
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
                    yAxisId="revenue"
                    orientation="left"
                    tick={{ fontSize: getTickFontSize() }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    width={getAxisWidth()}
                  />
                  <YAxis 
                    yAxisId="customers"
                    orientation="right"
                    tick={{ fontSize: getTickFontSize() }}
                    width={isMobile ? 15 : 40}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'New Customers'
                    ]}
                  />
                  {!isMobile && (
                    <Legend 
                      wrapperStyle={{ fontSize: getLegendFontSize() }}
                      iconSize={12}
                    />
                  )}
                  <Bar 
                    yAxisId="revenue"
                    dataKey="revenue" 
                    fill="#8B5CF6" 
                    name="Revenue ($)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Line 
                    yAxisId="customers"
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#06B6D4" 
                    strokeWidth={isMobile ? 2 : 3}
                    name="New Customers"
                    dot={{ fill: '#06B6D4', strokeWidth: 1, r: isMobile ? 2 : 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customer Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Customer Segmentation</CardTitle>
            <CardDescription className="text-sm">Distribution of customers by value segment</CardDescription>
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
                      data={customerSegmentation}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? "45%" : "60%"}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                    >
                      {customerSegmentation.map((entry, index) => (
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
    </div>
  );
};

export default CRMCharts;
