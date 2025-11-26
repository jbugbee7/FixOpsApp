
import { useState } from 'react';
import { useStatusUpdate } from '@/hooks/useStatusUpdate';
import { Case } from '@/types/case';
import StatusUpdateDropdown from './dropdown/StatusUpdateDropdown';
import JobActionsDropdown from './dropdown/JobActionsDropdown';
import CancellationDialog from './dropdown/CancellationDialog';
import SignatureDialog from './SignatureDialog';
import PaymentDialog from './PaymentDialog';

interface StatusActionsDropdownProps {
  currentCase: Case;
}

const StatusActionsDropdown = ({ currentCase }: StatusActionsDropdownProps) => {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showAuthSignature, setShowAuthSignature] = useState(false);
  const [showCompletionSignature, setShowCompletionSignature] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { handleStatusUpdate, handleSPTComplete, saveSignature } = useStatusUpdate();

  const handleStatusChange = (status: string) => {
    if (status === 'cancel') {
      setShowCancellationDialog(true);
    } else if (status === 'In Progress' || status === 'active') {
      // Check if authorization signature already exists
      if (!currentCase.authorization_signature) {
        setShowAuthSignature(true);
      } else {
        handleStatusUpdate(currentCase.id, status);
      }
    } else {
      handleStatusUpdate(currentCase.id, status);
    }
  };

  const handleCancellation = (reason: string) => {
    handleStatusUpdate(currentCase.id, 'cancel', reason);
    setShowCancellationDialog(false);
  };

  const handleJobAction = (sptStatus: string) => {
    // Before completing, require completion signature and payment
    if (!currentCase.completion_signature) {
      setShowCompletionSignature(true);
    } else {
      handleSPTComplete(currentCase.id, sptStatus);
    }
  };

  const handleAuthSignature = async (signature: string, signerName: string) => {
    await saveSignature(currentCase.id, 'authorization', signature, signerName);
    await handleStatusUpdate(currentCase.id, 'In Progress');
    setShowAuthSignature(false);
  };

  const handleCompletionSignature = async (signature: string, signerName: string) => {
    await saveSignature(currentCase.id, 'completion', signature, signerName);
    setShowCompletionSignature(false);
    // Show payment dialog after completion signature
    setShowPaymentDialog(true);
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

      <SignatureDialog
        open={showAuthSignature}
        onOpenChange={setShowAuthSignature}
        onConfirm={handleAuthSignature}
        title="Authorization to Proceed with Repair"
        workOrderDetails={{
          customerName: currentCase.customer_name,
          applianceType: currentCase.appliance_type,
          problemDescription: currentCase.problem_description,
          laborCost: currentCase.labor_cost,
          partsCost: currentCase.parts_cost,
          totalCost: currentCase.total_cost,
        }}
        showPricing={true}
        showTerms={true}
      />

      <SignatureDialog
        open={showCompletionSignature}
        onOpenChange={setShowCompletionSignature}
        onConfirm={handleCompletionSignature}
        title="Work Order Completion Confirmation"
        workOrderDetails={{
          customerName: currentCase.customer_name,
          applianceType: currentCase.appliance_type,
          problemDescription: currentCase.problem_description,
          laborCost: currentCase.labor_cost,
          partsCost: currentCase.parts_cost,
          totalCost: currentCase.total_cost,
        }}
        showPricing={true}
        showTerms={false}
      />

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        caseId={currentCase.id}
        amount={currentCase.total_cost || 0}
        workOrderDetails={{
          customerName: currentCase.customer_name,
          applianceType: currentCase.appliance_type,
          laborCost: currentCase.labor_cost,
          partsCost: currentCase.parts_cost,
          totalCost: currentCase.total_cost,
        }}
      />
    </>
  );
};

export default StatusActionsDropdown;
