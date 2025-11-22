
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define interfaces for type safety
interface CaseData {
  created_at: string;
  status?: string;
  appliance_type?: string;
  diagnostic_fee_amount: number | string;
  labor_cost_calculated: number | string;
}

interface CRMAnalyticsChartsProps {
  casesData: CaseData[];
  communicationData?: any[]; // Optional if not used
  interactionsData?: any[]; // Optional if not used
}

const CRMAnalyticsCharts = ({ casesData }: CRMAnalyticsChartsProps) => {
  // Move getStatusColor function before useMemo to fix initialization error
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Completed: '#10B981',
      'In Progress': '#3B82F6',
      Scheduled: '#F59E0B',
      Cancelled: '#EF4444',
      'On Hold': '#6B7280',
    };
    return colors[status] || '#94A3B8';
  };

  const chartData = useMemo(() => {
    if (!casesData || !Array.isArray(casesData) || casesData.length === 0) {
      return {
        monthlyData: [],
        statusChartData: [],
        applianceChartData: [],
      };
    }

    // Monthly revenue data
    const monthlyRevenue = casesData.reduce((acc, caseItem) => {
      const date = new Date(caseItem.created_at);
      if (isNaN(date.getTime())) return acc; // Skip invalid dates

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, revenue: 0, cases: 0 };
      }
      
      const diagnosticValue = caseItem.diagnostic_fee_amount ?? 0;
      const laborValue = caseItem.labor_cost_calculated ?? 0;
      
      const diagnostic = typeof diagnosticValue === 'number' ? diagnosticValue : 
                        typeof diagnosticValue === 'string' ? parseFloat(diagnosticValue) || 0 : 0;
      const labor = typeof laborValue === 'number' ? laborValue : 
                   typeof laborValue === 'string' ? parseFloat(laborValue) || 0 : 0;
      
      acc[monthKey].revenue += diagnostic + labor;
      acc[monthKey].cases += 1;
      
      return acc;
    }, {} as Record<string, { month: string; revenue: number; cases: number }>);

    const monthlyData = Object.values(monthlyRevenue)
      .sort((a, b) => a.month.localeCompare(b.month))
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
      fill: getStatusColor(status),
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
      applianceChartData,
    };
  }, [casesData]);

  const chartConfig = {
    revenue: { label: 'Revenue', color: '#DC2626' },
    cases: { label: 'Cases', color: '#B91C1C' },
    count: { label: 'Count', color: '#EF4444' },
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6" role="region" aria-label="CRM Analytics Dashboard">
      {/* Monthly Revenue Trend */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          {chartData.monthlyData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.monthlyData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10 }} 
                    interval="preserveStartEnd"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    width={40}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-8">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Case Status Distribution */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Case Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          {chartData.statusChartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.statusChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      window.innerWidth > 768 
                        ? `${name}: ${value}` 
                        : `${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {chartData.statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-8">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Cases */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Monthly Case Volume</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          {chartData.monthlyData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthlyData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 10 }} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cases" fill="#B91C1C" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-8">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Top Appliance Types */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base">Top Appliance Types</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          {chartData.applianceChartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData.applianceChartData} 
                  layout="horizontal" 
                  margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis 
                    type="category" 
                    dataKey="type" 
                    tick={{ fontSize: 9 }}
                    width={80}
                    interval={0}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#EF4444" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-8">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMAnalyticsCharts;
