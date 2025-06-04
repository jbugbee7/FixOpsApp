
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface CasePart {
  id: string;
  part_name: string;
  part_number: string;
  part_cost: number;
  quantity: number;
  markup_percentage: number;
  final_price: number;
}

export const useCaseParts = (caseId: string, isPublicCase: boolean) => {
  const { user } = useAuth();
  const [caseParts, setCaseParts] = useState<CasePart[]>([]);

  const loadCaseParts = async () => {
    if (!user || !caseId || isPublicCase) return;

    try {
      console.log('Loading case parts for case:', caseId);
      const { data, error } = await supabase
        .from('case_parts')
        .select('*')
        .eq('case_id', caseId);

      if (error) {
        console.error('Error loading case parts:', error);
        return;
      }

      console.log('Loaded case parts:', data);
      setCaseParts(data || []);
    } catch (error) {
      console.error('Error loading case parts:', error);
    }
  };

  useEffect(() => {
    loadCaseParts();
  }, [user, caseId]);

  const getTotalCostValue = (laborCost: number, diagnosticFee: number) => {
    const partsCost = caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
    return laborCost + diagnosticFee + partsCost;
  };

  return {
    caseParts,
    setCaseParts,
    loadCaseParts,
    getTotalCostValue
  };
};
