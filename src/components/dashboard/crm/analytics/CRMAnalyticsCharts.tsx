
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface CRMAnalyticsChartsProps {
  casesData: any[];
  communicationData: any[];
  interactionsData: any[];
}

const CRMAnalyticsCharts = ({ casesData, communicationData, interactionsData }: CRMAnalyticsChartsProps) => {
  const chartData = useMemo(() => {
    // Monthly revenue data
    const monthlyRevenue = casesData.reduce((acc, caseItem) => {
      const date = new Date(caseItem.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, revenue: 0, cases: 0 };
      }
      
      // Properly parse and validate numbers
      const diagnosticValue = caseItem.diagnostic_fee_amount;
      const laborValue = caseItem.labor_cost_calculated;
      
      const diagnostic = typeof diagnosticValue === 'number' ? diagnosticValue : 
                        typeof diagnosticValue === 'string' ? parseFloat(diagnosticValue) || 0 : 0;
      const labor = typeof laborValue === 'number' ? laborValue : 
                   typeof laborValue === 'string' ? parseFloat(laborValue) || 0 : 0;
      
      acc[monthKey].revenue += diagnostic + labor;
      acc[monthKey].cases += 1;
      
      return acc;
    }, {} as Record<string, any>);

    const monthlyData = Object.values(monthlyRevenue)
      .sort((a: any, b: any) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    // Status distribution
    const statusData = casesData.reduce((acc, caseItem) => {
      const status = caseItem.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusChartData = Object.entries(statusData).map(([status, count]) => ({
      name: status,
      value: count,
      fill: getStatusColor(status)
    }));

    // Appliance type distribution
    const applianceData = casesData.reduce((acc, caseItem) => {
      const type = caseItem.appliance_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const applianceChartData = Object.entries(applianceData)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 appliance types

    return {
      monthlyData,
      statusChartData,
      applianceChartData
    };
  }, [casesData]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Completed': '#10B981',
      'In Progress': '#3B82F6',
      'Scheduled': '#F59E0B',
      'Cancelled': '#EF4444',
      'On Hold': '#6B7280'
    };
    return colors[status] || '#94A3B8';
  };

  const chartConfig = {
    revenue: { label: "Revenue", color: "#8B5CF6" },
    cases: { label: "Cases", color: "#06B6D4" },
    count: { label: "Count", color: "#10B981" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Case Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Case Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Case Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cases" fill="#06B6D4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Appliance Types */}
      <Card>
        <CardHeader>
          <CardTitle>Top Appliance Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.applianceChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="type" 
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#10B981" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMAnalyticsCharts;
