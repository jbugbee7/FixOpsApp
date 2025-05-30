
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, ChevronUp, Save, RotateCcw } from 'lucide-react';
import CustomerSection from './modern/CustomerSection';
import ApplianceSection from './modern/ApplianceSection';
import ServiceSection from './modern/ServiceSection';
import PricingSection from './modern/PricingSection';
import PhotosSection from './modern/PhotosSection';
import NotesSection from './modern/NotesSection';

const ModernCaseForm = () => {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    customer: true,
    appliance: true,
    service: true,
    pricing: false,
    photos: false,
    notes: false
  });

  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    customerAddressLine2: '',
    customerCity: '',
    customerState: '',
    customerZipCode: '',
    
    // Appliance Information
    applianceBrand: '',
    applianceModel: '',
    applianceType: '',
    serialNumber: '',
    warrantyStatus: '',
    
    // Service Details
    serviceType: '',
    problemDescription: '',
    initialDiagnosis: '',
    partsNeeded: '',
    estimatedTime: '',
    
    // Additional Notes
    technicianNotes: '',

    // Pricing fields
    laborLevel: 0,
    diagnosticFeeType: '',
    diagnosticFeeAmount: 0,
  });

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

  const saveApplianceModel = async () => {
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
          user_id: user.id
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

  const savePartsData = async () => {
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
            user_id: user.id
          }, {
            onConflict: 'part_number,appliance_brand,appliance_model'
          });
      }
    } catch (error) {
      console.error('Error saving parts data:', error);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create work orders.",
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
      await Promise.all([
        saveApplianceModel(),
        savePartsData()
      ]);

      const customerName = formData.customerName || userProfile?.full_name || user?.email?.split('@')[0] || 'Customer';

      const { error } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
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
          description: "There was an error creating the work order. Please try again.",
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

  const getSectionIcon = (section: keyof typeof expandedSections) => {
    return expandedSections[section] ? ChevronUp : ChevronDown;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Create Work Order</h1>
        <p className="text-slate-600 dark:text-slate-400">Fill out the form below to create a new work order</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Action Buttons */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Form
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Creating Work Order...' : 'Create Work Order'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ModernCaseForm;
