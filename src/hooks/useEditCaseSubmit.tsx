
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Case } from '@/types/case';

interface Part {
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

export const useEditCaseSubmit = (
  currentCase: Case,
  onSuccess: (updatedCase: Case) => void
) => {
  const handleSubmit = async (
    formData: any,
    parts: Part[],
    photos: string[],
    getLaborCost: () => number,
    getTotalCost: () => number,
    setIsSubmitting: (submitting: boolean) => void
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting case update:', formData);
      console.log('Parts to save:', parts);

      // Update the case
      const { data: updatedCase, error: caseError } = await supabase
        .from('cases')
        .update({
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail,
          customer_address: formData.customerAddress,
          customer_address_line_2: formData.customerAddressLine2,
          customer_city: formData.customerCity,
          customer_state: formData.customerState,
          customer_zip_code: formData.customerZipCode,
          appliance_brand: formData.applianceBrand,
          appliance_model: formData.applianceModel,
          appliance_type: formData.applianceType,
          serial_number: formData.serialNumber,
          warranty_status: formData.warrantyStatus,
          service_type: formData.serviceType,
          problem_description: formData.problemDescription,
          initial_diagnosis: formData.initialDiagnosis,
          parts_needed: formData.partsNeeded,
          estimated_time: formData.estimatedTime,
          technician_notes: formData.technicianNotes,
          labor_level: formData.laborLevel,
          labor_cost_calculated: getLaborCost(),
          diagnostic_fee_type: formData.diagnosticFeeType,
          diagnostic_fee_amount: formData.diagnosticFeeAmount,
          photos: photos,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCase.id)
        .select()
        .single();

      if (caseError) {
        console.error('Error updating case:', caseError);
        throw caseError;
      }

      console.log('Case updated successfully:', updatedCase);

      // Delete existing case parts for this case
      const { error: deleteError } = await supabase
        .from('case_parts')
        .delete()
        .eq('case_id', currentCase.id);

      if (deleteError) {
        console.error('Error deleting existing case parts:', deleteError);
        throw deleteError;
      }

      // Insert new case parts if any
      if (parts.length > 0) {
        const casePartsToInsert = parts.map(part => ({
          case_id: currentCase.id,
          part_name: part.part_name,
          part_number: part.part_number,
          part_cost: part.part_cost,
          quantity: part.quantity,
          markup_percentage: part.markup_percentage,
          final_price: part.final_price
        }));

        console.log('Inserting case parts:', casePartsToInsert);

        const { error: partsError } = await supabase
          .from('case_parts')
          .insert(casePartsToInsert);

        if (partsError) {
          console.error('Error inserting case parts:', partsError);
          throw partsError;
        }

        console.log('Case parts inserted successfully');
      }

      toast({
        title: "Case Updated",
        description: "Case has been updated successfully with all parts.",
      });

      onSuccess(updatedCase);
    } catch (error) {
      console.error('Error updating case:', error);
      toast({
        title: "Error",
        description: "Failed to update case. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};
