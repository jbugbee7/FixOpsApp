import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Wrench, Calendar, Phone, MapPin, FileText, Edit, Mail, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import EditCaseForm from './EditCaseForm';
import StatusUpdateFlow from './forms/StatusUpdateFlow';
import { Case } from '@/types/case';

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

  const handleEditSave = (updatedCase: Case) => {
    setCurrentCase(updatedCase);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
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
        onBack(); // Navigate back since the work order is cancelled
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

  const getTotalCost = () => {
    const laborCost = currentCase.labor_cost_calculated || 0;
    const diagnosticFee = currentCase.diagnostic_fee_amount || 0;
    const partsCost = caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
    return laborCost + diagnosticFee + partsCost;
  };

  // If in editing mode, show the edit form
  if (isEditing) {
    return (
      <EditCaseForm 
        case={currentCase} 
        onBack={handleEditCancel}
        onSave={handleEditSave}
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
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Case Details</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Case #{currentCase.id}</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2"
              variant="outline"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Status Update Flow */}
          <StatusUpdateFlow 
            onStatusUpdate={handleStatusUpdate}
            onSPTComplete={handleSPTComplete}
            currentStatus={status}
            sptStatus={currentCase.spt_status}
          />

          {/* Status Card */}
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

          {/* Pricing Information */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <DollarSign className="h-5 w-5" />
                <span>Pricing Information</span>
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
                    ${getTotalCost().toFixed(2)}
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

          {/* Customer Information */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          </Card>

          {/* Appliance Information */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <Wrench className="h-5 w-5" />
                <span>Appliance Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
          </Card>

          {/* Service Details */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <FileText className="h-5 w-5" />
                <span>Service Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
