
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoicesTab from './accounting/InvoicesTab';
import ExpensesTab from './accounting/ExpensesTab';
import PaymentsTab from './accounting/PaymentsTab';
import ReportsTab from './accounting/ReportsTab';
import { useAccountingData } from '@/hooks/useAccountingData';

const AccountingPage = () => {
  const { error } = useAccountingData();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="flex-shrink-0 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Accounting & Finance</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 h-full">
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
};

export default AccountingPage;
