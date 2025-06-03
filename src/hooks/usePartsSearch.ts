
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

interface SystemPart {
  id: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  markup_percentage: number;
  final_price: number;
  appliance_type?: string;
  appliance_brand?: string;
}

export const usePartsSearch = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [systemParts, setSystemParts] = useState<SystemPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchSystemParts = async () => {
    if (!user || !searchTerm.trim()) {
      toast({
        title: "Enter Search Term",
        description: "Please enter a part name or number to search.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setSearchError(null);
    setHasSearched(true);
    
    try {
      console.log('Searching for parts with term:', searchTerm);
      
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .or(`part_name.ilike.%${searchTerm}%,part_number.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) {
        console.error('Error searching parts:', error);
        setSearchError('Failed to search parts. Please try again.');
        toast({
          title: "Search Error",
          description: "There was an error searching for parts. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Found parts:', data);
      setSystemParts(data || []);
      
      if (data && data.length === 0) {
        toast({
          title: "No Parts Found",
          description: `No parts found matching "${searchTerm}". Try a different search term.`,
        });
      } else if (data && data.length > 0) {
        toast({
          title: "Parts Found",
          description: `Found ${data.length} part(s) matching "${searchTerm}".`,
        });
      }
    } catch (error) {
      console.error('Error searching parts:', error);
      setSearchError('An unexpected error occurred while searching.');
      toast({
        title: "Search Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchSystemParts();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSystemParts([]);
      setHasSearched(false);
      setSearchError(null);
    }
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    systemParts,
    loading,
    searchError,
    hasSearched,
    searchSystemParts
  };
};
