import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useStatusUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (caseId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus })
        .eq('id', caseId);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update status",
          variant: "destructive",
        });
        return { success: false };
      }

      toast({
        title: "Status Updated",
        description: `Status changed to ${newStatus}`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update status",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async (caseId: string, newStatus: string, cancellationReason?: string) => {
    return updateStatus(caseId, newStatus);
  };

  const handleSPTComplete = async (caseId: string, sptStatus: string) => {
    return updateStatus(caseId, sptStatus);
  };

  return {
    updateStatus,
    handleStatusUpdate,
    handleSPTComplete,
    isUpdating
  };
};
