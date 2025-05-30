import StatusUpdateFlow from '../forms/StatusUpdateFlow';
import CaseStatusCard from './CaseStatusCard';
import CustomerInformationDisplay from './CustomerInformationDisplay';
import ApplianceInformationDisplay from './ApplianceInformationDisplay';
import ServiceDetailsDisplay from './ServiceDetailsDisplay';
import { Case } from '@/types/case';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CaseDetailsViewModeProps {
  currentCase: Case;
  status: string;
  caseParts: any[];
  onStatusUpdate: (newStatus: string, cancellationReason?: string) => void;
  onSPTComplete: (sptStatus: string) => void;
  onStatusChange: (newStatus: string) => void;
  getTotalCostValue: () => number;
  setShowPaymentPage: (show: boolean) => void;
}

const CaseDetailsViewMode = ({
  currentCase,
  status,
  caseParts,
  onStatusUpdate,
  onSPTComplete,
  onStatusChange,
  getTotalCostValue,
  setShowPaymentPage
}: CaseDetailsViewModeProps) => {
  return (
    <div className="space-y-6">
      {/* Status Update Flow */}
      <StatusUpdateFlow 
        onStatusUpdate={onStatusUpdate}
        onSPTComplete={onSPTComplete}
        currentStatus={status}
        sptStatus={currentCase.spt_status}
      />

      {/* Status Card */}
      <CaseStatusCard
        status={status}
        onStatusChange={onStatusChange}
      />

      {/* Customer Information */}
      <CustomerInformationDisplay case={currentCase} />

      {/* Appliance Information */}
      <ApplianceInformationDisplay case={currentCase} />

      {/* Service Details */}
      <ServiceDetailsDisplay case={currentCase} />

      {/* Pricing Information Display */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <span>Pricing Information</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                Total: ${getTotalCostValue().toFixed(2)}
              </span>
              <Button 
                onClick={() => setShowPaymentPage(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={getTotalCostValue() <= 0}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment (${getTotalCostValue().toFixed(2)})
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Labor Cost</label>
              <p className="text-lg font-semibold dark:text-slate-100">
                Level {currentCase.labor_level || 0} - ${currentCase.labor_cost_calculated || 0}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Diagnostic Fee</label>
              <p className="text-lg dark:text-slate-100">
                {currentCase.diagnostic_fee_type || 'None'} - ${currentCase.diagnostic_fee_amount || 0}
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
                ${getTotalCostValue().toFixed(2)}
              </p>
            </div>
          </div>
          {currentCase.spt_status && (
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Job Status</label>
              <Badge variant="outline" className="ml-2">
                {currentCase.spt_status === 'spt' ? 'SPT Scheduled' : 'Complete'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseDetailsViewMode;
