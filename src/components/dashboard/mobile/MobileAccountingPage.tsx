import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useAccountingData } from '@/hooks/useAccountingData';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, FileText, CreditCard, TrendingUp } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

const MobileAccountingPage = () => {
  const { invoices, expenses, payments, loading } = useAccountingData();

  // Calculate metrics
  const totalInvoices = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPayments = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const netIncome = totalInvoices - totalExpenses;

  // Invoice status distribution
  const invoiceStatusData = [
    { name: 'Paid', value: invoices.filter(inv => inv.status === 'paid').length },
    { name: 'Pending', value: invoices.filter(inv => inv.status === 'pending').length },
    { name: 'Overdue', value: invoices.filter(inv => inv.status === 'overdue').length },
  ].filter(item => item.value > 0);

  // Expense categories
  const expenseCategories = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Other';
    acc[category] = (acc[category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseCategoryData = Object.entries(expenseCategories).map(([name, value]) => ({
    name,
    value
  }));

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
      <h2 className="text-xl font-bold text-foreground">Accounting Overview</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <FileText className="h-4 w-4 text-primary mb-1" />
            <CardTitle className="text-xs">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">${totalInvoices.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CreditCard className="h-4 w-4 text-primary mb-1" />
            <CardTitle className="text-xs">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">${totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <DollarSign className="h-4 w-4 text-primary mb-1" />
            <CardTitle className="text-xs">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">${totalPayments.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <TrendingUp className="h-4 w-4 text-primary mb-1" />
            <CardTitle className="text-xs">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Status */}
      {invoiceStatusData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Expense Categories */}
      {expenseCategoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-sm">{invoice.invoice_number}</p>
                  <p className="text-xs text-muted-foreground">{new Date(invoice.issue_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${invoice.total?.toLocaleString()}</p>
                  <p className={`text-xs ${invoice.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                    {invoice.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAccountingPage;
