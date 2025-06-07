
import { useState, useMemo } from 'react';
import { Customer } from '@/types/crm';

export const useCRMData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');

  // Enhanced mock customer data
  const customers: Customer[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, ST 12345",
      status: "Active",
      segment: "Premium",
      totalOrders: 12,
      totalSpent: 2850,
      lastContact: "2024-01-15",
      acquisitionDate: "2023-08-15",
      lifetime_value: 3200,
      avgOrderValue: 237.5
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 987-6543",
      address: "456 Oak Ave, Somewhere, ST 67890",
      status: "At Risk",
      segment: "Standard",
      totalOrders: 5,
      totalSpent: 890,
      lastContact: "2023-11-22",
      acquisitionDate: "2023-03-10",
      lifetime_value: 1200,
      avgOrderValue: 178
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@email.com",
      phone: "(555) 456-7890",
      address: "789 Pine Rd, Elsewhere, ST 54321",
      status: "Active",
      segment: "VIP",
      totalOrders: 18,
      totalSpent: 4320,
      lastContact: "2024-01-10",
      acquisitionDate: "2022-12-05",
      lifetime_value: 5500,
      avgOrderValue: 240
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@email.com",
      phone: "(555) 321-0987",
      address: "321 Elm St, Newtown, ST 98765",
      status: "New",
      segment: "Standard",
      totalOrders: 2,
      totalSpent: 340,
      lastContact: "2024-01-12",
      acquisitionDate: "2024-01-01",
      lifetime_value: 450,
      avgOrderValue: 170
    }
  ];

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
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    segmentFilter,
    setSegmentFilter
  };
};
