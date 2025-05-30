
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { calculateFinalPrice } from '@/utils/partsCalculations';

interface Part {
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

interface ManualPartsEntryProps {
  onAddPart: (part: Part) => void;
}

const ManualPartsEntry = ({ onAddPart }: ManualPartsEntryProps) => {
  const [newPart, setNewPart] = useState<Partial<Part>>({
    part_name: '',
    part_number: '',
    part_cost: 0,
    quantity: 1,
    markup_percentage: 75,
    final_price: 0
  });

  const handleAddPart = () => {
    if (!newPart.part_name || !newPart.part_number) {
      toast({
        title: "Missing Information",
        description: "Please enter both part name and part number.",
        variant: "destructive"
      });
      return;
    }

    const cost = Number(newPart.part_cost) || 0;
    const quantity = Number(newPart.quantity) || 1;
    const markup = Number(newPart.markup_percentage) || 75;
    const finalPrice = calculateFinalPrice(cost, markup);
    
    const partToAdd: Part = {
      part_name: newPart.part_name,
      part_number: newPart.part_number,
      part_cost: cost,
      quantity: quantity,
      markup_percentage: markup,
      final_price: finalPrice
    };

    onAddPart(partToAdd);
    setNewPart({
      part_name: '',
      part_number: '',
      part_cost: 0,
      quantity: 1,
      markup_percentage: 75,
      final_price: 0
    });
    
    toast({
      title: "Part Added",
      description: `${partToAdd.part_name} has been added successfully.`,
    });
  };

  const handlePartSearch = (partNumber: string) => {
    if (partNumber.trim()) {
      const searchQuery = `${partNumber} appliance part specifications`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(googleSearchUrl, '_blank');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewPart(prev => {
      const updated = { ...prev };
      
      if (field === 'part_cost' || field === 'quantity' || field === 'markup_percentage') {
        const numValue = value === '' ? 0 : Number(value);
        updated[field] = isNaN(numValue) ? 0 : numValue;
      } else {
        updated[field] = value;
      }
      
      return updated;
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
      <h4 className="font-medium text-slate-900 dark:text-slate-100">Add New Part</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="partName">Part Name *</Label>
          <Input
            id="partName"
            value={newPart.part_name || ''}
            onChange={(e) => handleInputChange('part_name', e.target.value)}
            placeholder="Enter part name"
          />
        </div>
        <div>
          <Label htmlFor="partNumber">Part Number *</Label>
          <div className="flex space-x-2">
            <Input
              id="partNumber"
              value={newPart.part_number || ''}
              onChange={(e) => handleInputChange('part_number', e.target.value)}
              placeholder="Enter part number"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePartSearch(newPart.part_number || '')}
              className="flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="partCost">Part Cost ($)</Label>
          <Input
            id="partCost"
            type="number"
            step="0.01"
            min="0"
            value={newPart.part_cost || ''}
            onChange={(e) => handleInputChange('part_cost', e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={newPart.quantity || ''}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="1"
          />
        </div>
        <div>
          <Label htmlFor="markup">Markup (%)</Label>
          <Input
            id="markup"
            type="number"
            step="0.1"
            min="0"
            value={newPart.markup_percentage || ''}
            onChange={(e) => handleInputChange('markup_percentage', e.target.value)}
            placeholder="75"
          />
        </div>
        <div>
          <Label>Final Price</Label>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400 pt-2">
            ${calculateFinalPrice(Number(newPart.part_cost) || 0, Number(newPart.markup_percentage) || 75).toFixed(2)}
          </div>
        </div>
      </div>
      <Button onClick={handleAddPart} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Part
      </Button>
    </div>
  );
};

export default ManualPartsEntry;
