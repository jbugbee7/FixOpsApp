
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

  // Fetch real customer data from cases table
  const fetchCustomersFromCases = async () => {
    try {
      setLoading(true);
      
      // Get all cases to extract customer information
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform cases data into customer data
      const customerMap = new Map<string, Customer>();
      
      cases?.forEach((caseItem, index) => {
        const customerId = caseItem.customer_name.toLowerCase().replace(/\s+/g, '-');
        
        if (customerMap.has(customerId)) {
          // Update existing customer
          const existingCustomer = customerMap.get(customerId)!;
          existingCustomer.totalOrders += 1;
          existingCustomer.lastContact = caseItem.created_at > existingCustomer.lastContact 
            ? caseItem.created_at 
            : existingCustomer.lastContact;
        } else {
          // Create new customer from case data
          const customer: Customer = {
            id: index + 1,
            name: caseItem.customer_name,
            email: caseItem.customer_email || `${customerId}@email.com`,
            phone: caseItem.customer_phone || '(555) 000-0000',
            address: [
              caseItem.customer_address,
              caseItem.customer_city,
              caseItem.customer_state,
              caseItem.customer_zip_code
            ].filter(Boolean).join(', ') || 'No address provided',
            status: determineCustomerStatus(caseItem.status),
            segment: determineCustomerSegment(caseItem),
            totalOrders: 1,
            totalSpent: calculateCaseValue(caseItem),
            lastContact: caseItem.created_at,
            acquisitionDate: caseItem.created_at,
            lifetime_value: calculateCaseValue(caseItem) * 1.2, // Estimated LTV
            avgOrderValue: calculateCaseValue(caseItem)
          };
          
          customerMap.set(customerId, customer);
        }
      });

      const customersArray = Array.from(customerMap.values());
      setCustomers(customersArray);
      
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast({
        title: "Error",
        description: "Failed to load customer data from work orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine customer status based on case status and recency
  const determineCustomerStatus = (caseStatus: string): string => {
    const statusMapping: Record<string, string> = {
      'Completed': 'Active',
      'In Progress': 'Active',
      'Scheduled': 'Active',
      'Cancelled': 'At Risk'
    };
    return statusMapping[caseStatus] || 'New';
  };

  // Helper function to determine customer segment
  const determineCustomerSegment = (caseItem: any): string => {
    const hasMultipleAppliances = caseItem.appliance_type && caseItem.appliance_brand;
    const hasCompleteInfo = caseItem.customer_email && caseItem.customer_phone;
    
    if (hasMultipleAppliances && hasCompleteInfo) return 'Premium';
    if (hasCompleteInfo) return 'Standard';
    return 'Basic';
  };

  // Helper function to calculate case value
  const calculateCaseValue = (caseItem: any): number => {
    let total = 0;
    
    if (caseItem.diagnostic_fee_amount) {
      total += parseFloat(caseItem.diagnostic_fee_amount.toString());
    }
    
    if (caseItem.labor_cost_calculated) {
      total += parseFloat(caseItem.labor_cost_calculated.toString());
    }
    
    // If no pricing info, estimate based on appliance type
    if (total === 0) {
      const applianceValues: Record<string, number> = {
        'Refrigerator': 150,
        'Washer': 120,
        'Dryer': 110,
        'Dishwasher': 100,
        'Oven': 140,
        'Microwave': 80
      };
      total = applianceValues[caseItem.appliance_type] || 100;
    }
    
    return total;
  };

  useEffect(() => {
    fetchCustomersFromCases();
    
    // Set up real-time subscription to cases table
    const channel = supabase
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
          fetchCustomersFromCases();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
    refreshCustomers: fetchCustomersFromCases
  };
};
