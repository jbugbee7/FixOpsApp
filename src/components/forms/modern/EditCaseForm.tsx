
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import CustomerSection from './CustomerSection';
import ApplianceSection from './ApplianceSection';
import ServiceSection from './ServiceSection';
import PricingSection from './PricingSection';
import PhotosSection from './PhotosSection';
import NotesSection from './NotesSection';
import StatusUpdateSection from './StatusUpdateSection';
import PaymentPage from '../../PaymentPage';
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
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    status: false,
    customer: false,
    appliance: false,
    service: false,
    pricing: false,
    photos: false,
    notes: false
  });

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

    // Pricing fields
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
      await handlePartsUpdate();

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

  const getSectionIcon = (section: keyof typeof expandedSections) => {
    return expandedSections[section] ? ChevronUp : ChevronDown;
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Update Section */}
          <StatusUpdateSection
            currentCase={caseData}
            expanded={expandedSections.status}
            onToggle={() => toggleSection('status')}
            icon={getSectionIcon('status')}
          />

          {/* Customer Information */}
          <CustomerSection
            formData={formData}
            onInputChange={handleInputChange}
            expanded={expandedSections.customer}
            onToggle={() => toggleSection('customer')}
            icon={getSectionIcon('customer')}
          />

          {/* Appliance Information */}
          <ApplianceSection
            formData={formData}
            onInputChange={handleInputChange}
            expanded={expandedSections.appliance}
            onToggle={() => toggleSection('appliance')}
            icon={getSectionIcon('appliance')}
          />

          {/* Service Details */}
          <ServiceSection
            formData={formData}
            onInputChange={handleInputChange}
            expanded={expandedSections.service}
            onToggle={() => toggleSection('service')}
            icon={getSectionIcon('service')}
          />

          {/* Pricing Section */}
          <PricingSection
            formData={formData}
            parts={parts}
            onInputChange={handleInputChange}
            onDiagnosticFeeChange={handleDiagnosticFeeChange}
            onPartsChange={setParts}
            getTotalCost={getTotalCost}
            getLaborCost={getLaborCost}
            getTotalPartsValue={getTotalPartsValue}
            expanded={expandedSections.pricing}
            onToggle={() => toggleSection('pricing')}
            icon={getSectionIcon('pricing')}
          />

          {/* Photos Section */}
          <PhotosSection
            photos={photos}
            onPhotosChange={setPhotos}
            expanded={expandedSections.photos}
            onToggle={() => toggleSection('photos')}
            icon={getSectionIcon('photos')}
          />

          {/* Notes Section */}
          <NotesSection
            formData={formData}
            onInputChange={handleInputChange}
            expanded={expandedSections.notes}
            onToggle={() => toggleSection('notes')}
            icon={getSectionIcon('notes')}
          />

          {/* Submit Buttons */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Updating Work Order...' : 'Update Work Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default EditCaseForm;
