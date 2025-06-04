
import { useState } from 'react';
import { useStatusUpdate } from '@/hooks/useStatusUpdate';
import { Case } from '@/types/case';
import StatusUpdateDropdown from './dropdown/StatusUpdateDropdown';
import JobActionsDropdown from './dropdown/JobActionsDropdown';
import CancellationDialog from './dropdown/CancellationDialog';

interface StatusActionsDropdownProps {
  currentCase: Case;
}

const StatusActionsDropdown = ({ currentCase }: StatusActionsDropdownProps) => {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const { handleStatusUpdate, handleSPTComplete } = useStatusUpdate();

  const handleStatusChange = (status: string) => {
    if (status === 'cancel') {
      setShowCancellationDialog(true);
    } else {
      handleStatusUpdate(currentCase, status);
    }
  };

  const handleCancellation = (reason: string) => {
    handleStatusUpdate(currentCase, 'cancel', reason);
    setShowCancellationDialog(false);
  };

  const handleJobAction = (sptStatus: string) => {
    handleSPTComplete(currentCase, sptStatus);
  };

  return (
    <>
      <div className="flex gap-2">
        <StatusUpdateDropdown onStatusChange={handleStatusChange} />
        <JobActionsDropdown 
          currentCase={currentCase}
          onSPTComplete={handleJobAction}
        />
      </div>

      <CancellationDialog
        open={showCancellationDialog}
        onOpenChange={setShowCancellationDialog}
        onConfirm={handleCancellation}
      />
    </>
  );
};

export default StatusActionsDropdown;
