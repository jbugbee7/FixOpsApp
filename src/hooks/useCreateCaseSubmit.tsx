
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/hooks/useCompany";

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

export const useCreateCaseSubmit = () => {
  const { company } = useCompany();

  const saveApplianceModel = async (user: any, formData: FormData) => {
    if (!user || !formData.applianceBrand || !formData.applianceModel || !formData.applianceType) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appliance_models')
        .upsert({
          brand: formData.applianceBrand,
          model: formData.applianceModel,
          appliance_type: formData.applianceType,
          serial_number: formData.serialNumber || null,
          user_id: user.id,
          company_id: company?.id || null
        }, {
          onConflict: 'brand,model,serial_number'
        });

      if (error) {
        console.error('Error saving appliance model:', error);
      }
    } catch (error) {
      console.error('Error saving appliance model:', error);
    }
  };

  const savePartsData = async (user: any, parts: any[], formData: FormData) => {
    if (!user || parts.length === 0) {
      return;
    }

    try {
      for (const part of parts) {
        await supabase
          .from('parts')
          .upsert({
            part_name: part.part_name,
            part_number: part.part_number,
            part_cost: part.part_cost,
            markup_percentage: part.markup_percentage,
            final_price: part.final_price,
            appliance_brand: formData.applianceBrand || null,
            appliance_model: formData.applianceModel || null,
            appliance_type: formData.applianceType || null,
            user_id: user.id,
            company_id: company?.id || null
          }, {
            onConflict: 'part_number,appliance_brand,appliance_model'
          });
      }
    } catch (error) {
      console.error('Error saving parts data:', error);
    }
  };

  const handleSubmit = async (
    user: any,
    formData: FormData,
    photos: string[],
    parts: any[],
    customerName: string,
    getLaborCost: () => number,
    getTotalPartsValue: () => number,
    getTotalCost: () => number,
    resetForm: () => void,
    setIsSubmitting: (loading: boolean) => void
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create work orders.",
        variant: "destructive"
      });
      return;
    }

    if (!company?.id) {
      toast({
        title: "Company Setup Required",
        description: "Please complete company setup before creating work orders.",
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
      console.log('Creating work order with company_id:', company.id);
      
      await Promise.all([
        saveApplianceModel(user, formData),
        savePartsData(user, parts, formData)
      ]);

      const { error } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          company_id: company.id,
          customer_name: customerName,
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
          status: 'Scheduled',
          labor_level: formData.laborLevel,
          labor_cost_calculated: getLaborCost(),
          diagnostic_fee_type: formData.diagnosticFeeType || null,
          diagnostic_fee_amount: formData.diagnosticFeeAmount,
          parts_cost: getTotalPartsValue().toString(),
        });

      if (error) {
        console.error('Error creating work order:', error);
        toast({
          title: "Error Creating Work Order",
          description: error.message || "There was an error creating the work order. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Work Order Created Successfully",
        description: `The work order has been logged and assigned. Total: $${getTotalCost().toFixed(2)}`,
      });

      resetForm();
    } catch (error) {
      console.error('Error creating work order:', error);
      toast({
        title: "Error Creating Work Order",
        description: "There was an error creating the work order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};
