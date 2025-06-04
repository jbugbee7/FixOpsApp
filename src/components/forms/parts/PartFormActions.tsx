
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { calculateFinalPrice } from '@/utils/partsCalculations';

interface PartFormData {
  part_name: string;
  part_number: string;
  part_cost: number;
  markup_percentage: number;
  appliance_type: string;
  appliance_brand: string;
}

interface PartFormActionsProps {
  newPart: PartFormData;
  isAdding: boolean;
  onSave: () => void;
}

const PartFormActions = ({ newPart, isAdding, onSave }: PartFormActionsProps) => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
      <div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Final Price:</span>
        <span className="text-lg font-semibold text-green-600 dark:text-green-400 ml-2">
          ${calculateFinalPrice(newPart.part_cost, newPart.markup_percentage).toFixed(2)}
        </span>
      </div>
      <Button
        onClick={onSave}
        disabled={isAdding || !user || !newPart.part_name || !newPart.part_number}
        className="flex items-center space-x-2"
      >
        <Save className="h-4 w-4" />
        <span>{isAdding ? 'Saving...' : 'Save to Directory'}</span>
      </Button>
    </div>
  );
};

export default PartFormActions;
