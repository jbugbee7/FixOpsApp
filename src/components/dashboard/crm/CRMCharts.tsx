
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useCRMData } from '@/hooks/useCRMData';

const CRMCharts = () => {
  const { allCustomers, loading } = useCRMData();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(3)].map((_, i) => (
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

  // Process data for charts
  const segmentData = allCustomers.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const segmentChartData = Object.entries(segmentData).map(([segment, count]) => ({
    name: segment,
    value: count,
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

  // Monthly revenue data (simulated based on customer acquisition dates)
  const monthlyData = allCustomers.reduce((acc, customer) => {
    const month = new Date(customer.acquisitionDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { month, revenue: 0, customers: 0 };
    }
    acc[month].revenue += customer.totalSpent;
    acc[month].customers += 1;
    return acc;
  }, {} as Record<string, any>);

  const revenueData = Object.values(monthlyData).slice(-6); // Last 6 months

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={segmentChartData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {segmentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Status */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMCharts;
