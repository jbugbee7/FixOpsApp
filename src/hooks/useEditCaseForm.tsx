
import { useState, useEffect } from 'react';
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

export const useEditCaseForm = (caseData: Case) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);

  const [formData, setFormData] = useState<FormData>({
    customerName: caseData.customer_name || '',
    customerPhone: caseData.customer_phone || '',
    customerEmail: caseData.customer_email || '',
    customerAddress: caseData.customer_address || '',
    customerAddressLine2: caseData.customer_address_line_2 || '',
    customerCity: caseData.customer_city || '',
    customerState: caseData.customer_state || '',
    customerZipCode: caseData.customer_zip_code || '',
    applianceBrand: caseData.appliance_brand || '',
    applianceModel: caseData.appliance_model || '',
    applianceType: caseData.appliance_type || '',
    serialNumber: caseData.serial_number || '',
    warrantyStatus: caseData.warranty_status || '',
    serviceType: caseData.service_type || '',
    problemDescription: caseData.problem_description || '',
    initialDiagnosis: caseData.initial_diagnosis || '',
    partsNeeded: caseData.parts_needed || '',
    estimatedTime: caseData.estimated_time || '',
    technicianNotes: caseData.technician_notes || '',
    laborLevel: caseData.labor_level || 0,
    diagnosticFeeType: caseData.diagnostic_fee_type || '',
    diagnosticFeeAmount: caseData.diagnostic_fee_amount || 0,
  });

  // Load parts for this case
  useEffect(() => {
    const loadCaseParts = async () => {
      if (!user || !caseData.id) return;

      try {
        const { data, error } = await supabase
          .from('case_parts')
          .select('*')
          .eq('case_id', caseData.id);

        if (error) {
          console.error('Error loading parts:', error);
          return;
        }

        setParts(data || []);
      } catch (error) {
        console.error('Error loading parts:', error);
      }
    };

    loadCaseParts();
  }, [user, caseData.id]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiagnosticFeeChange = (type: string, amount: number) => {
    setFormData(prev => ({
      ...prev,
      diagnosticFeeType: type,
      diagnosticFeeAmount: amount
    }));
  };

  const calculateLaborCost = (level: number) => {
    if (level === 0) return 0;
    if (level === 1) return 110;
    return 110 + ((level - 1) * 40);
  };

  const getTotalPartsValue = () => {
    return parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
  };

  const getLaborCost = () => {
    return calculateLaborCost(formData.laborLevel);
  };

  const getTotalCost = () => {
    return getLaborCost() + formData.diagnosticFeeAmount + getTotalPartsValue();
  };

  return {
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
  };
};
