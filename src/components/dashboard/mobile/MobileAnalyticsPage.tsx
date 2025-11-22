import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useMonthlyTrends } from '@/hooks/useMonthlyTrends';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

const MobileAnalyticsPage = () => {
  const { metrics, fetchMetrics } = useDashboardMetrics();
  const { monthlyData, fetchMonthlyTrends } = useMonthlyTrends();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchMetrics(), fetchMonthlyTrends()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchMetrics, fetchMonthlyTrends]);

  const monthlyRevenueData = monthlyData?.slice(-3).map(item => ({
    name: item.month,
    value: item.revenue
  })) || [];

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="text-xl font-bold text-foreground">Analytics Overview</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">${metrics.monthlyRevenue?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{metrics.totalWorkOrders || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{metrics.completionRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.monthlyGrowth > 0 ? '+' : ''}{metrics.monthlyGrowth}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue */}
      {monthlyRevenueData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={monthlyRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {monthlyRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileAnalyticsPage;
