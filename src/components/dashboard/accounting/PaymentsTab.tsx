
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';

const PaymentsTab = () => {
  const { invoices, payments, loading } = useAccountingData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-5 w-5 text-secondary" />;
      case 'overdue': return <AlertCircle className="h-5 w-5 text-destructive" />;
      default: return <Clock className="h-5 w-5 text-accent" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary';
      case 'overdue': return 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive';
      case 'sent': return 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Payment Tracking</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent');

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalOutstanding = [...pendingInvoices, ...overdueInvoices].reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Tracking</h2>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-secondary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{overdueInvoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingInvoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {[...pendingInvoices, ...overdueInvoices].length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
              <p className="text-muted-foreground">All invoices are paid! 🎉</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...pendingInvoices, ...overdueInvoices]
                .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                .map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(invoice.status)}
                    <div>
                      <h4 className="font-medium">{invoice.invoice_number}</h4>
                      <p className="text-sm text-muted-foreground">Invoice #{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(invoice.due_date || invoice.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(invoice.total || 0)}</p>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {paidInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payments received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paidInvoices
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .slice(0, 5)
                .map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/5">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    <div>
                      <h4 className="font-medium">{invoice.invoice_number}</h4>
                      <p className="text-sm text-muted-foreground">Invoice #{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        Paid: {new Date(invoice.updated_at || invoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary">{formatCurrency(invoice.total || 0)}</p>
                    <Badge className="bg-secondary/10 text-secondary dark:bg-secondary/20">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsTab;
