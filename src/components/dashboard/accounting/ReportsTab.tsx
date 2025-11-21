
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAccountingData } from '@/hooks/useAccountingData';

const ReportsTab = () => {
  const { invoices, expenses, loading } = useAccountingData();

  const chartData = useMemo(() => {
    if (!invoices.length && !expenses.length) return { monthlyData: [], categoryData: [], statusData: [] };

    // Monthly revenue and expenses
    const monthlyRevenue = invoices.reduce((acc, invoice) => {
      const month = new Date(invoice.issue_date).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + (invoice.total || 0);
      return acc;
    }, {} as Record<string, number>);

    const monthlyExpenses = expenses.reduce((acc, expense) => {
      const month = new Date(expense.expense_date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const allMonths = Array.from(new Set([...Object.keys(monthlyRevenue), ...Object.keys(monthlyExpenses)])).sort();
    
    const monthlyData = allMonths.slice(-6).map(month => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      revenue: monthlyRevenue[month] || 0,
      expenses: monthlyExpenses[month] || 0,
      profit: (monthlyRevenue[month] || 0) - (monthlyExpenses[month] || 0)
    }));

    // Expense categories
    const categoryData = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount
    })).sort((a, b) => b.amount - a.amount);

    // Invoice status distribution
    const statusData = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusChartData = Object.entries(statusData).map(([status, count], index) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      fill: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'][index] || '#94A3B8'
    }));

    return { monthlyData, categoryData: categoryChartData, statusData: statusChartData };
  }, [invoices, expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const chartConfig = {
    revenue: { label: 'Revenue', color: '#10B981' },
    expenses: { label: 'Expenses', color: '#EF4444' },
    profit: { label: 'Profit', color: '#3B82F6' },
    amount: { label: 'Amount', color: '#8B5CF6' },
    count: { label: 'Count', color: '#06B6D4' },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Financial Reports</h2>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Financial Reports</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Net Profit</p>
              <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly P&L */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Profit & Loss</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.monthlyData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(Number(value)), '']}
                    />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.categoryData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.categoryData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="category" width={100} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                    />
                    <Bar dataKey="amount" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.monthlyData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(Number(value)), '']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Status */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.statusData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {chartData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No invoice data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsTab;
