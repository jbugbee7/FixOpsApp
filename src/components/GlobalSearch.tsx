import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from '@/integrations/supabase/client';
import { Search, FileText, Users, Wrench, LayoutDashboard, Calendar, Package, Calculator, Settings, MessageCircle, Bot, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: string) => void;
}

const GlobalSearch = ({ open, onOpenChange, onNavigate }: GlobalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const pages = [
    { name: 'Dashboard', value: 'dashboard', icon: LayoutDashboard },
    { name: 'Work Orders', value: 'work-order', icon: FileText },
    { name: 'FixChat', value: 'fixchat', icon: MessageCircle },
    { name: 'AI Assistant', value: 'ai-assistant', icon: Bot },
    { name: 'Training', value: 'training', icon: GraduationCap },
    { name: 'CRM', value: 'crm', icon: Users },
    { name: 'Inventory', value: 'inventory', icon: Package },
    { name: 'Accounting', value: 'accounting', icon: Calculator },
    { name: 'Scheduling', value: 'scheduling', icon: Calendar },
    { name: 'Settings', value: 'settings', icon: Settings },
  ];

  useEffect(() => {
    const searchData = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setWorkOrders([]);
        setCustomers([]);
        return;
      }

      setLoading(true);
      try {
        // Search work orders
        const { data: casesData } = await supabase
          .from('cases')
          .select('id, customer_id, appliance_type, appliance_brand, appliance_model, status, created_at')
          .or(`id.ilike.%${searchQuery}%,appliance_type.ilike.%${searchQuery}%,appliance_brand.ilike.%${searchQuery}%,appliance_model.ilike.%${searchQuery}%,status.ilike.%${searchQuery}%`)
          .limit(5);

        // Search customers
        const { data: customersData } = await supabase
          .from('customers')
          .select('id, name, email, phone')
          .or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
          .limit(5);

        setWorkOrders(casesData || []);
        setCustomers(customersData || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchData, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSelect = (type: string, value: string) => {
    onOpenChange(false);
    setSearchQuery('');
    
    if (type === 'page') {
      onNavigate(value);
    } else if (type === 'work-order') {
      // Navigate to work order details
      navigate(`/case/${value}`);
    } else if (type === 'customer') {
      // Navigate to CRM and filter by customer
      onNavigate('crm');
    }
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search work orders, customers, appliances, or pages..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? 'Searching...' : 'No results found.'}
        </CommandEmpty>

        {filteredPages.length > 0 && (
          <CommandGroup heading="Pages">
            {filteredPages.map((page) => (
              <CommandItem
                key={page.value}
                onSelect={() => handleSelect('page', page.value)}
              >
                <page.icon className="mr-2 h-4 w-4" />
                <span>{page.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {workOrders.length > 0 && (
          <CommandGroup heading="Work Orders">
            {workOrders.map((order) => (
              <CommandItem
                key={order.id}
                onSelect={() => handleSelect('work-order', order.id)}
              >
                <Wrench className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {order.appliance_brand} {order.appliance_model}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.appliance_type} • {order.status}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {customers.length > 0 && (
          <CommandGroup heading="Customers">
            {customers.map((customer) => (
              <CommandItem
                key={customer.id}
                onSelect={() => handleSelect('customer', customer.id)}
              >
                <Users className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {customer.email || customer.phone}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
