
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Case } from '@/types/case';

interface Part {
  id?: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerAddressLine2: string;
  customerCity: string;
  customerState: string;
  customerZipCode: string;
  applianceBrand: string;
  applianceModel: string;
  applianceType: string;
  serialNumber: string;
  warrantyStatus: string;
  serviceType: string;
  problemDescription: string;
  initialDiagnosis: string;
  partsNeeded: string;
  estimatedTime: string;
  technicianNotes: string;
  laborLevel: number;
  diagnosticFeeType: string;
  diagnosticFeeAmount: number;
}

export const useEditCaseSubmit = (
  caseData: Case,
  onSave: (updatedCase: Case) => void
) => {
  const { user } = useAuth();

  const handlePartsUpdate = async (parts: Part[]) => {
    if (!user || !caseData.id) return;

    try {
      // Delete existing parts for this case
      await supabase
        .from('case_parts')
        .delete()
        .eq('case_id', caseData.id);

      // Insert new parts
      if (parts.length > 0) {
        const partsToInsert = parts.map(part => ({
          case_id: caseData.id,
          part_name: part.part_name,
          part_number: part.part_number,
          part_cost: part.part_cost,
          quantity: part.quantity,
          markup_percentage: part.markup_percentage,
          final_price: part.final_price
        }));

        const { error } = await supabase
          .from('case_parts')
          .insert(partsToInsert);

        if (error) {
          console.error('Error updating parts:', error);
          toast({
            title: "Error Updating Parts",
            description: "There was an error updating the parts.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error updating parts:', error);
    }
  };

  const handleSubmit = async (
    formData: FormData,
    parts: Part[],
    photos: string[],
    getLaborCost: () => number,
    getTotalCost: () => number,
    setIsSubmitting: (loading: boolean) => void
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update work orders.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.applianceBrand || !formData.applianceType || !formData.problemDescription) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in appliance brand, type, and problem description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate parts cost
      const totalPartsCost = parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);

      // Update the case
      const { data, error } = await supabase
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
          photos: photos.length > 0 ? photos : null,
          labor_level: formData.laborLevel,
          labor_cost_calculated: getLaborCost(),
          diagnostic_fee_type: formData.diagnosticFeeType,
          diagnostic_fee_amount: formData.diagnosticFeeAmount,
          parts_cost: totalPartsCost.toString(),
        })
        .eq('id', caseData.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating work order:', error);
        toast({
          title: "Error Updating Work Order",
          description: "There was an error updating the work order. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Update parts in the database
      await handlePartsUpdate(parts);

      toast({
        title: "Work Order Updated Successfully",
        description: `The work order has been updated. Total: $${getTotalCost().toFixed(2)}`,
      });

      onSave(data);
    } catch (error) {
      console.error('Error updating work order:', error);
      toast({
        title: "Error Updating Work Order",
        description: "There was an error updating the work order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};
