import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useStatusUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (caseId: string, newStatus: string, additionalData?: any) => {
    setIsUpdating(true);
    try {
      const updateData: any = { status: newStatus, ...additionalData };
      
      const { error } = await supabase
        .from('cases')
        .update(updateData)
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
    return updateStatus(caseId, newStatus, cancellationReason ? { cancellation_reason: cancellationReason } : undefined);
  };

  const handleSPTComplete = async (caseId: string, sptStatus: string) => {
    return updateStatus(caseId, sptStatus);
  };

  const saveSignature = async (
    caseId: string, 
    signatureType: 'authorization' | 'completion',
    signature: string,
    signerName: string
  ) => {
    const additionalData = signatureType === 'authorization' 
      ? {
          authorization_signature: signature,
          authorization_signature_date: new Date().toISOString(),
          authorization_signed_by: signerName,
        }
      : {
          completion_signature: signature,
          completion_signature_date: new Date().toISOString(),
          completion_signed_by: signerName,
        };

    return updateStatus(caseId, undefined as any, additionalData);
  };

  return {
    updateStatus,
    handleStatusUpdate,
    handleSPTComplete,
    saveSignature,
    isUpdating
  };
};
