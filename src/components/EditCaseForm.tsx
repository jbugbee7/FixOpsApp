
import ModernEditCaseForm from './forms/modern/EditCaseForm';
import { Case } from '@/types/case';

interface EditCaseFormProps {
  case: Case;
  onBack: () => void;
  onSave: (updatedCase: Case) => void;
}

const EditCaseForm = ({ case: caseData, onBack, onSave }: EditCaseFormProps) => {
  return <ModernEditCaseForm case={caseData} onBack={onBack} onSave={onSave} />;
};

export default EditCaseForm;
