import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Globe } from 'lucide-react';
import CaseDetailsHeader from './case/CaseDetailsHeader';
import CaseDetailsViewMode from './case/CaseDetailsViewMode';
import CaseDetailsForm from './case/CaseDetailsForm';
import PaymentPage from './PaymentPage';
import { Case } from '@/types/case';
import { useEditCaseForm } from '@/hooks/useEditCaseForm';
import { useEditCaseSubmit } from '@/hooks/useEditCaseSubmit';
import { useCaseDetailsActions } from './case/CaseDetailsActions';
import { updatePublicCase } from '@/services/publicCasesService';

interface CaseDetailsProps {
  case: Case | any;
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

  const isPublicCase = !currentCase.user_id;

  const {
    formData,
    parts,
    isSubmitting,
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
    // Reload case parts after successful update
    loadCaseParts();
  });

  const { handleStatusChange, handleStatusUpdate, handleSPTComplete } = useCaseDetailsActions({
    currentCase,
    status,
    setStatus,
    setCurrentCase,
    onBack
  });

  // Load case parts from database (only for owned cases)
  const loadCaseParts = async () => {
    if (!user || !currentCase.id || isPublicCase) return;

    try {
      console.log('Loading case parts for case:', currentCase.id);
      const { data, error } = await supabase
        .from('case_parts')
        .select('*')
        .eq('case_id', currentCase.id);

      if (error) {
        console.error('Error loading case parts:', error);
        return;
      }

      console.log('Loaded case parts:', data);
      setCaseParts(data || []);
      
      // Also set the parts in the form data for editing
      const formParts = (data || []).map(part => ({
        part_name: part.part_name,
        part_number: part.part_number,
        part_cost: part.part_cost,
        quantity: part.quantity,
        markup_percentage: part.markup_percentage,
        final_price: part.final_price
      }));
      setParts(formParts);
    } catch (error) {
      console.error('Error loading case parts:', error);
    }
  };

  useEffect(() => {
    loadCaseParts();
  }, [user, currentCase.id]);

  const getTotalCostValue = () => {
    const laborCost = currentCase.labor_cost_calculated || 0;
    const diagnosticFee = currentCase.diagnostic_fee_amount || 0;
    const partsCost = caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
    return laborCost + diagnosticFee + partsCost;
  };

  const onSubmit = async () => {
    if (isPublicCase) {
      // For public cases, update the public_cases table which will trigger the move
      try {
        setIsSubmitting(true);
        const result = await updatePublicCase(currentCase.id, {
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone || undefined,
          customer_address: formData.customerAddress || undefined,
          appliance_brand: formData.applianceBrand,
          appliance_type: formData.applianceType,
          problem_description: formData.problemDescription,
          diagnostic_fee_type: formData.diagnosticFeeType || undefined,
          diagnostic_fee_amount: formData.diagnosticFeeAmount || undefined,
          status: currentCase.status, // Use currentCase.status instead of formData.status
          updated_at: new Date().toISOString()
        });

        if (!result.success) {
          throw result.error;
        }

        toast({
          title: "Work Order Claimed",
          description: "You've successfully claimed this work order!",
        });
        
        // Go back to list since the case is now moved to the user's cases
        onBack();
      } catch (error) {
        console.error('Error claiming public case:', error);
        toast({
          title: "Error Claiming Work Order",
          description: "Failed to claim the work order. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Regular case update - pass empty photos array since camera is disabled
      await handleSubmit(
        formData,
        parts,
        [], // Empty photos array since camera functionality is disabled
        getLaborCost,
        getTotalCost,
        setIsSubmitting
      );
    }
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
      {/* Header */}
      <CaseDetailsHeader
        caseId={currentCase.id}
        woNumber={currentCase.wo_number}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onBack={onBack}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={onSubmit}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPublicCase && !isEditing && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Globe className="h-5 w-5" />
              <span className="font-medium">Public Work Order</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              This is a public work order. Click "Edit" to claim ownership and move it to your cases.
            </p>
          </div>
        )}

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
            setShowPaymentPage={!isPublicCase ? setShowPaymentPage : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
