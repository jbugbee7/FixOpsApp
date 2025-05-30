
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import LaborCostSelector from '../LaborCostSelector';
import DiagnosticFeeSelector from '../DiagnosticFeeSelector';
import PartsManager from '../PartsManager';

interface PricingSectionProps {
  formData: any;
  parts: any[];
  onInputChange: (field: string, value: string | number) => void;
  onDiagnosticFeeChange: (type: string, amount: number) => void;
  onPartsChange: (parts: any[]) => void;
  getTotalCost: () => number;
  getLaborCost: () => number;
  getTotalPartsValue: () => number;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const PricingSection = ({ 
  formData, 
  parts, 
  onInputChange, 
  onDiagnosticFeeChange, 
  onPartsChange,
  getTotalCost,
  getLaborCost,
  getTotalPartsValue,
  expanded, 
  onToggle, 
  icon: Icon 
}: PricingSectionProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Pricing & Costs</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
              Total: ${getTotalCost().toFixed(2)}
            </span>
            <Icon className="h-5 w-5" />
          </div>
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LaborCostSelector
              value={formData.laborLevel}
              onChange={(value) => onInputChange('laborLevel', value)}
            />
            <DiagnosticFeeSelector
              value={formData.diagnosticFeeType}
              onChange={onDiagnosticFeeChange}
            />
          </div>
          
          {/* Parts Manager */}
          <PartsManager parts={parts} onChange={onPartsChange} />
          
          {/* Cost Summary */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Cost Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Labor Cost:</span>
                <span className="font-medium">${getLaborCost()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Diagnostic Fee:</span>
                <span className="font-medium">${formData.diagnosticFeeAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Parts Total:</span>
                <span className="font-medium">${getTotalPartsValue().toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total Estimate:</span>
                <span className="text-green-600 dark:text-green-400">${getTotalCost().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PricingSection;
