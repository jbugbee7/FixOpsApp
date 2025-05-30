
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';

interface Part {
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  final_price: number;
}

interface PricingSummaryProps {
  laborLevel: number;
  diagnosticFeeAmount: number;
  parts: Part[];
  calculateLaborCost: (level: number) => number;
}

const PricingSummary = ({ laborLevel, diagnosticFeeAmount, parts, calculateLaborCost }: PricingSummaryProps) => {
  const laborCost = calculateLaborCost(laborLevel);
  const partsCost = parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
  const totalCost = laborCost + diagnosticFeeAmount + partsCost;

  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Total Estimate:</span>
        <span className="text-green-600 dark:text-green-400">${totalCost.toFixed(2)}</span>
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
        Labor: ${laborCost} | Diagnostic: ${diagnosticFeeAmount} | Parts: ${partsCost.toFixed(2)}
      </div>
    </div>
  );
};

export default PricingSummary;
