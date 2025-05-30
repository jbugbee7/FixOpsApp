
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import CaseDetailsHeader from './case/CaseDetailsHeader';
import CaseDetailsViewMode from './case/CaseDetailsViewMode';
import CaseDetailsForm from './case/CaseDetailsForm';
import PaymentPage from './PaymentPage';
import { Case } from '@/types/case';
import { useEditCaseForm } from '@/hooks/useEditCaseForm';
import { useEditCaseSubmit } from '@/hooks/useEditCaseSubmit';
import { useCaseDetailsActions } from './case/CaseDetailsActions';

interface CaseDetailsProps {
  case: Case;
  onBack: () => void;
  onStatusUpdate: (caseId: string, newStatus: string) => void;
}

interface CasePart {
  id: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

const CaseDetails = ({ case: caseData, onBack, onStatusUpdate }: CaseDetailsProps) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(caseData.status);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCase, setCurrentCase] = useState(caseData);
  const [caseParts, setCaseParts] = useState<CasePart[]>([]);
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  const {
    formData,
    photos,
    parts,
    isSubmitting,
    setPhotos,
    setParts,
    setIsSubmitting,
    handleInputChange,
    handleDiagnosticFeeChange,
    getTotalPartsValue,
    getLaborCost,
    getTotalCost
  } = useEditCaseForm(currentCase);

  const { handleSubmit } = useEditCaseSubmit(currentCase, (updatedCase: Case) => {
    setCurrentCase(updatedCase);
    setIsEditing(false);
  });

  const { handleStatusChange, handleStatusUpdate, handleSPTComplete } = useCaseDetailsActions({
    currentCase,
    status,
    setStatus,
    setCurrentCase,
    onBack
  });

  // Load case parts
  useEffect(() => {
    const loadCaseParts = async () => {
      if (!user || !currentCase.id) return;

      try {
        const { data, error } = await supabase
          .from('case_parts')
          .select('*')
          .eq('case_id', currentCase.id);

        if (error) {
          console.error('Error loading case parts:', error);
          return;
        }

        setCaseParts(data || []);
      } catch (error) {
        console.error('Error loading case parts:', error);
      }
    };

    loadCaseParts();
  }, [user, currentCase.id]);

  const getTotalCostValue = () => {
    const laborCost = currentCase.labor_cost_calculated || 0;
    const diagnosticFee = currentCase.diagnostic_fee_amount || 0;
    const partsCost = caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
    return laborCost + diagnosticFee + partsCost;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(
      formData,
      parts,
      photos,
      getLaborCost,
      getTotalCost,
      setIsSubmitting
    );
  };

  if (showPaymentPage) {
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
      {/* Header */}
      <CaseDetailsHeader
        caseId={currentCase.id}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={onSubmit}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <CaseDetailsForm
            currentCase={currentCase}
            formData={formData}
            photos={photos}
            parts={parts}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onDiagnosticFeeChange={handleDiagnosticFeeChange}
            onPhotosChange={setPhotos}
            onPartsChange={setParts}
            getTotalCost={getTotalCost}
            getLaborCost={getLaborCost}
            getTotalPartsValue={getTotalPartsValue}
            onSubmit={onSubmit}
          />
        ) : (
          <CaseDetailsViewMode
            currentCase={currentCase}
            status={status}
            caseParts={caseParts}
            onStatusUpdate={handleStatusUpdate}
            onSPTComplete={handleSPTComplete}
            onStatusChange={handleStatusChange}
            getTotalCostValue={getTotalCostValue}
            setShowPaymentPage={setShowPaymentPage}
          />
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
