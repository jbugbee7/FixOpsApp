
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AsyncStorage } from '@/utils/asyncStorage';
import { Case } from '@/types/case';
import { PublicCase, updatePublicCase } from '@/services/publicCasesService';

export const useBasicCaseStatusUpdate = (
  user: any, 
  isOnline: boolean, 
  cases: Case[], 
  setCases: (cases: Case[]) => void,
  publicCases: PublicCase[],
  setPublicCases: (publicCases: PublicCase[]) => void
) => {
  const updateCaseStatus = async (caseId: string, newStatus: string): Promise<boolean> => {
    try {
      if (!isOnline) {
        toast({
          title: "Offline Mode",
          description: "Cannot update work orders while offline. Changes will be lost.",
          variant: "destructive"
        });
        return false;
      }

      // Check if this is a public case or regular case
      const isPublicCase = publicCases.some(pc => pc.id === caseId);
      
      if (isPublicCase) {
        // Update public case - this will trigger the move to cases table
        const result = await updatePublicCase(caseId, { 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        });
        
        if (!result.success) {
          console.error('Error updating public case status:', result.error);
          toast({
            title: "Error Updating Work Order",
            description: "Failed to update work order status.",
            variant: "destructive"
          });
          return false;
        }

        // Remove from public cases list since it's moved to cases table
        const updatedPublicCases = publicCases.filter(pc => pc.id !== caseId);
        setPublicCases(updatedPublicCases);

        toast({
          title: "Work Order Claimed",
          description: `Work order status updated to ${newStatus} and moved to your cases.`,
        });
        return true;
      } else {
        // Update regular case
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
          return false;
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
        return true;
      }
    } catch (error) {
      console.error('Error updating case status:', error);
      toast({
        title: "Error Updating Work Order",
        description: "An unexpected error occurred while updating the work order.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    updateCaseStatus
  };
};
