import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Case } from '@/types/case';

export const useStatusUpdate = () => {
  const { user } = useAuth();

  const handleStatusUpdate = async (currentCase: Case, status: string, reason?: string) => {
    if (!user) return;

    try {
      const updateData: any = { status: status };
      
      if (reason) {
        updateData.cancellation_reason = reason;
      }

      const { error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', currentCase.id)
        .eq('user_id', user.id);

      if (error) throw error;

      if (status === 'cancel' && reason) {
        toast({
          title: "Work Order Cancelled",
          description: "The work order has been cancelled.",
        });
      } else {
        toast({
          title: "Status Updated",
          description: `Work order status updated to ${status}.`,
        });
      }

      // Reload the page to reflect changes in the dashboard tabs
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update work order status.",
        variant: "destructive"
      });
    }
  };

  const handleSPTComplete = async (currentCase: Case, sptStatus: string) => {
    if (!user) return;

    try {
      const updateData: any = {};
      
      if (sptStatus === 'complete') {
        updateData.spt_status = sptStatus;
        updateData.status = 'Completed';
      } else if (sptStatus === 'spr') {
        updateData.spt_status = sptStatus;
        // SPR should keep the work order in active status, not completed
        updateData.status = 'Scheduled';
      } else if (sptStatus === 'Scheduled') {
        // Handle the moved "Scheduled" option
        updateData.status = 'Scheduled';
        // Clear any existing spt_status when scheduling
        updateData.spt_status = null;
      }

      const { error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', currentCase.id)
        .eq('user_id', user.id);

      if (error) throw error;

      if (sptStatus === 'complete') {
        toast({
          title: "Job Status Updated",
          description: "Work order marked as complete.",
        });
      } else if (sptStatus === 'spr') {
        toast({
          title: "Job Status Updated",
          description: "SPR scheduled.",
        });
      } else if (sptStatus === 'Scheduled') {
        toast({
          title: "Status Updated",
          description: "Work order status updated to Scheduled.",
        });
      }

      // Reload the page to reflect changes in the dashboard tabs
      window.location.reload();
    } catch (error) {
      console.error('Error updating SPR status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive"
      });
    }
  };

  return {
    handleStatusUpdate,
    handleSPTComplete
  };
};
