
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, TrendingUp, CreditCard, AlertCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InvoicesTab from './accounting/InvoicesTab';
import ExpensesTab from './accounting/ExpensesTab';
import PaymentsTab from './accounting/PaymentsTab';
import ReportsTab from './accounting/ReportsTab';
import { useAccountingData } from '@/hooks/useAccountingData';
import { useIsMobile } from '@/hooks/use-mobile';

const AccountingPage = ({ fromDashboard = false, onNavigate }: { fromDashboard?: boolean; onNavigate?: (tab: string) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromDashboard = fromDashboard || location.state?.fromQuickAction;
  const { error, invoices, expenses, payments } = useAccountingData();
  const isMobile = useIsMobile();

  const totalInvoices = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;
  const totalExpenses = expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
  const totalPayments = payments?.reduce((sum, pay) => sum + (pay.amount || 0), 0) || 0;

  // Mobile view (keep existing simple design)
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex-shrink-0 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Accounting & Finance</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-6 h-full">
            {cameFromDashboard && (
              <Button
                variant="ghost"
                onClick={() => onNavigate?.('dashboard')}
                className="mb-4 hover:bg-muted/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <Tabs defaultValue="invoices" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 mt-6 overflow-hidden">
                <TabsContent value="invoices" className="h-full">
                  <InvoicesTab />
                </TabsContent>
                
                <TabsContent value="expenses" className="h-full">
                  <ExpensesTab />
                </TabsContent>
                
                <TabsContent value="payments" className="h-full">
                  <PaymentsTab />
                </TabsContent>
                
                <TabsContent value="reports" className="h-full">
                  <ReportsTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view (new detailed design)
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-shrink-0 border-b">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center h-[52px]">
          <h1 className="text-sm font-bold text-foreground">Accounting & Finance</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-8 space-y-6">
              <Tabs defaultValue="invoices" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 mt-6 overflow-hidden">
                  <TabsContent value="invoices" className="h-full">
                    <InvoicesTab />
                  </TabsContent>
                  
                  <TabsContent value="expenses" className="h-full">
                    <ExpensesTab />
                  </TabsContent>
                  
                  <TabsContent value="payments" className="h-full">
                    <PaymentsTab />
                  </TabsContent>
                  
                  <TabsContent value="reports" className="h-full">
                    <ReportsTab />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="col-span-4 space-y-6">
              {/* Financial Summary */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Current month overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">${(totalInvoices / 1000).toFixed(1)}k</div>
                    <p className="text-sm text-muted-foreground">Total Invoices</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20">
                    <div className="flex items-center justify-between mb-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-destructive/20 text-destructive">
                        -{((totalExpenses / totalInvoices) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold">${(totalExpenses / 1000).toFixed(1)}k</div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="h-5 w-5 text-accent" />
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent">
                        {((totalPayments / totalInvoices) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold">${(totalPayments / 1000).toFixed(1)}k</div>
                    <p className="text-sm text-muted-foreground">Received Payments</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest financial activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payments?.slice(0, 4).map((payment, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <Activity className="h-4 w-4 text-accent mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Payment received</p>
                        <p className="text-xs text-muted-foreground">${payment.amount}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Action Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">Overdue invoices</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">Pending payments</span>
                    <Badge>5</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">Expense approvals</span>
                    <Badge>3</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingPage;
