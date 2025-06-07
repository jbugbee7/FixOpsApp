
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useCRMData } from '@/hooks/useCRMData';

const CRMMetrics = () => {
  const { allCustomers, loading } = useCRMData();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalCustomers = allCustomers.length;
  const activeCustomers = allCustomers.filter(c => c.status === 'Active').length;
  const totalRevenue = allCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalCustomers > 0 ? totalRevenue / allCustomers.reduce((sum, c) => sum + c.totalOrders, 0) : 0;

  const metrics = [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Active Customers",
      value: activeCustomers.toString(),
      icon: TrendingUp,
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+15%",
      changeType: "positive" as const
    },
    {
      title: "Avg Order Value",
      value: `$${avgOrderValue.toFixed(0)}`,
      icon: Calendar,
      change: "+3%",
      changeType: "positive" as const
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CRMMetrics;
