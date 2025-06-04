
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';

interface PartFormData {
  part_name: string;
  part_number: string;
  part_cost: number;
  markup_percentage: number;
  appliance_type: string;
  appliance_brand: string;
}

interface PartFormInputsProps {
  newPart: PartFormData;
  onInputChange: (field: string, value: string | number) => void;
}

const PartFormInputs = ({ newPart, onInputChange }: PartFormInputsProps) => {
  const { user } = useAuth();

  return (
    <>
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
            onChange={(e) => onInputChange('part_name', e.target.value)}
            placeholder="Enter part name"
            disabled={!user}
          />
        </div>
        <div>
          <Label htmlFor="newPartNumber">Part Number *</Label>
          <Input
            id="newPartNumber"
            value={newPart.part_number}
            onChange={(e) => onInputChange('part_number', e.target.value)}
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
            onChange={(e) => onInputChange('part_cost', parseFloat(e.target.value) || 0)}
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
            onChange={(e) => onInputChange('markup_percentage', parseFloat(e.target.value) || 75)}
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
            onChange={(e) => onInputChange('appliance_brand', e.target.value)}
            placeholder="e.g., GE, Whirlpool"
            disabled={!user}
          />
        </div>
        <div>
          <Label htmlFor="newPartType">Appliance Type (Optional)</Label>
          <Input
            id="newPartType"
            value={newPart.appliance_type}
            onChange={(e) => onInputChange('appliance_type', e.target.value)}
            placeholder="e.g., Washer, Dryer"
            disabled={!user}
          />
        </div>
      </div>
    </>
  );
};

export default PartFormInputs;
