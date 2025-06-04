
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Wrench, Globe } from 'lucide-react';
import type { Case } from '@/types/case';

interface SearchResultsProps {
  results: Case[];
  onCaseClick: (case_: Case) => void;
  searchQuery: string;
}

const SearchResults = ({ results, onCaseClick, searchQuery }: SearchResultsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  const isPublicCase = (caseItem: Case) => {
    return !caseItem.user_id;
  };

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-50 p-4">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No work orders found for "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="p-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Found {results.length} work order{results.length !== 1 ? 's' : ''}
        </p>
        {results.map((caseItem) => (
          <Card 
            key={caseItem.id}
            className="mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            onClick={() => onCaseClick(caseItem)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isPublicCase(caseItem) && (
                    <Globe className="h-3 w-3 text-blue-500" />
                  )}
                  <span className="font-medium text-sm">
                    {highlightMatch(caseItem.wo_number || `WO-${caseItem.id.slice(0, 8)}`, searchQuery)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {isPublicCase(caseItem) && (
                    <Badge variant="outline" className="text-xs">
                      Public
                    </Badge>
                  )}
                  <Badge className={`${getStatusColor(caseItem.status)} text-xs`}>
                    {caseItem.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>{highlightMatch(caseItem.customer_name, searchQuery)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wrench className="h-3 w-3" />
                  <span>
                    {highlightMatch(`${caseItem.appliance_brand} ${caseItem.appliance_type}`, searchQuery)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(caseItem.created_at)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 mt-2 line-clamp-1">
                {highlightMatch(caseItem.problem_description.substring(0, 100), searchQuery)}
                {caseItem.problem_description.length > 100 ? '...' : ''}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
