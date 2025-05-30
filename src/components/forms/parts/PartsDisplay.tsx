
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface Part {
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

interface PartsDisplayProps {
  parts: Part[];
  onRemovePart: (index: number) => void;
}

const PartsDisplay = ({ parts, onRemovePart }: PartsDisplayProps) => {
  if (parts.length === 0) {
    return null;
  }

  return (
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
            onClick={() => onRemovePart(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PartsDisplay;
