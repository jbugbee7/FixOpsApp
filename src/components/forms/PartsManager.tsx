
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Part {
  id?: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

interface PartsManagerProps {
  parts: Part[];
  onChange: (parts: Part[]) => void;
}

const PartsManager = ({ parts, onChange }: PartsManagerProps) => {
  const [newPart, setNewPart] = useState<Partial<Part>>({
    part_name: '',
    part_number: '',
    part_cost: 0,
    quantity: 1,
    markup_percentage: 15,
    final_price: 0
  });

  const calculateFinalPrice = (cost: number, markup: number = 15) => {
    return cost * (1 + markup / 100);
  };

  const handleAddPart = () => {
    if (!newPart.part_name || !newPart.part_number) {
      toast({
        title: "Missing Information",
        description: "Please enter both part name and part number.",
        variant: "destructive"
      });
      return;
    }

    const finalPrice = calculateFinalPrice(newPart.part_cost || 0, newPart.markup_percentage);
    const partToAdd: Part = {
      part_name: newPart.part_name,
      part_number: newPart.part_number,
      part_cost: newPart.part_cost || 0,
      quantity: newPart.quantity || 1,
      markup_percentage: newPart.markup_percentage || 15,
      final_price: finalPrice
    };

    onChange([...parts, partToAdd]);
    setNewPart({
      part_name: '',
      part_number: '',
      part_cost: 0,
      quantity: 1,
      markup_percentage: 15,
      final_price: 0
    });
  };

  const handleRemovePart = (index: number) => {
    const updatedParts = parts.filter((_, i) => i !== index);
    onChange(updatedParts);
  };

  const handlePartSearch = (partNumber: string) => {
    if (partNumber.trim()) {
      const searchQuery = `${partNumber} appliance part specifications`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(googleSearchUrl, '_blank');
    }
  };

  const getTotalPartsValue = () => {
    return parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <span>Parts Management</span>
          <Badge variant="outline" className="ml-auto">
            Total: ${getTotalPartsValue().toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Part */}
        <div className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Add New Part</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partName">Part Name *</Label>
              <Input
                id="partName"
                value={newPart.part_name}
                onChange={(e) => setNewPart(prev => ({ ...prev, part_name: e.target.value }))}
                placeholder="Enter part name"
              />
            </div>
            <div>
              <Label htmlFor="partNumber">Part Number *</Label>
              <div className="flex space-x-2">
                <Input
                  id="partNumber"
                  value={newPart.part_number}
                  onChange={(e) => setNewPart(prev => ({ ...prev, part_number: e.target.value }))}
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
                value={newPart.part_cost}
                onChange={(e) => setNewPart(prev => ({ ...prev, part_cost: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newPart.quantity}
                onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
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
                value={newPart.markup_percentage}
                onChange={(e) => setNewPart(prev => ({ ...prev, markup_percentage: parseFloat(e.target.value) || 15 }))}
                placeholder="15"
              />
            </div>
            <div>
              <Label>Final Price</Label>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400 pt-2">
                ${calculateFinalPrice(newPart.part_cost || 0, newPart.markup_percentage).toFixed(2)}
              </div>
            </div>
          </div>
          <Button onClick={handleAddPart} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Part
          </Button>
        </div>

        {/* Parts List */}
        {parts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900 dark:text-slate-100">Added Parts</h4>
            {parts.map((part, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-700">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{part.part_name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Part #: {part.part_number} | Qty: {part.quantity} | Cost: ${part.part_cost.toFixed(2)} | 
                    Markup: {part.markup_percentage}% | Final: ${part.final_price.toFixed(2)}
                  </div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Total: ${(part.final_price * part.quantity).toFixed(2)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemovePart(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartsManager;
