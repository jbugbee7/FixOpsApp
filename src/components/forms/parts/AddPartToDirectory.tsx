
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useAddPartForm } from '@/hooks/useAddPartForm';
import PartFormInputs from './PartFormInputs';
import PartFormActions from './PartFormActions';

interface AddPartToDirectoryProps {
  applianceType?: string;
  applianceBrand?: string;
  onPartAdded?: () => void;
}

const AddPartToDirectory = ({ applianceType, applianceBrand, onPartAdded }: AddPartToDirectoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    newPart,
    isAdding,
    handleInputChange,
    handleSaveNewPart
  } = useAddPartForm({ applianceType, applianceBrand, onPartAdded });

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Add New Part to Directory</span>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <PartFormInputs
            newPart={newPart}
            onInputChange={handleInputChange}
          />
          <PartFormActions
            newPart={newPart}
            isAdding={isAdding}
            onSave={handleSaveNewPart}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default AddPartToDirectory;
