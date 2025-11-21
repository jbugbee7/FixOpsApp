
import { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { calculateFinalPrice } from '@/utils/partsCalculations';

interface PartFormData {
  part_name: string;
  part_number: string;
  part_cost: number;
  markup_percentage: number;
  appliance_type: string;
  appliance_brand: string;
}

interface UseAddPartFormProps {
  applianceType?: string;
  applianceBrand?: string;
  onPartAdded?: () => void;
}

export const useAddPartForm = ({ applianceType, applianceBrand, onPartAdded }: UseAddPartFormProps) => {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const [newPart, setNewPart] = useState<PartFormData>({
    part_name: '',
    part_number: '',
    part_cost: 0,
    markup_percentage: 75,
    appliance_type: applianceType || '',
    appliance_brand: applianceBrand || ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setNewPart(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setNewPart({
      part_name: '',
      part_number: '',
      part_cost: 0,
      markup_percentage: 75,
      appliance_type: applianceType || '',
      appliance_brand: applianceBrand || ''
    });
  };

  const handleSaveNewPart = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add parts to the directory.",
        variant: "destructive"
      });
      return;
    }

    if (!newPart.part_name || !newPart.part_number) {
      toast({
        title: "Missing Information",
        description: "Please enter both part name and part number.",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      const finalPrice = calculateFinalPrice(newPart.part_cost, newPart.markup_percentage);
      
      console.log('Attempting to save part with user_id:', user.id);
      console.log('Part data:', {
        part_name: newPart.part_name,
        part_number: newPart.part_number,
        part_cost: newPart.part_cost,
        markup_percentage: newPart.markup_percentage,
        final_price: finalPrice,
        appliance_type: newPart.appliance_type || null,
        appliance_brand: newPart.appliance_brand || null,
        user_id: user.id
      });
      
      const { data, error } = await supabase
        .from('parts')
        .insert({
          part_name: newPart.part_name,
          part_number: newPart.part_number,
          part_cost: newPart.part_cost,
          markup_percentage: newPart.markup_percentage,
          final_price: finalPrice,
          appliance_type: newPart.appliance_type || null,
          appliance_brand: newPart.appliance_brand || null,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving part:', error);
        toast({
          title: "Error Saving Part",
          description: `Failed to save part: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Part saved successfully:', data);
      
      resetForm();

      if (onPartAdded) {
        onPartAdded();
      }

      toast({
        title: "Part Saved Successfully",
        description: `${data.part_name} has been added to the parts directory.`,
      });

    } catch (error) {
      console.error('Unexpected error saving part:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while saving the part. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return {
    newPart,
    isAdding,
    handleInputChange,
    handleSaveNewPart,
    resetForm
  };
};
