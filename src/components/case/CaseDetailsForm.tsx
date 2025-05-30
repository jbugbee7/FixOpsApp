
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CustomerSection from '../forms/modern/CustomerSection';
import ApplianceSection from '../forms/modern/ApplianceSection';
import ServiceSection from '../forms/modern/ServiceSection';
import PricingSection from '../forms/modern/PricingSection';
import PhotosSection from '../forms/modern/PhotosSection';
import NotesSection from '../forms/modern/NotesSection';
import StatusUpdateSection from '../forms/modern/StatusUpdateSection';
import { Case } from '@/types/case';

interface CaseDetailsFormProps {
  currentCase: Case;
  formData: any;
  photos: string[];
  parts: any[];
  isSubmitting: boolean;
  onInputChange: (field: string, value: string | number) => void;
  onDiagnosticFeeChange: (type: string, amount: number) => void;
  onPhotosChange: (photos: string[]) => void;
  onPartsChange: (parts: any[]) => void;
  getTotalCost: () => number;
  getLaborCost: () => number;
  getTotalPartsValue: () => number;
  onSubmit: (e: React.FormEvent) => void;
}

const CaseDetailsForm = ({
  currentCase,
  formData,
  photos,
  parts,
  isSubmitting,
  onInputChange,
  onDiagnosticFeeChange,
  onPhotosChange,
  onPartsChange,
  getTotalCost,
  getLaborCost,
  getTotalPartsValue,
  onSubmit
}: CaseDetailsFormProps) => {
  const [expandedSections, setExpandedSections] = useState({
    status: false,
    customer: false,
    appliance: false,
    service: false,
    pricing: false,
    photos: false,
    notes: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSectionIcon = (section: keyof typeof expandedSections) => {
    return expandedSections[section] ? ChevronUp : ChevronDown;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Status Update Section */}
      <StatusUpdateSection
        currentCase={currentCase}
        expanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
        icon={getSectionIcon('status')}
      />

      {/* Customer Information */}
      <CustomerSection
        formData={formData}
        onInputChange={onInputChange}
        expanded={expandedSections.customer}
        onToggle={() => toggleSection('customer')}
        icon={getSectionIcon('customer')}
      />

      {/* Appliance Information */}
      <ApplianceSection
        formData={formData}
        onInputChange={onInputChange}
        expanded={expandedSections.appliance}
        onToggle={() => toggleSection('appliance')}
        icon={getSectionIcon('appliance')}
      />

      {/* Service Details */}
      <ServiceSection
        formData={formData}
        onInputChange={onInputChange}
        expanded={expandedSections.service}
        onToggle={() => toggleSection('service')}
        icon={getSectionIcon('service')}
      />

      {/* Photos Section */}
      <PhotosSection
        photos={photos}
        onPhotosChange={onPhotosChange}
        expanded={expandedSections.photos}
        onToggle={() => toggleSection('photos')}
        icon={getSectionIcon('photos')}
      />

      {/* Notes Section */}
      <NotesSection
        formData={formData}
        onInputChange={onInputChange}
        expanded={expandedSections.notes}
        onToggle={() => toggleSection('notes')}
        icon={getSectionIcon('notes')}
      />

      {/* Pricing Section - Always at the bottom */}
      <PricingSection
        formData={formData}
        parts={parts}
        onInputChange={onInputChange}
        onDiagnosticFeeChange={onDiagnosticFeeChange}
        onPartsChange={onPartsChange}
        getTotalCost={getTotalCost}
        getLaborCost={getLaborCost}
        getTotalPartsValue={getTotalPartsValue}
        expanded={expandedSections.pricing}
        onToggle={() => toggleSection('pricing')}
        icon={getSectionIcon('pricing')}
      />
    </form>
  );
};

export default CaseDetailsForm;
