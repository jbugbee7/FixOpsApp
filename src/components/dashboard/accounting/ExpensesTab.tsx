
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Receipt, TrendingUp, Calendar } from 'lucide-react';
import { useAccountingData } from '@/hooks/useAccountingData';
import CreateExpenseDialog from './CreateExpenseDialog';

const ExpensesTab = () => {
  const { expenses, loading } = useAccountingData();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary';
      case 'pending': return 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent';
      case 'rejected': return 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Expenses</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const billableExpenses = expenses.filter(expense => expense.is_billable);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Expense Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-secondary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Billable</p>
                <p className="text-2xl font-bold">{billableExpenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {expenses.filter(expense => 
                    new Date(expense.expense_date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Billable</p>
                <p className="text-2xl font-bold">{billableExpenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No expenses recorded</h3>
              <p className="text-muted-foreground mb-6">Start tracking your business expenses.</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{expense.description || 'Expense'}</h3>
                      {expense.is_billable && (
                        <Badge variant="outline">Billable</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-1">Category: {expense.category}</p>
                    {expense.vendor && (
                      <p className="text-sm text-muted-foreground">Vendor: {expense.vendor}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(expense.expense_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateExpenseDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
};

export default ExpensesTab;
