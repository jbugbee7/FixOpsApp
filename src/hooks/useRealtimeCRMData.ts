import { useState, useEffect } from 'react';
import { ContactInteraction, CommunicationHistory } from '@/types/crm';

export const useRealtimeCRMData = () => {
  const [interactions, setInteractions] = useState<ContactInteraction[]>([]);
  const [communications, setCommunications] = useState<CommunicationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tables don't exist yet - return empty data
    setInteractions([]);
    setCommunications([]);
    setLoading(false);
  }, []);

  const createInteraction = async () => {
    console.log('Interaction tracking not yet implemented');
    return null;
  };

  return {
    interactions,
    communications,
    loading,
    error,
    createInteraction,
    refetch: () => {},
  };
};
