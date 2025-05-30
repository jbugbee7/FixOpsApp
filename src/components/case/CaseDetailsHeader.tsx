
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from 'lucide-react';

interface CaseDetailsHeaderProps {
  caseId: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const CaseDetailsHeader = ({
  caseId,
  isEditing,
  isSubmitting,
  onBack,
  onEdit,
  onCancel,
  onSave
}: CaseDetailsHeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Work Order</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">WO#{caseId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <Button 
                onClick={onEdit}
                className="flex items-center space-x-2"
                variant="outline"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsHeader;
