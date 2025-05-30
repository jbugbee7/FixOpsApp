
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from 'lucide-react';
import PartsSearch from './parts/PartsSearch';
import AddPartToDirectory from './parts/AddPartToDirectory';
import ManualPartsEntry from './parts/ManualPartsEntry';
import PartsDisplay from './parts/PartsDisplay';
import { getTotalPartsValue } from '@/utils/partsCalculations';

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
  applianceType?: string;
  applianceBrand?: string;
}

const PartsManager = ({ parts, onChange, applianceType, applianceBrand }: PartsManagerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddPart = (newPart: Part) => {
    onChange([...parts, newPart]);
  };

  const handleRemovePart = (index: number) => {
    const updatedParts = parts.filter((_, i) => i !== index);
    onChange(updatedParts);
  };

  return (
    <div className="space-y-6">
      {/* Parts Directory Lookup & Add */}
      <PartsSearch onAddPart={handleAddPart} />
      <AddPartToDirectory 
        applianceType={applianceType}
        applianceBrand={applianceBrand}
      />

      {/* Manual Parts Entry - Collapsible */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <span>Manual Parts Entry</span>
              <Badge variant="outline" className="ml-2">
                Total: ${getTotalPartsValue(parts).toFixed(2)}
              </Badge>
            </div>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CardTitle>
        </CardHeader>
        {isExpanded && (
          <CardContent className="space-y-4 animate-fade-in">
            <ManualPartsEntry onAddPart={handleAddPart} />
            <PartsDisplay parts={parts} onRemovePart={handleRemovePart} />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PartsManager;
