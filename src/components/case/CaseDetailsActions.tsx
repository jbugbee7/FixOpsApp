
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Case } from '@/types/case';

interface CaseDetailsActionsProps {
  currentCase: Case;
  status: string;
  setStatus: (status: string) => void;
  setCurrentCase: (updateFn: (prev: Case) => Case) => void;
  onBack: () => void;
}

export const useCaseDetailsActions = ({
  currentCase,
  status,
  setStatus,
  setCurrentCase,
  onBack
}: CaseDetailsActionsProps) => {
  const { user } = useAuth();

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    // onStatusUpdate(currentCase.id, newStatus);
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
        .eq('id', currentCase.id);

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
        .eq('id', currentCase.id);

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

  return {
    handleStatusChange,
    handleStatusUpdate,
    handleSPTComplete
  };
};
