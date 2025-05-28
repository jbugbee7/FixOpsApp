
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SearchBarProps {
  onNavigate: (tab: string) => void;
  onModelFound: (model: any) => void;
  onPartFound: (part: any) => void;
}

const SearchBar = ({ onNavigate, onModelFound, onPartFound }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchableItems = [
    { keywords: ['dashboard', 'home', 'overview'], tab: 'dashboard', label: 'Dashboard' },
    { keywords: ['add', 'create', 'new', 'wo', 'work order', 'case'], tab: 'add-case', label: 'Add Work Order' },
    { keywords: ['ai', 'assistant', 'fixbot', 'bot', 'help'], tab: 'ai-assistant', label: 'FixBot Assistant' },
    { keywords: ['analytics', 'stats', 'reports', 'data'], tab: 'analytics', label: 'Analytics' },
    { keywords: ['settings', 'config', 'preferences'], tab: 'settings', label: 'Settings' },
  ];

  const searchDatabase = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Search appliance models
      const { data: models, error: modelsError } = await supabase
        .from('appliance_models')
        .select('*')
        .or(`model.ilike.%${query}%,brand.ilike.%${query}%,serial_number.ilike.%${query}%`)
        .limit(5);

      if (modelsError) {
        console.error('Error searching models:', modelsError);
      }

      // Search parts
      const { data: parts, error: partsError } = await supabase
        .from('parts')
        .select('*')
        .or(`part_number.ilike.%${query}%,part_name.ilike.%${query}%`)
        .limit(5);

      if (partsError) {
        console.error('Error searching parts:', partsError);
      }

      // Check if we found any results
      if (models && models.length > 0) {
        onModelFound(models[0]); // Show first result
        setSearchQuery('');
        toast({
          title: "Model Found",
          description: `Found ${models[0].brand} ${models[0].model}`,
        });
        return true;
      }

      if (parts && parts.length > 0) {
        onPartFound(parts[0]); // Show first result
        setSearchQuery('');
        toast({
          title: "Part Found",
          description: `Found ${parts[0].part_name}`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error searching database:', error);
      return false;
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Search Term",
        description: "Please enter something to search for.",
        variant: "destructive"
      });
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    // First try to search the database
    const foundInDatabase = await searchDatabase(query);
    
    if (!foundInDatabase) {
      // Fall back to navigation search
      const match = searchableItems.find(item => 
        item.keywords.some(keyword => keyword.includes(query) || query.includes(keyword))
      );

      if (match) {
        onNavigate(match.tab);
        setSearchQuery('');
        toast({
          title: "Navigation",
          description: `Navigated to ${match.label}`,
        });
      } else {
        toast({
          title: "No Results",
          description: "Try searching for model numbers, part numbers, or: dashboard, add wo, fixbot, analytics, settings",
          variant: "destructive"
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex space-x-2 w-full max-w-md mx-auto">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search for models, parts, or navigation..."
        className="flex-1"
        disabled={isSearching}
      />
      <Button onClick={handleSearch} size="sm" className="px-3" disabled={isSearching}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
