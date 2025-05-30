
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

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

interface SystemPartsLookupProps {
  onAddPart: (part: Part) => void;
  applianceType?: string;
  applianceBrand?: string;
}

const SystemPartsLookup = ({ onAddPart, applianceType, applianceBrand }: SystemPartsLookupProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [systemParts, setSystemParts] = useState<SystemPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const searchSystemParts = async () => {
    if (!user || !searchTerm.trim()) return;

    setLoading(true);
    try {
      console.log('Searching for parts with term:', searchTerm);
      console.log('Current user:', user.id);
      
      // Simple search - look for the search term in part_name OR part_number
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .or(`part_name.ilike.%${searchTerm}%,part_number.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) {
        console.error('Error searching parts:', error);
        return;
      }

      console.log('Found parts:', data);
      setSystemParts(data || []);
    } catch (error) {
      console.error('Error searching parts:', error);
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
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchSystemParts();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSystemParts([]);
    }
  }, [searchTerm]);

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle 
          className="flex items-center space-x-2 dark:text-slate-100 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Package className="h-5 w-5" />
          <span>System Parts Lookup</span>
          <Badge variant="secondary" className="ml-auto">
            {isExpanded ? 'Hide' : 'Show'}
          </Badge>
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="partSearch">Search System Parts</Label>
            <div className="flex space-x-2">
              <Input
                id="partSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter part name or number..."
                className="flex-1"
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
              Search by part name or part number
            </p>
          </div>

          {loading && (
            <div className="text-center py-4 text-slate-600 dark:text-slate-400">
              Searching parts...
            </div>
          )}

          {systemParts.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Found {systemParts.length} part(s)
              </h4>
              {systemParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-700">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {part.part_name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      #{part.part_number} | Cost: ${part.part_cost?.toFixed(2)} | 
                      Markup: {part.markup_percentage}% | Final: ${part.final_price?.toFixed(2)}
                    </div>
                    {(part.appliance_type || part.appliance_brand) && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {part.appliance_brand} {part.appliance_type}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddSystemPart(part)}
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchTerm.length >= 2 && !loading && systemParts.length === 0 && (
            <div className="text-center py-4 text-slate-600 dark:text-slate-400">
              No parts found matching "{searchTerm}"
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default SystemPartsLookup;
