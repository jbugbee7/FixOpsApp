import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import CameraCapture from './CameraCapture';
import LaborCostSelector from './forms/LaborCostSelector';
import DiagnosticFeeSelector from './forms/DiagnosticFeeSelector';
import PartsManager from './forms/PartsManager';
import CustomerInformationForm from './forms/CustomerInformationForm';
import ApplianceInformationForm from './forms/ApplianceInformationForm';
import ServiceDetailsForm from './forms/ServiceDetailsForm';
import PricingSummary from './forms/PricingSummary';
import PaymentPage from './PaymentPage';
import { Case } from '@/types/case';

interface EditCaseFormProps {
  case: Case;
  onBack: () => void;
  onSave: (updatedCase: Case) => void;
}

interface Part {
  id?: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

const EditCaseForm = ({ case: caseData, onBack, onSave }: EditCaseFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>(caseData.photos || []);
  const [parts, setParts] = useState<Part[]>([]);
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: caseData.customer_name || '',
    customerPhone: caseData.customer_phone || '',
    customerEmail: caseData.customer_email || '',
    customerAddress: caseData.customer_address || '',
    customerAddressLine2: caseData.customer_address_line_2 || '',
    customerCity: caseData.customer_city || '',
    customerState: caseData.customer_state || '',
    customerZipCode: caseData.customer_zip_code || '',
    
    // Appliance Information
    applianceBrand: caseData.appliance_brand || '',
    applianceModel: caseData.appliance_model || '',
    applianceType: caseData.appliance_type || '',
    serialNumber: caseData.serial_number || '',
    warrantyStatus: caseData.warranty_status || '',
    
    // Service Details
    serviceType: caseData.service_type || '',
    problemDescription: caseData.problem_description || '',
    initialDiagnosis: caseData.initial_diagnosis || '',
    partsNeeded: caseData.parts_needed || '',
    estimatedTime: caseData.estimated_time || '',
    technicianNotes: caseData.technician_notes || '',
  });

  // Pricing state
  const [laborLevel, setLaborLevel] = useState(caseData.labor_level || 0);
  const [diagnosticFeeType, setDiagnosticFeeType] = useState(caseData.diagnostic_fee_type || '');
  const [diagnosticFeeAmount, setDiagnosticFeeAmount] = useState(caseData.diagnostic_fee_amount || 0);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateLaborCost = (level: number) => {
    if (level === 0) return 0;
    if (level === 1) return 110;
    return 110 + ((level - 1) * 40);
  };

  const handleDiagnosticFeeChange = (type: string, amount: number) => {
    setDiagnosticFeeType(type);
    setDiagnosticFeeAmount(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          labor_level: laborLevel,
          labor_cost_calculated: calculateLaborCost(laborLevel),
          diagnostic_fee_type: diagnosticFeeType,
          diagnostic_fee_amount: diagnosticFeeAmount,
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
      await handlePartsUpdate();

      const totalCost = calculateLaborCost(laborLevel) + diagnosticFeeAmount + parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);

      toast({
        title: "Work Order Updated Successfully",
        description: `The work order has been updated. Total: $${totalCost.toFixed(2)}`,
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

  const handlePartsUpdate = async () => {
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

  const getTotalCost = () => {
    return calculateLaborCost(laborLevel) + diagnosticFeeAmount + parts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
  };

  const [showPaymentPage, setShowPaymentPage] = useState(false);

  if (showPaymentPage) {
    return (
      <PaymentPage 
        case={caseData}
        caseParts={parts}
        onBack={() => setShowPaymentPage(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Work Order</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Case #{caseData.id}</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowPaymentPage(true)}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={getTotalCost() <= 0}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payment (${getTotalCost().toFixed(2)})
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pricing Section */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="dark:text-slate-100">Pricing & Labor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LaborCostSelector 
                  value={laborLevel} 
                  onChange={setLaborLevel} 
                />
                <DiagnosticFeeSelector 
                  value={diagnosticFeeType} 
                  onChange={handleDiagnosticFeeChange} 
                />
              </div>
              <PricingSummary 
                laborLevel={laborLevel}
                diagnosticFeeAmount={diagnosticFeeAmount}
                parts={parts}
                calculateLaborCost={calculateLaborCost}
              />
            </CardContent>
          </Card>

          {/* Parts Management */}
          <PartsManager 
            parts={parts} 
            onChange={setParts}
            applianceType={formData.applianceType}
            applianceBrand={formData.applianceBrand}
          />

          {/* Customer Information */}
          <CustomerInformationForm 
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Appliance Information */}
          <ApplianceInformationForm 
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Service Details */}
          <ServiceDetailsForm 
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Camera/Photos Section */}
          <CameraCapture photos={photos} onPhotosChange={setPhotos} />

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating Work Order...' : 'Update Work Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCaseForm;
