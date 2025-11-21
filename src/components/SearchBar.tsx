
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import SearchResults from './SearchResults';
import SearchSuggestions from './SearchSuggestions';
import type { Case } from '@/types/case';

interface SearchBarProps {
  onNavigate: (tab: string) => void;
  onModelFound: (model: any) => void;
  onPartFound: (part: any) => void;
  onCaseClick?: (case_: Case) => void;
  cases?: Case[];
}

const SearchBar = ({ onNavigate, onModelFound, onPartFound, onCaseClick, cases = [] }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<Case[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchableItems = [
    { keywords: ['dashboard', 'home', 'overview'], tab: 'dashboard', label: 'Dashboard' },
    { keywords: ['add', 'create', 'new', 'wo', 'work order', 'case'], tab: 'add-case', label: 'Add Work Order' },
    { keywords: ['ai', 'assistant', 'fixbot', 'bot', 'help'], tab: 'ai-assistant', label: 'FixBot Assistant' },
    { keywords: ['analytics', 'stats', 'reports', 'data'], tab: 'analytics', label: 'Analytics' },
    { keywords: ['settings', 'config', 'preferences'], tab: 'settings', label: 'Settings' },
  ];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time search as user types
  useEffect(() => {
    const searchWorkOrders = () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        setShowSuggestions(false);
        return;
      }

      const searchTerm = searchQuery.toLowerCase().trim();
      const matchingCases = cases.filter(case_ => {
        const customerName = case_.customer_name?.toLowerCase() || '';
        const applianceType = case_.appliance_type?.toLowerCase() || '';
        const applianceBrand = case_.appliance_brand?.toLowerCase() || '';
        const woNumber = case_.wo_number?.toLowerCase() || '';
        const status = case_.status?.toLowerCase() || '';
        const createdDate = new Date(case_.created_at).toLocaleDateString().toLowerCase();
        const problemDesc = case_.problem_description?.toLowerCase() || '';
        
        return customerName.includes(searchTerm) ||
               applianceType.includes(searchTerm) ||
               applianceBrand.includes(searchTerm) ||
               woNumber.includes(searchTerm) ||
               status.includes(searchTerm) ||
               createdDate.includes(searchTerm) ||
               problemDesc.includes(searchTerm) ||
               `${applianceBrand} ${applianceType}`.includes(searchTerm);
      });

      setSearchResults(matchingCases);
      
      if (cases.length > 0) {
        setShowResults(matchingCases.length > 0);
        setShowSuggestions(matchingCases.length === 0 && searchQuery.length > 0);
      }
    };

    const timeoutId = setTimeout(searchWorkOrders, 150); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery, cases]);

  const searchDatabase = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Search appliance models
      const { data: models, error: modelsError } = await supabase
        .from('appliance_models')
        .select('*')
        .or(`model.ilike.%${query}%,brand.ilike.%${query}%`)
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
        onModelFound(models[0]);
        setSearchQuery('');
        setShowResults(false);
        setShowSuggestions(false);
        toast({
          title: "Model Found",
          description: `Found ${models[0].brand} ${models[0].model}`,
        });
        return true;
      }

      if (parts && parts.length > 0) {
        onPartFound(parts[0]);
        setSearchQuery('');
        setShowResults(false);
        setShowSuggestions(false);
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
    
    // If we have search results from work orders, show them
    if (searchResults.length > 0 && onCaseClick) {
      // Don't automatically select, let user see all results
      return;
    }
    
    // Try to search the database
    const foundInDatabase = await searchDatabase(query);
    
    if (!foundInDatabase) {
      // Fall back to navigation search
      const match = searchableItems.find(item => 
        item.keywords.some(keyword => keyword.includes(query) || query.includes(keyword))
      );

      if (match) {
        onNavigate(match.tab);
        setSearchQuery('');
        setShowResults(false);
        setShowSuggestions(false);
        toast({
          title: "Navigation",
          description: `Navigated to ${match.label}`,
        });
      } else {
        toast({
          title: "No Results",
          description: "Try searching for customer names, appliance types, dates, model numbers, part numbers, or: dashboard, add wo, fixbot, analytics, settings",
          variant: "destructive"
        });
      }
    }
  };

  const handleCaseClick = (selectedCase: Case) => {
    if (onCaseClick) {
      onCaseClick(selectedCase);
      setSearchQuery('');
      setShowResults(false);
      setShowSuggestions(false);
      toast({
        title: "Work Order Selected",
        description: `Opened work order for ${selectedCase.customer_name}`,
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Trigger search with the suggestion
    setTimeout(() => {
      setShowResults(true);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0 && onCaseClick) {
        handleCaseClick(searchResults[0]); // Select first result on Enter
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchQuery && searchResults.length > 0) {
      setShowResults(true);
    } else if (searchQuery && cases.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={searchRef} className="relative flex space-x-2 w-full max-w-md mx-auto">
      <Input
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={handleInputFocus}
        placeholder="Search work orders, models, parts, or navigation..."
        className="flex-1"
        disabled={isSearching}
      />
      <Button onClick={handleSearch} size="sm" className="px-3" disabled={isSearching}>
        <Search className="h-4 w-4" />
      </Button>
      
      {/* Search Results */}
      {showResults && onCaseClick && (
        <SearchResults 
          results={searchResults}
          onCaseClick={handleCaseClick}
          searchQuery={searchQuery}
        />
      )}
      
      {/* Search Suggestions */}
      {showSuggestions && (
        <SearchSuggestions
          cases={cases}
          onSuggestionClick={handleSuggestionClick}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default SearchBar;
