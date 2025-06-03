
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { usePartsSearch } from '@/hooks/usePartsSearch';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import SearchStates from './SearchStates';

interface Part {
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

interface PartsSearchProps {
  onAddPart: (part: Part) => void;
}

const PartsSearch = ({ onAddPart }: PartsSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    systemParts,
    loading,
    searchError,
    hasSearched,
    searchSystemParts
  } = usePartsSearch();

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Parts Directory</span>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <SearchInput
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={searchSystemParts}
            loading={loading}
          />

          <SearchStates
            loading={loading}
            searchError={searchError}
            hasSearched={hasSearched}
            searchTerm={searchTerm}
            partsCount={systemParts.length}
          />

          <SearchResults
            systemParts={systemParts}
            searchTerm={searchTerm}
            onAddPart={onAddPart}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default PartsSearch;
