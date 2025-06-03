
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [systemParts, setSystemParts] = useState<SystemPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handleAddSystemPart = (systemPart: SystemPart) => {
    const part: Part = {
      part_name: systemPart.part_name,
      part_number: systemPart.part_number,
      part_cost: systemPart.part_cost,
      quantity: 1,
      markup_percentage: systemPart.markup_percentage,
      final_price: systemPart.final_price
    };
    onAddPart(part);
    toast({
      title: "Part Added",
      description: `${systemPart.part_name} has been added to the work order.`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchSystemParts();
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchSystemParts();
      }, 500); // Increased debounce time for better UX
      return () => clearTimeout(timeoutId);
    } else {
      setSystemParts([]);
      setHasSearched(false);
      setSearchError(null);
    }
  }, [searchTerm]);

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
          <div>
            <Label htmlFor="partSearch">Search Parts</Label>
            <div className="flex space-x-2">
              <Input
                id="partSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter part name or number..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={searchSystemParts}
                disabled={loading || !searchTerm.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Search by part name or part number (minimum 2 characters)
            </p>
          </div>

          {loading && (
            <div className="text-center py-8 text-slate-600 dark:text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Searching parts directory...
            </div>
          )}

          {searchError && (
            <div className="flex items-center space-x-2 p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-400">{searchError}</p>
            </div>
          )}

          {systemParts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Found {systemParts.length} part(s) for "{searchTerm}"
              </h4>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {systemParts.map((part) => (
                  <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-700 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {part.part_name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Part #: {part.part_number}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Cost: ${part.part_cost?.toFixed(2)} | 
                        Markup: {part.markup_percentage}% | 
                        Final: ${part.final_price?.toFixed(2)}
                      </div>
                      {(part.appliance_type || part.appliance_brand) && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Compatible: {part.appliance_brand} {part.appliance_type}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddSystemPart(part)}
                      className="ml-3 shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasSearched && !loading && systemParts.length === 0 && !searchError && searchTerm.length >= 2 && (
            <div className="text-center py-6 text-slate-600 dark:text-slate-400">
              <div className="mb-2">
                <Search className="h-8 w-8 mx-auto text-slate-400" />
              </div>
              <p className="font-medium">No parts found</p>
              <p className="text-sm">No parts found matching "{searchTerm}"</p>
              <p className="text-xs mt-1">Try using different keywords or part numbers</p>
            </div>
          )}

          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
              Enter at least 2 characters to search
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default PartsSearch;
