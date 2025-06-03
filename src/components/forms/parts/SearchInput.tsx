
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

const SearchInput = ({ searchTerm, onSearchTermChange, onSearch, loading }: SearchInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div>
      <Label htmlFor="partSearch">Search Parts</Label>
      <div className="flex space-x-2">
        <Input
          id="partSearch"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter part name or number..."
          className="flex-1"
          disabled={loading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={onSearch}
          disabled={loading || !searchTerm.trim()}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-slate-500 mt-1">
        Search by part name or part number (minimum 2 characters)
      </p>
    </div>
  );
};

export default SearchInput;
