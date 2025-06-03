
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
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

interface SearchResultsProps {
  systemParts: SystemPart[];
  searchTerm: string;
  onAddPart: (part: Part) => void;
}

const SearchResults = ({ systemParts, searchTerm, onAddPart }: SearchResultsProps) => {
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

  if (systemParts.length === 0) return null;

  return (
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
  );
};

export default SearchResults;
