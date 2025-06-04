
import { useAuth } from '@/contexts/AuthContext';
import CaseDetailsHeader from './case/CaseDetailsHeader';
import CaseDetailsViewMode from './case/CaseDetailsViewMode';
import CaseDetailsForm from './case/CaseDetailsForm';
import PaymentPage from './PaymentPage';
import PublicCaseBanner from './case/PublicCaseBanner';
import { Case } from '@/types/case';
import { useEditCaseForm } from '@/hooks/useEditCaseForm';
import { useEditCaseSubmit } from '@/hooks/useEditCaseSubmit';
import { useCaseDetailsActions } from './case/CaseDetailsActions';
import { useCaseParts } from '@/hooks/useCaseParts';
import { useCaseState } from '@/hooks/useCaseState';
import { useCaseSubmission } from '@/hooks/useCaseSubmission';

interface CaseDetailsProps {
  case: Case | any;
  onBack: () => void;
  onStatusUpdate: (caseId: string, newStatus: string) => void;
}

const CaseDetails = ({ case: caseData, onBack, onStatusUpdate }: CaseDetailsProps) => {
  const { user } = useAuth();
  
  const {
    status,
    setStatus,
    isEditing,
    setIsEditing,
    currentCase,
    setCurrentCase,
    showPaymentPage,
    setShowPaymentPage,
    isPublicCase
  } = useCaseState(caseData);

  const {
    caseParts,
    setCaseParts,
    loadCaseParts,
    getTotalCostValue
  } = useCaseParts(currentCase.id, isPublicCase);

  const {
    formData,
    parts,
    setParts,
    handleInputChange,
    handleDiagnosticFeeChange,
    getTotalPartsValue,
    getLaborCost,
    getTotalCost
  } = useEditCaseForm(currentCase);

  const { handleSubmit } = useEditCaseSubmit(currentCase, (updatedCase: Case) => {
    setCurrentCase(updatedCase);
    setIsEditing(false);
    loadCaseParts();
  });

  const { handleStatusChange, handleStatusUpdate, handleSPTComplete } = useCaseDetailsActions({
    currentCase,
    status,
    setStatus,
    setCurrentCase,
    onBack
  });

  const {
    isSubmitting,
    setIsSubmitting,
    onSubmit
  } = useCaseSubmission(
    currentCase,
    isPublicCase,
    onBack,
    loadCaseParts,
    setCurrentCase,
    setIsEditing
  );

  const handleFormSubmit = async () => {
    await onSubmit(
      formData,
      parts,
      handleSubmit,
      getLaborCost,
      getTotalCost
    );
  };

  if (showPaymentPage && !isPublicCase) {
    return (
      <PaymentPage 
        case={currentCase}
        caseParts={caseParts}
        onBack={() => setShowPaymentPage(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <CaseDetailsHeader
        caseId={currentCase.id}
        woNumber={currentCase.wo_number}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={handleFormSubmit}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPublicCase && !isEditing && <PublicCaseBanner />}

        {isEditing ? (
          <CaseDetailsForm
            currentCase={currentCase}
            formData={formData}
            photos={[]} // Empty array since camera is disabled
            parts={parts}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onDiagnosticFeeChange={handleDiagnosticFeeChange}
            onPhotosChange={() => {}} // No-op function since camera is disabled
            onPartsChange={setParts}
            getTotalCost={getTotalCost}
            getLaborCost={getLaborCost}
            getTotalPartsValue={getTotalPartsValue}
            onSubmit={handleFormSubmit}
          />
        ) : (
          <CaseDetailsViewMode
            currentCase={currentCase}
            status={status}
            caseParts={caseParts}
            onStatusUpdate={handleStatusUpdate}
            onSPTComplete={handleSPTComplete}
            onStatusChange={handleStatusChange}
            getTotalCostValue={() => getTotalCostValue(
              currentCase.labor_cost_calculated || 0,
              currentCase.diagnostic_fee_amount || 0
            )}
            setShowPaymentPage={!isPublicCase ? setShowPaymentPage : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
