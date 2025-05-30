
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from 'lucide-react';
import { Case } from '@/types/case';

interface ApplianceInformationDisplayProps {
  case: Case;
}

const ApplianceInformationDisplay = ({ case: caseData }: ApplianceInformationDisplayProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <Wrench className="h-5 w-5" />
          <span>Appliance Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Appliance</label>
            <p className="text-lg font-semibold dark:text-slate-100">{caseData.appliance_brand} {caseData.appliance_type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Model</label>
            <p className="text-lg dark:text-slate-100">{caseData.appliance_model || 'N/A'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Serial Number</label>
            <p className="text-lg dark:text-slate-100">{caseData.serial_number || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Warranty Status</label>
            <p className="text-lg dark:text-slate-100">{caseData.warranty_status || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplianceInformationDisplay;
