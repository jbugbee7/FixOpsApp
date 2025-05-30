import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package, ChevronDown, ChevronUp, Save } from 'lucide-react';
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isAddExpanded, setIsAddExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // New part form state with 75% default markup
  const [newPart, setNewPart] = useState({
    part_name: '',
    part_number: '',
    part_cost: 0,
    markup_percentage: 75,
    appliance_type: applianceType || '',
    appliance_brand: applianceBrand || ''
  });

  const searchSystemParts = async () => {
    if (!user || !searchTerm.trim()) return;

    setLoading(true);
    try {
      console.log('Searching for parts with term:', searchTerm);
      
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
    toast({
      title: "Part Added",
      description: `${systemPart.part_name} has been added to the work order.`,
    });
  };

  const handleSaveNewPart = async () => {
    if (!user || !newPart.part_name || !newPart.part_number) {
      toast({
        title: "Missing Information",
        description: "Please enter both part name and part number.",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      const finalPrice = newPart.part_cost * (1 + newPart.markup_percentage / 100);
      
      const { data, error } = await supabase
        .from('parts')
        .insert({
          part_name: newPart.part_name,
          part_number: newPart.part_number,
          part_cost: newPart.part_cost,
          markup_percentage: newPart.markup_percentage,
          final_price: finalPrice,
          appliance_type: newPart.appliance_type || null,
          appliance_brand: newPart.appliance_brand || null,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving part:', error);
        toast({
          title: "Error",
          description: "Failed to save part to directory.",
          variant: "destructive"
        });
        return;
      }

      console.log('Part saved successfully:', data);
      
      // Reset form with 75% default markup
      setNewPart({
        part_name: '',
        part_number: '',
        part_cost: 0,
        markup_percentage: 75,
        appliance_type: applianceType || '',
        appliance_brand: applianceBrand || ''
      });

      // Refresh search results if there's a search term
      if (searchTerm.trim()) {
        searchSystemParts();
      }

      toast({
        title: "Part Saved",
        description: `${data.part_name} has been added to the parts directory.`,
      });

    } catch (error) {
      console.error('Error saving part:', error);
      toast({
        title: "Error",
        description: "Failed to save part to directory.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleNewPartInputChange = (field: string, value: string | number) => {
    setNewPart(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateFinalPrice = () => {
    return newPart.part_cost * (1 + newPart.markup_percentage / 100);
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
    <div className="space-y-4">
      {/* Search Parts Section */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
        >
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Parts Directory</span>
            </div>
            {isSearchExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {isSearchExpanded && (
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="partSearch">Search Parts</Label>
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
                      Add to Order
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

      {/* Add New Part Section */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => setIsAddExpanded(!isAddExpanded)}
        >
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Add New Part to Directory</span>
            </div>
            {isAddExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {isAddExpanded && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPartName">Part Name *</Label>
                <Input
                  id="newPartName"
                  value={newPart.part_name}
                  onChange={(e) => handleNewPartInputChange('part_name', e.target.value)}
                  placeholder="Enter part name"
                />
              </div>
              <div>
                <Label htmlFor="newPartNumber">Part Number *</Label>
                <Input
                  id="newPartNumber"
                  value={newPart.part_number}
                  onChange={(e) => handleNewPartInputChange('part_number', e.target.value)}
                  placeholder="Enter part number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPartCost">Part Cost ($)</Label>
                <Input
                  id="newPartCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPart.part_cost || ''}
                  onChange={(e) => handleNewPartInputChange('part_cost', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="newPartMarkup">Markup (%)</Label>
                <Input
                  id="newPartMarkup"
                  type="number"
                  step="0.1"
                  min="0"
                  value={newPart.markup_percentage}
                  onChange={(e) => handleNewPartInputChange('markup_percentage', parseFloat(e.target.value) || 75)}
                  placeholder="75"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPartBrand">Appliance Brand (Optional)</Label>
                <Input
                  id="newPartBrand"
                  value={newPart.appliance_brand}
                  onChange={(e) => handleNewPartInputChange('appliance_brand', e.target.value)}
                  placeholder="e.g., GE, Whirlpool"
                />
              </div>
              <div>
                <Label htmlFor="newPartType">Appliance Type (Optional)</Label>
                <Input
                  id="newPartType"
                  value={newPart.appliance_type}
                  onChange={(e) => handleNewPartInputChange('appliance_type', e.target.value)}
                  placeholder="e.g., Washer, Dryer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Final Price:</span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400 ml-2">
                  ${calculateFinalPrice().toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleSaveNewPart}
                disabled={isAdding || !newPart.part_name || !newPart.part_number}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isAdding ? 'Saving...' : 'Save to Directory'}</span>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SystemPartsLookup;
