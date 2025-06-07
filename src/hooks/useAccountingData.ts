
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';
import { debounce } from 'lodash';

// Use the actual database table types directly
export interface Invoice extends Tables<'invoices'> {
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

export interface Expense extends Tables<'expenses'> {
  status: 'pending' | 'approved' | 'rejected';
}

export interface PaymentReminder extends Tables<'payment_reminders'> {
  reminder_type: 'automatic' | 'manual';
  status: 'pending' | 'sent' | 'cancelled';
}

export interface InvoiceItem extends Tables<'invoice_items'> {}

interface ErrorResponse {
  message: string;
  details?: string;
}

// Centralized error handler
const handleError = (
  error: Error | unknown,
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

// Generic fetch function with proper typing
const fetchData = async <T>(
  tableName: 'invoices' | 'expenses' | 'payment_reminders',
  toast: ReturnType<typeof useToast>['toast']
): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as T[]) ?? [];
  } catch (error) {
    handleError(error, `Failed to load ${tableName}`, toast);
    return [];
  }
};

// Generic CRUD operations with proper typing
const createRecord = async <T>(
  tableName: 'invoices' | 'expenses' | 'payment_reminders',
  data: any,
  userId: string | null,
  toast: ReturnType<typeof useToast>['toast']
): Promise<T | null> => {
  if (!userId) {
    handleError(new Error('User not authenticated'), `Failed to create ${tableName.slice(0, -1)}`, toast);
    return null;
  }

  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    toast({
      title: 'Success',
      description: `${tableName.slice(0, -1)} created successfully`,
    });
    return result as T;
  } catch (error) {
    handleError(error, `Failed to create ${tableName.slice(0, -1)}`, toast);
    return null;
  }
};

const updateRecord = async <T>(
  tableName: 'invoices' | 'expenses' | 'payment_reminders',
  id: string,
  updates: any,
  toast: ReturnType<typeof useToast>['toast']
): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast({
      title: 'Success',
      description: `${tableName.slice(0, -1)} updated successfully`,
    });
    return data as T;
  } catch (error) {
    handleError(error, `Failed to update ${tableName.slice(0, -1)}`, toast);
    return null;
  }
};

const deleteRecord = async (
  tableName: 'invoices' | 'expenses' | 'payment_reminders',
  id: string,
  toast: ReturnType<typeof useToast>['toast']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast({
      title: 'Success',
      description: `${tableName.slice(0, -1)} deleted successfully`,
    });
    return true;
  } catch (error) {
    handleError(error, `Failed to delete ${tableName.slice(0, -1)}`, toast);
    return false;
  }
};

export const useAccountingData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paymentReminders, setPaymentReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch functions
  const fetchInvoices = useCallback(() => fetchData<Invoice>('invoices', toast), [toast]);
  const fetchExpenses = useCallback(() => fetchData<Expense>('expenses', toast), [toast]);
  const fetchPaymentReminders = useCallback(() => fetchData<PaymentReminder>('payment_reminders', toast), [toast]);

  // Optimized refetch to prevent excessive calls during real-time updates
  const debouncedRefetch = useCallback(
    debounce(async () => {
      console.log('Real-time update: Refetching accounting data');
      try {
        const [invoicesData, expensesData, remindersData] = await Promise.all([
          fetchInvoices(), 
          fetchExpenses(), 
          fetchPaymentReminders()
        ]);
        
        setInvoices(invoicesData);
        setExpenses(expensesData);
        setPaymentReminders(remindersData);
        setError(null);
      } catch (err) {
        console.error('Real-time refetch error:', err);
        setError('Failed to sync real-time data');
      }
    }, 300),
    [fetchInvoices, fetchExpenses, fetchPaymentReminders]
  );

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      console.log('Initial accounting data load');
      setLoading(true);
      setError(null);
      
      try {
        const [invoicesData, expensesData, remindersData] = await Promise.all([
          fetchInvoices(), 
          fetchExpenses(), 
          fetchPaymentReminders()
        ]);
        
        setInvoices(invoicesData);
        setExpenses(expensesData);
        setPaymentReminders(remindersData);
      } catch (err) {
        console.error('Initial data load error:', err);
        setError('Failed to load accounting data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchInvoices, fetchExpenses, fetchPaymentReminders]);

  // Enhanced real-time subscriptions with better error handling
  useEffect(() => {
    console.log('Setting up real-time subscriptions for accounting data');
    
    const invoicesChannel = supabase
      .channel('invoices-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'invoices' 
      }, (payload) => {
        console.log('Real-time invoices change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe((status) => {
        console.log('Invoices channel status:', status);
      });

    const expensesChannel = supabase
      .channel('expenses-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'expenses' 
      }, (payload) => {
        console.log('Real-time expenses change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe((status) => {
        console.log('Expenses channel status:', status);
      });

    const remindersChannel = supabase
      .channel('payment-reminders-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_reminders' 
      }, (payload) => {
        console.log('Real-time payment reminders change:', payload.eventType, payload);
        debouncedRefetch();
      })
      .subscribe((status) => {
        console.log('Payment reminders channel status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(invoicesChannel);
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(remindersChannel);
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
    error,
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
