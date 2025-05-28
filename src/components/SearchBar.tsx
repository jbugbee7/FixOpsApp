
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface SearchBarProps {
  onNavigate: (tab: string) => void;
}

const SearchBar = ({ onNavigate }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchableItems = [
    { keywords: ['dashboard', 'home', 'overview'], tab: 'dashboard', label: 'Dashboard' },
    { keywords: ['add', 'create', 'new', 'wo', 'work order', 'case'], tab: 'add-case', label: 'Add Work Order' },
    { keywords: ['ai', 'assistant', 'fixbot', 'bot', 'help'], tab: 'ai-assistant', label: 'FixBot Assistant' },
    { keywords: ['analytics', 'stats', 'reports', 'data'], tab: 'analytics', label: 'Analytics' },
    { keywords: ['settings', 'config', 'preferences'], tab: 'settings', label: 'Settings' },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Search Term",
        description: "Please enter something to search for.",
        variant: "destructive"
      });
      return;
    }

    const query = searchQuery.toLowerCase().trim();
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
        description: "Try searching for: dashboard, add wo, fixbot, analytics, or settings",
        variant: "destructive"
      });
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
        placeholder="Search for dashboard, add wo, fixbot, analytics..."
        className="flex-1"
      />
      <Button onClick={handleSearch} size="sm" className="px-3">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
