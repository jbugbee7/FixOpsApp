
import { useState } from 'react';
import StatusActionsDropdown from './StatusActionsDropdown';
import { Case } from '@/types/case';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, User, Wrench, FileText, ChevronDown, ChevronUp, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CaseDetailsViewModeProps {
  currentCase: Case;
  status: string;
  caseParts: any[];
  onStatusUpdate: (newStatus: string, cancellationReason?: string) => void;
  onSPTComplete: (sptStatus: string) => void;
  onStatusChange: (newStatus: string) => void;
  getTotalCostValue: () => number;
  setShowPaymentPage: (show: boolean) => void;
}

const CaseDetailsViewMode = ({
  currentCase,
  status,
  caseParts,
  onStatusUpdate,
  onSPTComplete,
  onStatusChange,
  getTotalCostValue,
  setShowPaymentPage
}: CaseDetailsViewModeProps) => {
  const [expandedSections, setExpandedSections] = useState({
    customer: false,
    appliance: false,
    service: false,
    pricing: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Status Actions Dropdown */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <span>Status & Actions</span>
            </div>
            <Badge variant={status === 'Completed' ? 'default' : status === 'In Progress' ? 'secondary' : 'outline'}>
              {status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatusActionsDropdown currentCase={currentCase} />
        </CardContent>
      </Card>

      {/* Customer Information - Collapsible */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => toggleSection('customer')}
        >
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                {currentCase.customer_name}
              </span>
              {expandedSections.customer ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.customer && (
          <CardContent className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Customer Name</label>
                <p className="text-lg font-semibold dark:text-slate-100">{currentCase.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number</label>
                <p className="text-lg dark:text-slate-100 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {currentCase.customer_phone || 'N/A'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</label>
                <p className="text-lg dark:text-slate-100 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {currentCase.customer_email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Date</label>
                <p className="text-lg dark:text-slate-100 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(currentCase.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Address</label>
              <div className="text-lg dark:text-slate-100">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <div>
                    {currentCase.customer_address && (
                      <div>{currentCase.customer_address}</div>
                    )}
                    {currentCase.customer_address_line_2 && (
                      <div>{currentCase.customer_address_line_2}</div>
                    )}
                    {(currentCase.customer_city || currentCase.customer_state || currentCase.customer_zip_code) && (
                      <div>
                        {currentCase.customer_city}{currentCase.customer_city && currentCase.customer_state ? ', ' : ''}
                        {currentCase.customer_state} {currentCase.customer_zip_code}
                      </div>
                    )}
                    {!currentCase.customer_address && !currentCase.customer_city && 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Appliance Information - Collapsible */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => toggleSection('appliance')}
        >
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Appliance Information</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                {currentCase.appliance_brand} {currentCase.appliance_type}
              </span>
              {expandedSections.appliance ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.appliance && (
          <CardContent className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Appliance</label>
                <p className="text-lg font-semibold dark:text-slate-100">{currentCase.appliance_brand} {currentCase.appliance_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Model</label>
                <p className="text-lg dark:text-slate-100">{currentCase.appliance_model || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Serial Number</label>
                <p className="text-lg dark:text-slate-100">{currentCase.serial_number || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Warranty Status</label>
                <p className="text-lg dark:text-slate-100">{currentCase.warranty_status || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Service Details - Collapsible */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => toggleSection('service')}
        >
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Service Details</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                {currentCase.service_type || 'Service'}
              </span>
              {expandedSections.service ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.service && (
          <CardContent className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Type</label>
              <p className="text-lg dark:text-slate-100">{currentCase.service_type || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Problem Description</label>
              <p className="text-lg dark:text-slate-100">{currentCase.problem_description}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Initial Diagnosis</label>
              <p className="text-lg dark:text-slate-100">{currentCase.initial_diagnosis || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Parts Needed</label>
              <p className="text-lg dark:text-slate-100">{currentCase.parts_needed || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Estimated Time</label>
              <p className="text-lg dark:text-slate-100">{currentCase.estimated_time || 'N/A'}</p>
            </div>
            {currentCase.technician_notes && (
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Technician Notes</label>
                <p className="text-lg dark:text-slate-100">{currentCase.technician_notes}</p>
              </div>
            )}
            {currentCase.cancellation_reason && (
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Cancellation Reason</label>
                <p className="text-lg text-red-600 dark:text-red-400">{currentCase.cancellation_reason}</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Pricing Information - Collapsible */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader 
          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          onClick={() => toggleSection('pricing')}
        >
          <CardTitle className="flex items-center justify-between dark:text-slate-100">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Pricing Information</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                Total: ${getTotalCostValue().toFixed(2)}
              </span>
              {expandedSections.pricing ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CardTitle>
        </CardHeader>
        {expandedSections.pricing && (
          <CardContent className="space-y-4 animate-fade-in">
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
            
            {/* Centered Payment Button */}
            <div className="flex justify-center pt-6 border-t">
              <Button 
                onClick={() => setShowPaymentPage(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold"
                disabled={getTotalCostValue() <= 0}
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Process Payment (${getTotalCostValue().toFixed(2)})
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CaseDetailsViewMode;
