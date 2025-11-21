
import { useState, useEffect, useMemo } from 'react';
import { Customer } from '@/types/crm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCRMData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const { toast } = useToast();

  // Fetch real customer data by joining cases with customers table
  const fetchCustomersFromDatabase = async () => {
    try {
      setLoading(true);
      
      // Get customers with their cases
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      // Get all cases to calculate metrics
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*');

      if (casesError) throw casesError;

      // Transform customers data with calculated metrics
      const customersWithMetrics: Customer[] = (customersData || []).map((customer, index) => {
        const customerCases = casesData?.filter(c => c.customer_id === customer.id) || [];
        const totalSpent = customerCases.reduce((sum, c) => sum + (c.total_cost || 0), 0);
        const lastCase = customerCases[0];
        
        return {
          id: index + 1,
          name: customer.name,
          email: customer.email || `customer${index + 1}@email.com`,
          phone: customer.phone || '(555) 000-0000',
          address: customer.address || 'No address provided',
          status: determineCustomerStatus(lastCase?.status),
          segment: determineCustomerSegment(customerCases.length, totalSpent),
          totalOrders: customerCases.length,
          totalSpent,
          lastContact: lastCase?.created_at || customer.created_at,
          acquisitionDate: customer.created_at,
          lifetime_value: totalSpent * 1.2,
          avgOrderValue: customerCases.length > 0 ? totalSpent / customerCases.length : 0
        };
      });

      setCustomers(customersWithMetrics);
      
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine customer status
  const determineCustomerStatus = (caseStatus?: string): string => {
    if (!caseStatus) return 'New';
    const statusMapping: Record<string, string> = {
      'completed': 'Active',
      'in_progress': 'Active',
      'scheduled': 'Active',
      'cancelled': 'At Risk',
      'pending': 'New'
    };
    return statusMapping[caseStatus.toLowerCase()] || 'Active';
  };

  // Helper function to determine customer segment
  const determineCustomerSegment = (orderCount: number, totalSpent: number): string => {
    if (orderCount >= 5 || totalSpent >= 1000) return 'Premium';
    if (orderCount >= 2 || totalSpent >= 300) return 'Standard';
    return 'Basic';
  };

  useEffect(() => {
    fetchCustomersFromDatabase();
    
    // Set up real-time subscriptions
    const casesChannel = supabase
      .channel('cases-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cases'
        },
        () => {
          console.log('Cases data changed, refreshing customer data');
          fetchCustomersFromDatabase();
        }
      )
      .subscribe();

    const customersChannel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        () => {
          console.log('Customers data changed, refreshing');
          fetchCustomersFromDatabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(casesChannel);
      supabase.removeChannel(customersChannel);
    };
  }, []);

  // Filter customers based on search and filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSegment = segmentFilter === 'all' || customer.segment.toLowerCase() === segmentFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesSegment;
    });
  }, [customers, searchTerm, statusFilter, segmentFilter]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    segmentFilter,
    setSegmentFilter,
    refreshCustomers: fetchCustomersFromDatabase
  };
};
