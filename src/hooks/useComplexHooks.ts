
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useComplexHooks = () => {
  const handleEvent = async (eventType: string, payload: any) => {
    try {
      console.log('Sending event to complex-hooks:', eventType, payload);
      
      const { data, error } = await supabase.functions.invoke('complex-hooks/handle-event', {
        body: {
          eventType,
          payload
        }
      });

      if (error) {
        console.error('Error calling complex-hooks handle-event:', error);
        toast({
          title: "Event Processing Error",
          description: "Failed to process the event.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Event processed successfully:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error calling complex-hooks:', error);
      toast({
        title: "Event Processing Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleAnotherEvent = async (data: any) => {
    try {
      console.log('Sending another event to complex-hooks:', data);
      
      const { data: response, error } = await supabase.functions.invoke('complex-hooks/another-event', {
        body: {
          data
        }
      });

      if (error) {
        console.error('Error calling complex-hooks another-event:', error);
        toast({
          title: "Event Processing Error",
          description: "Failed to process another event.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Another event processed successfully:', response);
      return true;
    } catch (error) {
      console.error('Unexpected error calling complex-hooks another-event:', error);
      toast({
        title: "Event Processing Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleEvent,
    handleAnotherEvent
  };
};
