
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';

export const useCaseStatusUpdate = (isOnline: boolean, cases: Case[], setCases: (cases: Case[]) => void) => {
  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      if (!isOnline) {
        toast({
          title: "Offline Mode",
          description: "Cannot update work orders while offline. Changes will be lost.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', caseId);

      if (error) {
        console.error('Error updating case status:', error);
        toast({
          title: "Error Updating Work Order",
          description: "Failed to update work order status.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      const updatedCases = cases.map(case_ => 
        case_.id === caseId ? { ...case_, status: newStatus } : case_
      );
      setCases(updatedCases);

      // Update AsyncStorage with new data
      await AsyncStorage.storeCases(updatedCases);

      toast({
        title: "Work Order Updated",
        description: `Work order status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating case status:', error);
      toast({
        title: "Error Updating Work Order",
        description: "An unexpected error occurred while updating the work order.",
        variant: "destructive"
      });
    }
  };

  return {
    updateCaseStatus
  };
};
