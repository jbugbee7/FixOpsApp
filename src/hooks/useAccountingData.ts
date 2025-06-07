
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, PostgrestError } from '@/integrations/supabase/types';
import { debounce } from 'lodash';

// Define explicit table interfaces
interface BaseTable {
  id: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface Invoice extends BaseTable, Omit<Tables<'invoices'>, 'status'> {
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  amount?: number;
  due_date?: string;
  customer_id?: string;
}

export interface Expense extends BaseTable, Omit<Tables<'expenses'>, 'status'> {
  status: 'pending' | 'approved' | 'rejected';
  amount?: number;
  category?: string;
}

export interface PaymentReminder extends BaseTable, Omit<Tables<'payment_reminders'>, 'reminder_type' | 'status'> {
  reminder_type: 'automatic' | 'manual';
  status: 'pending' | 'sent' | 'cancelled';
  invoice_id?: string;
  scheduled_date?: string;
}

export interface InvoiceItem extends Tables<'invoice_items'> {}

interface ErrorResponse {
  message: string;
  details?: string;
}

// Centralized error handler
const handleError = (
  error: PostgrestError | Error | unknown,
  defaultMessage: string,
  toast: ReturnType<typeof useToast>['toast']
): ErrorResponse => {
  const message = error instanceof Error ? error.message : String(error);
  toast({
    title: 'Error',
    description: defaultMessage,
    variant: 'destructive',
  });
  console.error(defaultMessage, error);
  return { message: defaultMessage, details: message };
};

// Generic fetch function
const fetchData = async <T>(
  table: string,
  toast: ReturnType<typeof useToast>['toast']
): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as T[]) ?? [];
  } catch (error) {
    handleError(error, `Failed to load ${table}`, toast);
    return [];
  }
};

// Generic CRUD operations
const createRecord = async <T>(
  table: string,
  data: Partial<T>,
  userId: string | null,
  toast: ReturnType<typeof useToast>['toast']
): Promise<T | null> => {
  if (!userId) {
    handleError(new Error('User not authenticated'), `Failed to create ${table.slice(0, -1)}`, toast);
    return null;
  }

  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    toast({
      title: 'Success',
      description: `${table.slice(0, -1)} created successfully`,
    });
    return result as T;
  } catch (error) {
    handleError(error, `Failed to create ${table.slice(0, -1)}`, toast);
    return null;
  }
};

const updateRecord = async <T>(
  table: string,
  id: string,
  updates: Partial<T>,
  toast: ReturnType<typeof useToast>['toast']
): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast({
      title: 'Success',
      description: `${table.slice(0, -1)} updated successfully`,
    });
    return data as T;
  } catch (error) {
    handleError(error, `Failed to update ${table.slice(0, -1)}`, toast);
    return null;
  }
};

const deleteRecord = async (
  table: string,
  id: string,
  toast: ReturnType<typeof useToast>['toast']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast({
      title: 'Success',
      description: `${table.slice(0, -1)} deleted successfully`,
    });
    return true;
  } catch (error) {
    handleError(error, `Failed to delete ${table.slice(0, -1)}`, toast);
    return false;
  }
};

export const useAccountingData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paymentReminders, setPaymentReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch functions
  const fetchInvoices = useCallback(() => fetchData<Invoice>('invoices', toast), [toast]);
  const fetchExpenses = useCallback(() => fetchData<Expense>('expenses', toast), [toast]);
  const fetchPaymentReminders = useCallback(() => fetchData<PaymentReminder>('payment_reminders', toast), [toast]);

  // Debounced refetch to prevent excessive calls during real-time updates
  const debouncedRefetch = useCallback(
    debounce(async () => {
      await Promise.all([fetchInvoices(), fetchExpenses(), fetchPaymentReminders()]).then(
        ([invoicesData, expensesData, remindersData]) => {
          setInvoices(invoicesData);
          setExpenses(expensesData);
          setPaymentReminders(remindersData);
        }
      );
    }, 500),
    [fetchInvoices, fetchExpenses, fetchPaymentReminders]
  );

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchInvoices(), fetchExpenses(), fetchPaymentReminders()]).then(
        ([invoicesData, expensesData, remindersData]) => {
          setInvoices(invoicesData);
          setExpenses(expensesData);
          setPaymentReminders(remindersData);
        }
      );
      setLoading(false);
    };

    loadData();
  }, [fetchInvoices, fetchExpenses, fetchPaymentReminders]);

  // Real-time subscriptions
  useEffect(() => {
    const channels = [
      supabase
        .channel('invoices-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, debouncedRefetch)
        .subscribe(),
      supabase
        .channel('expenses-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, debouncedRefetch)
        .subscribe(),
      supabase
        .channel('payment-reminders-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_reminders' }, debouncedRefetch)
        .subscribe(),
    ];

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [debouncedRefetch]);

  // Get authenticated user ID
  const getUserId = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  };

  // CRUD operations for invoices
  const createInvoice = async (invoiceData: Partial<Invoice>) => {
    const userId = await getUserId();
    return createRecord<Invoice>('invoices', invoiceData, userId, toast);
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    return updateRecord<Invoice>('invoices', id, updates, toast);
  };

  const deleteInvoice = async (id: string) => {
    return deleteRecord('invoices', id, toast);
  };

  // CRUD operations for expenses
  const createExpense = async (expenseData: Partial<Expense>) => {
    const userId = await getUserId();
    return createRecord<Expense>('expenses', expenseData, userId, toast);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    return updateRecord<Expense>('expenses', id, updates, toast);
  };

  const deleteExpense = async (id: string) => {
    return deleteRecord('expenses', id, toast);
  };

  // CRUD operations for payment reminders
  const createPaymentReminder = async (reminderData: Partial<PaymentReminder>) => {
    const userId = await getUserId();
    return createRecord<PaymentReminder>('payment_reminders', reminderData, userId, toast);
  };

  const updatePaymentReminder = async (id: string, updates: Partial<PaymentReminder>) => {
    return updateRecord<PaymentReminder>('payment_reminders', id, updates, toast);
  };

  const deletePaymentReminder = async (id: string) => {
    return deleteRecord('payment_reminders', id, toast);
  };

  return {
    invoices,
    expenses,
    paymentReminders,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    createExpense,
    updateExpense,
    deleteExpense,
    createPaymentReminder,
    updatePaymentReminder,
    deletePaymentReminder,
    refetch: debouncedRefetch,
  };
};

export default useAccountingData;
