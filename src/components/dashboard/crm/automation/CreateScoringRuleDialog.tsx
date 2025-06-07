
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateScoringRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRuleCreated: () => void;
}

const CreateScoringRuleDialog = ({ open, onOpenChange, onRuleCreated }: CreateScoringRuleDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria_type: 'segment',
    criteria_value: '',
    score_points: 10
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const criteriaTypes = [
    { value: 'segment', label: 'Customer Segment' },
    { value: 'total_spent', label: 'Total Spent' },
    { value: 'order_count', label: 'Order Count' },
    { value: 'last_contact', label: 'Last Contact' },
    { value: 'engagement_score', label: 'Engagement Score' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let criteriaValueObj = {};
      
      // Format criteria value based on type
      switch (formData.criteria_type) {
        case 'segment':
          criteriaValueObj = { value: formData.criteria_value };
          break;
        case 'total_spent':
        case 'order_count':
        case 'engagement_score':
          criteriaValueObj = { threshold: parseInt(formData.criteria_value) };
          break;
        case 'last_contact':
          criteriaValueObj = { days: parseInt(formData.criteria_value) };
          break;
        default:
          criteriaValueObj = { value: formData.criteria_value };
      }

      const { error } = await supabase
        .from('lead_scoring_rules')
        .insert({
          name: formData.name,
          description: formData.description,
          criteria_type: formData.criteria_type,
          criteria_value: criteriaValueObj,
          score_points: formData.score_points
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead scoring rule created successfully",
      });

      onRuleCreated();
      onOpenChange(false);
      setFormData({ 
        name: '', 
        description: '', 
        criteria_type: 'segment', 
        criteria_value: '', 
        score_points: 10 
      });
    } catch (error) {
      console.error('Error creating scoring rule:', error);
      toast({
        title: "Error",
        description: "Failed to create lead scoring rule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCriteriaValuePlaceholder = () => {
    switch (formData.criteria_type) {
      case 'segment':
        return 'e.g., Premium, VIP, Standard';
      case 'total_spent':
        return 'e.g., 1000 (minimum amount)';
      case 'order_count':
        return 'e.g., 5 (minimum orders)';
      case 'last_contact':
        return 'e.g., 30 (days ago)';
      case 'engagement_score':
        return 'e.g., 80 (minimum score)';
      default:
        return 'Enter value';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Lead Scoring Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., High Value Customer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this rule evaluates..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Criteria Type</Label>
              <Select 
                value={formData.criteria_type} 
                onValueChange={(value) => setFormData({ ...formData, criteria_type: value, criteria_value: '' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {criteriaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="score_points">Score Points</Label>
              <Input
                id="score_points"
                type="number"
                value={formData.score_points}
                onChange={(e) => setFormData({ ...formData, score_points: parseInt(e.target.value) || 0 })}
                min="0"
                max="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="criteria_value">Criteria Value</Label>
            <Input
              id="criteria_value"
              value={formData.criteria_value}
              onChange={(e) => setFormData({ ...formData, criteria_value: e.target.value })}
              placeholder={getCriteriaValuePlaceholder()}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScoringRuleDialog;
