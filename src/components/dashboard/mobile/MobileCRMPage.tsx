import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useCRMData } from '@/hooks/useCRMData';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const MobileCRMPage = () => {
  const { allCustomers, loading } = useCRMData();

  // Calculate metrics
  const totalCustomers = allCustomers.length;
  const totalRevenue = allCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalCustomers > 0 ? totalRevenue / allCustomers.reduce((sum, c) => sum + c.totalOrders, 0) : 0;

  // Prepare segment distribution
  const segmentData = [
    { name: 'Premium', value: allCustomers.filter(c => c.segment === 'Premium').length },
    { name: 'Standard', value: allCustomers.filter(c => c.segment === 'Standard').length },
    { name: 'Basic', value: allCustomers.filter(c => c.segment === 'Basic').length },
  ].filter(item => item.value > 0);

  // Prepare status distribution
  const statusData = [
    { name: 'Active', value: allCustomers.filter(c => c.status === 'Active').length },
    { name: 'New', value: allCustomers.filter(c => c.status === 'New').length },
    { name: 'At Risk', value: allCustomers.filter(c => c.status === 'At Risk').length },
  ].filter(item => item.value > 0);

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
      <h2 className="text-xl font-bold text-foreground">CRM Overview</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardHeader className="pb-2">
            <Users className="h-4 w-4 text-primary mb-1" />
            <CardTitle className="text-xs">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">{totalCustomers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <DollarSign className="h-4 w-4 text-primary mb-1" />
            <CardTitle className="text-xs">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <TrendingUp className="h-4 w-4 text-primary mb-1" />
            <CardTitle className="text-xs">Avg Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">${avgOrderValue.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments */}
      {segmentData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Customer Status */}
      {statusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allCustomers.slice(0, 5).map((customer) => (
              <div key={customer.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-sm">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.segment}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${customer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{customer.totalOrders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileCRMPage;
