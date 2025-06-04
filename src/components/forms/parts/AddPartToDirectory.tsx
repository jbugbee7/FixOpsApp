
import { useAddPartForm } from '@/hooks/useAddPartForm';
import PartFormInputs from './PartFormInputs';
import PartFormActions from './PartFormActions';
import AddPartDirectoryCard from './AddPartDirectoryCard';

interface AddPartToDirectoryProps {
  applianceType?: string;
  applianceBrand?: string;
  onPartAdded?: () => void;
}

const AddPartToDirectory = ({ applianceType, applianceBrand, onPartAdded }: AddPartToDirectoryProps) => {
  const {
    newPart,
    isAdding,
    handleInputChange,
    handleSaveNewPart
  } = useAddPartForm({ applianceType, applianceBrand, onPartAdded });

  return (
    <AddPartDirectoryCard>
      <PartFormInputs
        newPart={newPart}
        onInputChange={handleInputChange}
      />
      <PartFormActions
        newPart={newPart}
        isAdding={isAdding}
        onSave={handleSaveNewPart}
      />
    </AddPartDirectoryCard>
  );
};

export default AddPartToDirectory;
