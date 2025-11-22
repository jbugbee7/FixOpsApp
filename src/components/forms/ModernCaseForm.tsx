
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Save, RotateCcw, ArrowLeft } from 'lucide-react';
import CustomerSection from './modern/CustomerSection';
import ApplianceSection from './modern/ApplianceSection';
import ServiceSection from './modern/ServiceSection';
import PricingSection from './modern/PricingSection';
import PhotosSection from './modern/PhotosSection';
import NotesSection from './modern/NotesSection';
import { useCreateCaseForm } from '@/hooks/useCreateCaseForm';
import { useCreateCaseSubmit } from '@/hooks/useCreateCaseSubmit';

const ModernCaseForm = ({ fromDashboard = false, onNavigate }: { fromDashboard?: boolean; onNavigate?: (tab: string) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromDashboard = fromDashboard || location.state?.fromQuickAction;
  
  const [expandedSections, setExpandedSections] = useState({
    customer: false,
    appliance: false,
    service: false,
    pricing: false,
    photos: false,
    notes: false
  });

  const {
    formData,
    parts,
    isSubmitting,
    user,
    setParts,
    setIsSubmitting,
    handleInputChange,
    handleDiagnosticFeeChange,
    resetForm,
    getTotalPartsValue,
    getLaborCost,
    getTotalCost,
    getCustomerName
  } = useCreateCaseForm();

  const { handleSubmit: submitCase } = useCreateCaseSubmit();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSectionIcon = (section: keyof typeof expandedSections) => {
    return expandedSections[section] ? ChevronUp : ChevronDown;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await submitCase(
      user,
      formData,
      [], // Empty photos array since camera functionality is disabled
      parts,
      getCustomerName(),
      getLaborCost,
      getTotalPartsValue,
      getTotalCost,
      resetForm,
      setIsSubmitting
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Create Work Order</h1>
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
          photos={[]} // Empty array since camera is disabled
          onPhotosChange={() => {}} // No-op function since camera is disabled
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
