
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

export const useCreateCaseForm = () => {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [parts, setParts] = useState<any[]>([]);

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    customerAddressLine2: '',
    customerCity: '',
    customerState: '',
    customerZipCode: '',
    applianceBrand: '',
    applianceModel: '',
    applianceType: '',
    serialNumber: '',
    warrantyStatus: '',
    serviceType: '',
    problemDescription: '',
    initialDiagnosis: '',
    partsNeeded: '',
    estimatedTime: '',
    technicianNotes: '',
    laborLevel: 0,
    diagnosticFeeType: '',
    diagnosticFeeAmount: 0,
  });

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

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      customerAddressLine2: '',
      customerCity: '',
      customerState: '',
      customerZipCode: '',
      applianceBrand: '',
      applianceModel: '',
      applianceType: '',
      serialNumber: '',
      warrantyStatus: '',
      serviceType: '',
      problemDescription: '',
      initialDiagnosis: '',
      partsNeeded: '',
      estimatedTime: '',
      technicianNotes: '',
      laborLevel: 0,
      diagnosticFeeType: '',
      diagnosticFeeAmount: 0,
    });
    setPhotos([]);
    setParts([]);
  };

  const getTotalPartsValue = () => {
    return parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
  };

  const getLaborCost = () => {
    if (formData.laborLevel === 0) return 0;
    if (formData.laborLevel === 1) return 110;
    return 110 + ((formData.laborLevel - 1) * 40);
  };

  const getTotalCost = () => {
    return getLaborCost() + formData.diagnosticFeeAmount + getTotalPartsValue();
  };

  const getCustomerName = () => {
    return formData.customerName || userProfile?.full_name || user?.email?.split('@')[0] || 'Customer';
  };

  return {
    formData,
    photos,
    parts,
    isSubmitting,
    user,
    setPhotos,
    setParts,
    setIsSubmitting,
    handleInputChange,
    handleDiagnosticFeeChange,
    resetForm,
    getTotalPartsValue,
    getLaborCost,
    getTotalCost,
    getCustomerName
  };
};
