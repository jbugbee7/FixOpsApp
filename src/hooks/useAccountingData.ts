
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email?: string;
  customer_address?: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  payment_terms?: string;
  case_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  item_type: 'service' | 'part' | 'labor';
  created_at: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string;
  vendor?: string;
  receipt_url?: string;
  is_billable: boolean;
  status: 'pending' | 'approved' | 'rejected';
  case_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentReminder {
  id: string;
  invoice_id: string;
  reminder_type: 'automatic' | 'manual';
  sent_at?: string;
  due_date: string;
  status: 'pending' | 'sent' | 'cancelled';
  created_at: string;
}

export const useAccountingData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paymentReminders, setPaymentReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      });
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    }
  };

  // Fetch payment reminders
  const fetchPaymentReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_reminders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentReminders(data || []);
    } catch (error) {
      console.error('Error fetching payment reminders:', error);
      toast({
        title: "Error",
        description: "Failed to load payment reminders",
        variant: "destructive",
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchInvoices(),
        fetchExpenses(),
        fetchPaymentReminders()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const invoicesChannel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        fetchInvoices();
      })
      .subscribe();

    const expensesChannel = supabase
      .channel('expenses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        fetchExpenses();
      })
      .subscribe();

    const paymentRemindersChannel = supabase
      .channel('payment-reminders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_reminders' }, () => {
        fetchPaymentReminders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(paymentRemindersChannel);
    };
  }, []);

  // CRUD operations
  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          ...invoiceData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createExpense = async (expenseData: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Expense recorded successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: "Error",
        description: "Failed to record expense",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    invoices,
    expenses,
    paymentReminders,
    loading,
    createInvoice,
    updateInvoice,
    createExpense,
    updateExpense,
    refetch: () => {
      fetchInvoices();
      fetchExpenses();
      fetchPaymentReminders();
    }
  };
};
