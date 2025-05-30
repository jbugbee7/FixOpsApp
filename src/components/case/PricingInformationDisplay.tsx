
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from 'lucide-react';
import { Case } from '@/types/case';

interface CasePart {
  id: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

interface PricingInformationDisplayProps {
  case: Case;
  caseParts: CasePart[];
  getTotalCost: () => number;
}

const PricingInformationDisplay = ({ case: caseData, caseParts, getTotalCost }: PricingInformationDisplayProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <DollarSign className="h-5 w-5" />
          <span>Pricing Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Labor Cost</label>
            <p className="text-lg font-semibold dark:text-slate-100">
              Level {caseData.labor_level || 0} - ${caseData.labor_cost_calculated || 0}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Diagnostic Fee</label>
            <p className="text-lg dark:text-slate-100">
              {caseData.diagnostic_fee_type || 'None'} - ${caseData.diagnostic_fee_amount || 0}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Parts Cost</label>
            <p className="text-lg dark:text-slate-100">
              ${caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0).toFixed(2)}
            </p>
            {caseParts.length > 0 && (
              <div className="mt-2 space-y-1">
                {caseParts.map((part, index) => (
                  <div key={index} className="text-sm text-slate-600 dark:text-slate-400">
                    {part.part_name} (#{part.part_number}) - Qty: {part.quantity} - ${(part.final_price * part.quantity).toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Estimate</label>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              ${getTotalCost().toFixed(2)}
            </p>
          </div>
        </div>
        {caseData.spt_status && (
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Job Status</label>
            <Badge variant="outline" className="ml-2">
              {caseData.spt_status === 'spt' ? 'SPT Scheduled' : 'Complete'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingInformationDisplay;
