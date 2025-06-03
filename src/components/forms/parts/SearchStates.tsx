
import { Search, AlertCircle } from 'lucide-react';

interface SearchStatesProps {
  loading: boolean;
  searchError: string | null;
  hasSearched: boolean;
  searchTerm: string;
  partsCount: number;
}

export const LoadingState = () => (
  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
    Searching parts directory...
  </div>
);

export const ErrorState = ({ error }: { error: string }) => (
  <div className="flex items-center space-x-2 p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
    <AlertCircle className="h-4 w-4 text-red-500" />
    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
  </div>
);

export const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
  <div className="text-center py-6 text-slate-600 dark:text-slate-400">
    <div className="mb-2">
      <Search className="h-8 w-8 mx-auto text-slate-400" />
    </div>
    <p className="font-medium">No parts found</p>
    <p className="text-sm">No parts found matching "{searchTerm}"</p>
    <p className="text-xs mt-1">Try using different keywords or part numbers</p>
  </div>
);

export const MinCharactersState = () => (
  <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
    Enter at least 2 characters to search
  </div>
);

const SearchStates = ({ loading, searchError, hasSearched, searchTerm, partsCount }: SearchStatesProps) => {
  if (loading) return <LoadingState />;
  if (searchError) return <ErrorState error={searchError} />;
  if (hasSearched && !loading && partsCount === 0 && !searchError && searchTerm.length >= 2) {
    return <EmptyState searchTerm={searchTerm} />;
  }
  if (searchTerm.length > 0 && searchTerm.length < 2) {
    return <MinCharactersState />;
  }
  return null;
};

export default SearchStates;
