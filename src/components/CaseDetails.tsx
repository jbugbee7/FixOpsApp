
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Save, X, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import StatusUpdateFlow from './forms/StatusUpdateFlow';
import CustomerInformationDisplay from './case/CustomerInformationDisplay';
import ApplianceInformationDisplay from './case/ApplianceInformationDisplay';
import ServiceDetailsDisplay from './case/ServiceDetailsDisplay';
import CustomerSection from './forms/modern/CustomerSection';
import ApplianceSection from './forms/modern/ApplianceSection';
import ServiceSection from './forms/modern/ServiceSection';
import PricingSection from './forms/modern/PricingSection';
import PhotosSection from './forms/modern/PhotosSection';
import NotesSection from './forms/modern/NotesSection';
import StatusUpdateSection from './forms/modern/StatusUpdateSection';
import PaymentPage from './PaymentPage';
import { Case } from '@/types/case';
import { useEditCaseForm } from '@/hooks/useEditCaseForm';
import { useEditCaseSubmit } from '@/hooks/useEditCaseSubmit';

interface CaseDetailsProps {
  case: Case;
  onBack: () => void;
  onStatusUpdate: (caseId: string, newStatus: string) => void;
}

interface CasePart {
  id: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

const CaseDetails = ({ case: caseData, onBack, onStatusUpdate }: CaseDetailsProps) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(caseData.status);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCase, setCurrentCase] = useState(caseData);
  const [caseParts, setCaseParts] = useState<CasePart[]>([]);
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
  } = useEditCaseForm(currentCase);

  const { handleSubmit } = useEditCaseSubmit(currentCase, (updatedCase: Case) => {
    setCurrentCase(updatedCase);
    setIsEditing(false);
  });

  // Load case parts
  useEffect(() => {
    const loadCaseParts = async () => {
      if (!user || !currentCase.id) return;

      try {
        const { data, error } = await supabase
          .from('case_parts')
          .select('*')
          .eq('case_id', currentCase.id);

        if (error) {
          console.error('Error loading case parts:', error);
          return;
        }

        setCaseParts(data || []);
      } catch (error) {
        console.error('Error loading case parts:', error);
      }
    };

    loadCaseParts();
  }, [user, currentCase.id]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onStatusUpdate(caseData.id, newStatus);
  };

  const handleStatusUpdate = async (newStatus: string, cancellationReason?: string) => {
    if (!user) return;

    try {
      const updateData: any = { status: newStatus };
      
      if (cancellationReason) {
        updateData.cancellation_reason = cancellationReason;
      }

      const { error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', currentCase.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setStatus(newStatus);
      setCurrentCase(prev => ({ ...prev, status: newStatus, cancellation_reason: cancellationReason }));
      
      if (newStatus === 'cancel' && cancellationReason) {
        toast({
          title: "Work Order Cancelled",
          description: "The work order has been cancelled and removed.",
        });
        onBack();
      } else {
        toast({
          title: "Status Updated",
          description: `Work order status updated to ${newStatus}.`,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update work order status.",
        variant: "destructive"
      });
    }
  };

  const handleSPTComplete = async (sptStatus: string) => {
    if (!user) return;

    try {
      const updateData: any = { spt_status: sptStatus };
      
      if (sptStatus === 'complete') {
        updateData.status = 'Completed';
      }

      const { error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', currentCase.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCurrentCase(prev => ({ 
        ...prev, 
        spt_status: sptStatus,
        status: sptStatus === 'complete' ? 'Completed' : prev.status
      }));
      
      if (sptStatus === 'complete') {
        setStatus('Completed');
      }

      toast({
        title: "Job Status Updated",
        description: sptStatus === 'complete' ? "Work order marked as complete." : "SPT scheduled.",
      });
    } catch (error) {
      console.error('Error updating SPT status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive"
      });
    }
  };

  const getTotalCostValue = () => {
    const laborCost = currentCase.labor_cost_calculated || 0;
    const diagnosticFee = currentCase.diagnostic_fee_amount || 0;
    const partsCost = caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
    return laborCost + diagnosticFee + partsCost;
  };

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
        case={currentCase}
        caseParts={caseParts}
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
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Work Order</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Case #{currentCase.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2"
                  variant="outline"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={onSubmit}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Updating...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Status Update Flow */}
          <StatusUpdateFlow 
            onStatusUpdate={handleStatusUpdate}
            onSPTComplete={handleSPTComplete}
            currentStatus={status}
            sptStatus={currentCase.spt_status}
          />

          {/* Status Section - Editable */}
          {isEditing && (
            <StatusUpdateSection
              currentCase={currentCase}
              expanded={expandedSections.status}
              onToggle={() => toggleSection('status')}
              icon={getSectionIcon('status')}
            />
          )}

          {/* Status Card - View Mode */}
          {!isEditing && (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between dark:text-slate-100">
                  <span>Case Status</span>
                  <Badge variant={status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline'}>
                    {status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium dark:text-slate-300">Update Status:</span>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customer Information */}
          {isEditing ? (
            <CustomerSection
              formData={formData}
              onInputChange={handleInputChange}
              expanded={expandedSections.customer}
              onToggle={() => toggleSection('customer')}
              icon={getSectionIcon('customer')}
            />
          ) : (
            <CustomerInformationDisplay case={currentCase} />
          )}

          {/* Appliance Information */}
          {isEditing ? (
            <ApplianceSection
              formData={formData}
              onInputChange={handleInputChange}
              expanded={expandedSections.appliance}
              onToggle={() => toggleSection('appliance')}
              icon={getSectionIcon('appliance')}
            />
          ) : (
            <ApplianceInformationDisplay case={currentCase} />
          )}

          {/* Service Details */}
          {isEditing ? (
            <ServiceSection
              formData={formData}
              onInputChange={handleInputChange}
              expanded={expandedSections.service}
              onToggle={() => toggleSection('service')}
              icon={getSectionIcon('service')}
            />
          ) : (
            <ServiceDetailsDisplay case={currentCase} />
          )}

          {/* Photos Section */}
          {isEditing && (
            <PhotosSection
              photos={photos}
              onPhotosChange={setPhotos}
              expanded={expandedSections.photos}
              onToggle={() => toggleSection('photos')}
              icon={getSectionIcon('photos')}
            />
          )}

          {/* Notes Section */}
          {isEditing && (
            <NotesSection
              formData={formData}
              onInputChange={handleInputChange}
              expanded={expandedSections.notes}
              onToggle={() => toggleSection('notes')}
              icon={getSectionIcon('notes')}
            />
          )}

          {/* Pricing Section - Always at the bottom */}
          {isEditing ? (
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
          ) : (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between dark:text-slate-100">
                  <span>Pricing Information</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                      Total: ${getTotalCostValue().toFixed(2)}
                    </span>
                    <Button 
                      onClick={() => setShowPaymentPage(true)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      disabled={getTotalCostValue() <= 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment (${getTotalCostValue().toFixed(2)})
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Labor Cost</label>
                    <p className="text-lg font-semibold dark:text-slate-100">
                      Level {currentCase.labor_level || 0} - ${currentCase.labor_cost_calculated || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Diagnostic Fee</label>
                    <p className="text-lg dark:text-slate-100">
                      {currentCase.diagnostic_fee_type || 'None'} - ${currentCase.diagnostic_fee_amount || 0}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Parts Cost</label>
                    <p className="text-lg dark:text-slate-100">
                      ${caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0).toFixed(2)}
                    </p>
                    {caseParts.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {caseParts.map((part, index) => (
                          <div key={index} className="text-sm text-slate-600 dark:text-slate-400">
                            {part.part_name} (#{part.part_number}) - Qty: {part.quantity} - ${(part.final_price * part.quantity).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Estimate</label>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${getTotalCostValue().toFixed(2)}
                    </p>
                  </div>
                </div>
                {currentCase.spt_status && (
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Job Status</label>
                    <Badge variant="outline" className="ml-2">
                      {currentCase.spt_status === 'spt' ? 'SPT Scheduled' : 'Complete'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};

export default CaseDetails;
