
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { calculateFinalPrice } from '@/utils/partsCalculations';

interface AddPartToDirectoryProps {
  applianceType?: string;
  applianceBrand?: string;
  onPartAdded?: () => void;
}

const AddPartToDirectory = ({ applianceType, applianceBrand, onPartAdded }: AddPartToDirectoryProps) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [newPart, setNewPart] = useState({
    part_name: '',
    part_number: '',
    part_cost: 0,
    markup_percentage: 75,
    appliance_type: applianceType || '',
    appliance_brand: applianceBrand || ''
  });

  const handleSaveNewPart = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add parts to the directory.",
        variant: "destructive"
      });
      return;
    }

    if (!newPart.part_name || !newPart.part_number) {
      toast({
        title: "Missing Information",
        description: "Please enter both part name and part number.",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      const finalPrice = calculateFinalPrice(newPart.part_cost, newPart.markup_percentage);
      
      console.log('Attempting to save part with user_id:', user.id);
      console.log('Part data:', {
        part_name: newPart.part_name,
        part_number: newPart.part_number,
        part_cost: newPart.part_cost,
        markup_percentage: newPart.markup_percentage,
        final_price: finalPrice,
        appliance_type: newPart.appliance_type || null,
        appliance_brand: newPart.appliance_brand || null,
        user_id: user.id
      });
      
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
          title: "Error Saving Part",
          description: `Failed to save part: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Part saved successfully:', data);
      
      // Reset form
      setNewPart({
        part_name: '',
        part_number: '',
        part_cost: 0,
        markup_percentage: 75,
        appliance_type: applianceType || '',
        appliance_brand: applianceBrand || ''
      });

      if (onPartAdded) {
        onPartAdded();
      }

      toast({
        title: "Part Saved Successfully",
        description: `${data.part_name} has been added to the parts directory.`,
      });

    } catch (error) {
      console.error('Unexpected error saving part:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while saving the part. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewPart(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Add New Part to Directory</span>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {!user && (
            <div className="p-3 border border-amber-200 rounded-lg bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Please log in to add parts to the directory.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPartName">Part Name *</Label>
              <Input
                id="newPartName"
                value={newPart.part_name}
                onChange={(e) => handleInputChange('part_name', e.target.value)}
                placeholder="Enter part name"
                disabled={!user}
              />
            </div>
            <div>
              <Label htmlFor="newPartNumber">Part Number *</Label>
              <Input
                id="newPartNumber"
                value={newPart.part_number}
                onChange={(e) => handleInputChange('part_number', e.target.value)}
                placeholder="Enter part number"
                disabled={!user}
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
                onChange={(e) => handleInputChange('part_cost', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={!user}
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
                onChange={(e) => handleInputChange('markup_percentage', parseFloat(e.target.value) || 75)}
                placeholder="75"
                disabled={!user}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPartBrand">Appliance Brand (Optional)</Label>
              <Input
                id="newPartBrand"
                value={newPart.appliance_brand}
                onChange={(e) => handleInputChange('appliance_brand', e.target.value)}
                placeholder="e.g., GE, Whirlpool"
                disabled={!user}
              />
            </div>
            <div>
              <Label htmlFor="newPartType">Appliance Type (Optional)</Label>
              <Input
                id="newPartType"
                value={newPart.appliance_type}
                onChange={(e) => handleInputChange('appliance_type', e.target.value)}
                placeholder="e.g., Washer, Dryer"
                disabled={!user}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Final Price:</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400 ml-2">
                ${calculateFinalPrice(newPart.part_cost, newPart.markup_percentage).toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleSaveNewPart}
              disabled={isAdding || !user || !newPart.part_name || !newPart.part_number}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isAdding ? 'Saving...' : 'Save to Directory'}</span>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AddPartToDirectory;
