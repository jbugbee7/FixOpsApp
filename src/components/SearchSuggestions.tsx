
import React from 'react';
import { Search, User, Wrench, Calendar } from 'lucide-react';
import type { Case } from '@/types/case';

interface SearchSuggestionsProps {
  cases: Case[];
  onSuggestionClick: (suggestion: string) => void;
  searchQuery: string;
}

const SearchSuggestions = ({ cases, onSuggestionClick, searchQuery }: SearchSuggestionsProps) => {
  // Generate suggestions based on available data
  const getSuggestions = () => {
    const suggestions: { text: string; icon: React.ReactNode; type: string }[] = [];
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) return [];

    // Get unique values from cases
    const customers = [...new Set(cases.map(c => c.customer_name))];
    const brands = [...new Set(cases.map(c => c.appliance_brand))];
    const types = [...new Set(cases.map(c => c.appliance_type))];
    const statuses = [...new Set(cases.map(c => c.status))];
    
    // Customer name suggestions
    customers.forEach(customer => {
      if (customer.toLowerCase().includes(query) && !customer.toLowerCase().startsWith(query)) {
        suggestions.push({
          text: customer,
          icon: <User className="h-3 w-3" />,
          type: 'Customer'
        });
      }
    });

    // Brand suggestions
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(query) && !brand.toLowerCase().startsWith(query)) {
        suggestions.push({
          text: brand,
          icon: <Wrench className="h-3 w-3" />,
          type: 'Brand'
        });
      }
    });

    // Appliance type suggestions
    types.forEach(type => {
      if (type.toLowerCase().includes(query) && !type.toLowerCase().startsWith(query)) {
        suggestions.push({
          text: type,
          icon: <Wrench className="h-3 w-3" />,
          type: 'Type'
        });
      }
    });

    // Brand + Type combinations
    brands.forEach(brand => {
      types.forEach(type => {
        const combination = `${brand} ${type}`;
        if (combination.toLowerCase().includes(query) && 
            !combination.toLowerCase().startsWith(query) &&
            cases.some(c => c.appliance_brand === brand && c.appliance_type === type)) {
          suggestions.push({
            text: combination,
            icon: <Wrench className="h-3 w-3" />,
            type: 'Appliance'
          });
        }
      });
    });

    // Status suggestions
    statuses.forEach(status => {
      if (status.toLowerCase().includes(query) && !status.toLowerCase().startsWith(query)) {
        suggestions.push({
          text: status,
          icon: <Calendar className="h-3 w-3" />,
          type: 'Status'
        });
      }
    });

    // Remove duplicates and limit to 5
    return suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.text === suggestion.text)
      )
      .slice(0, 5);
  };

  const suggestions = getSuggestions();

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-40">
      <div className="p-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggestions:</p>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer rounded text-sm"
            onClick={() => onSuggestionClick(suggestion.text)}
          >
            {suggestion.icon}
            <span className="flex-1">{suggestion.text}</span>
            <span className="text-xs text-gray-400">{suggestion.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
