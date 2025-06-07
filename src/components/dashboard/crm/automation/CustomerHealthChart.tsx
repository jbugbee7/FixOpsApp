
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CustomerHealthChartProps {
  healthMetrics: Array<{
    id: string;
    customer_id: number;
    health_score: number;
    risk_factors: string[];
    opportunities: string[];
  }>;
}

const CustomerHealthChart = ({ healthMetrics }: CustomerHealthChartProps) => {
  // Prepare data for health score distribution
  const healthDistribution = [
    { range: '0-20', count: healthMetrics.filter(m => m.health_score <= 20).length, color: '#ef4444' },
    { range: '21-40', count: healthMetrics.filter(m => m.health_score > 20 && m.health_score <= 40).length, color: '#f97316' },
    { range: '41-60', count: healthMetrics.filter(m => m.health_score > 40 && m.health_score <= 60).length, color: '#eab308' },
    { range: '61-80', count: healthMetrics.filter(m => m.health_score > 60 && m.health_score <= 80).length, color: '#22c55e' },
    { range: '81-100', count: healthMetrics.filter(m => m.health_score > 80).length, color: '#16a34a' }
  ];

  // Prepare risk factors data
  const riskFactorsData = healthMetrics.reduce((acc: any, metric) => {
    metric.risk_factors.forEach(factor => {
      if (acc[factor]) {
        acc[factor]++;
      } else {
        acc[factor] = 1;
      }
    });
    return acc;
  }, {});

  const riskFactorsChart = Object.entries(riskFactorsData).map(([factor, count]) => ({
    factor,
    count
  })).slice(0, 5);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d084d0'];

  const chartConfig = {
    count: {
      label: "Count",
      color: "#8884d8",
    },
    factor: {
      label: "Risk Factor",
      color: "#82ca9d",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Health Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskFactorsChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ factor, percent }) => `${factor} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {riskFactorsChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerHealthChart;
