
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import EditCaseForm from './EditCaseForm';
import StatusUpdateFlow from './forms/StatusUpdateFlow';
import CustomerInformationDisplay from './case/CustomerInformationDisplay';
import ApplianceInformationDisplay from './case/ApplianceInformationDisplay';
import ServiceDetailsDisplay from './case/ServiceDetailsDisplay';
import PricingInformationDisplay from './case/PricingInformationDisplay';
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
          <PricingInformationDisplay 
            case={currentCase}
            caseParts={caseParts}
            getTotalCost={getTotalCost}
          />

          {/* Customer Information */}
          <CustomerInformationDisplay case={currentCase} />

          {/* Appliance Information */}
          <ApplianceInformationDisplay case={currentCase} />

          {/* Service Details */}
          <ServiceDetailsDisplay case={currentCase} />
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
