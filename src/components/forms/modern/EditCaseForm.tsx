
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CreditCard, ChevronDown, ChevronUp, Save } from 'lucide-react';
import CustomerSection from './CustomerSection';
import ApplianceSection from './ApplianceSection';
import ServiceSection from './ServiceSection';
import PricingSection from './PricingSection';
import PhotosSection from './PhotosSection';
import NotesSection from './NotesSection';
import StatusUpdateSection from './StatusUpdateSection';
import PaymentPage from '../../PaymentPage';
import { Case } from '@/types/case';
import { useEditCaseForm } from '@/hooks/useEditCaseForm';
import { useEditCaseSubmit } from '@/hooks/useEditCaseSubmit';

interface EditCaseFormProps {
  case: Case;
  onBack: () => void;
  onSave: (updatedCase: Case) => void;
}

const EditCaseForm = ({ case: caseData, onBack, onSave }: EditCaseFormProps) => {
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

  const {
    formData,
    photos,
    parts,
    isSubmitting,
    setPhotos,
    setParts,
    setIsSubmitting,
    handleInputChange,
    handleDiagnosticFeeChange,
    getTotalPartsValue,
    getLaborCost,
    getTotalCost
  } = useEditCaseForm(caseData);

  const { handleSubmit } = useEditCaseSubmit(caseData, onSave);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSectionIcon = (section: keyof typeof expandedSections) => {
    return expandedSections[section] ? ChevronUp : ChevronDown;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(
      formData,
      parts,
      photos,
      getLaborCost,
      getTotalCost,
      setIsSubmitting
    );
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
        <form onSubmit={onSubmit} className="space-y-4">
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
