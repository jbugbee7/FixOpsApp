
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { updatePublicCase } from '@/services/publicCasesService';
import { Case } from '@/types/case';

export const useCaseSubmission = (
  currentCase: Case,
  isPublicCase: boolean,
  onBack: () => void,
  loadCaseParts: () => void,
  setCurrentCase: (case: Case) => void,
  setIsEditing: (editing: boolean) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublicCaseSubmission = async (formData: any) => {
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
        status: currentCase.status,
        updated_at: new Date().toISOString()
      });

      if (!result.success) {
        throw result.error;
      }

      toast({
        title: "Work Order Claimed",
        description: "You've successfully claimed this work order!",
      });
      
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
  };

  const handleRegularCaseSubmission = async (
    handleSubmit: any,
    formData: any,
    parts: any[],
    getLaborCost: () => number,
    getTotalCost: () => number
  ) => {
    await handleSubmit(
      formData,
      parts,
      [], // Empty photos array since camera functionality is disabled
      getLaborCost,
      getTotalCost,
      setIsSubmitting
    );
  };

  const onSubmit = async (
    formData: any,
    parts: any[],
    handleSubmit: any,
    getLaborCost: () => number,
    getTotalCost: () => number
  ) => {
    if (isPublicCase) {
      await handlePublicCaseSubmission(formData);
    } else {
      await handleRegularCaseSubmission(handleSubmit, formData, parts, getLaborCost, getTotalCost);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    onSubmit
  };
};
