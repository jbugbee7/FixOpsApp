
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import { Case } from '@/types/case';

interface ServiceDetailsDisplayProps {
  case: Case;
}

const ServiceDetailsDisplay = ({ case: caseData }: ServiceDetailsDisplayProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <FileText className="h-5 w-5" />
          <span>Service Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Type</label>
          <p className="text-lg dark:text-slate-100">{caseData.service_type || 'N/A'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Problem Description</label>
          <p className="text-lg dark:text-slate-100">{caseData.problem_description}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Initial Diagnosis</label>
          <p className="text-lg dark:text-slate-100">{caseData.initial_diagnosis || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Parts Needed</label>
          <p className="text-lg dark:text-slate-100">{caseData.parts_needed || 'N/A'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Estimated Time</label>
          <p className="text-lg dark:text-slate-100">{caseData.estimated_time || 'N/A'}</p>
        </div>
        {caseData.technician_notes && (
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Technician Notes</label>
            <p className="text-lg dark:text-slate-100">{caseData.technician_notes}</p>
          </div>
        )}
        {caseData.cancellation_reason && (
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Cancellation Reason</label>
            <p className="text-lg text-red-600 dark:text-red-400">{caseData.cancellation_reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceDetailsDisplay;
