
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ContactInteraction {
  id: string;
  customer_id: number;
  interaction_type: string;
  subject: string;
  description?: string;
  interaction_date: string;
  status: string;
  priority: string;
  outcome?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

interface CommunicationHistory {
  id: string;
  customer_id: number;
  type: string;
  subject?: string;
  content?: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
}

export const useRealtimeCRMData = () => {
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [communications, setCommunications] = useState<CommunicationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Tables don't exist yet - return empty data
  useEffect(() => {
    setLoading(false);
  }, []);

  const createInteraction = async (interactionData: any) => {
    console.log('Interaction creation not yet implemented:', interactionData);
    toast({
      title: 'Info',
      description: 'Interaction tracking not yet implemented',
    });
    return null;
  };

  const refetch = () => {
    // No-op since tables don't exist
  };

  return {
    interactions,
    communications,
    loading,
    error,
    createInteraction,
    refetch,
  };
};
