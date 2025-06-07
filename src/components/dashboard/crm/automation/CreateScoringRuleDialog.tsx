
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateScoringRuleDialogProps {
  onRuleCreated: () => void;
}

const CreateScoringRuleDialog = ({ onRuleCreated }: CreateScoringRuleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria_type: '',
    score_points: 0,
    criteria_value: {}
  });
  const { toast } = useToast();

  const criteriaTypes = [
    { value: 'segment', label: 'Customer Segment' },
    { value: 'total_spent', label: 'Total Spent' },
    { value: 'order_count', label: 'Order Count' },
    { value: 'last_contact', label: 'Last Contact' },
    { value: 'acquisition_date', label: 'Customer Age' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.criteria_type) return;

    setLoading(true);
    try {
      let criteriaValue = {};
      
      // Build criteria value based on type
      if (formData.criteria_type === 'segment') {
        const segmentValue = (document.getElementById('segment_value') as HTMLInputElement)?.value;
        criteriaValue = { value: segmentValue };
      } else if (formData.criteria_type === 'total_spent' || formData.criteria_type === 'order_count') {
        const threshold = (document.getElementById('threshold_value') as HTMLInputElement)?.value;
        criteriaValue = { threshold: parseInt(threshold) };
      } else if (formData.criteria_type === 'last_contact') {
        const days = (document.getElementById('days_value') as HTMLInputElement)?.value;
        criteriaValue = { days: parseInt(days) };
      }

      const { error } = await supabase
        .from('lead_scoring_rules')
        .insert({
          name: formData.name,
          description: formData.description,
          criteria_type: formData.criteria_type,
          criteria_value: criteriaValue,
          score_points: formData.score_points
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead scoring rule created successfully",
      });

      setOpen(false);
      setFormData({
        name: '',
        description: '',
        criteria_type: '',
        score_points: 0,
        criteria_value: {}
      });
      onRuleCreated();
    } catch (error) {
      console.error('Error creating scoring rule:', error);
      toast({
        title: "Error",
        description: "Failed to create scoring rule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCriteriaInput = () => {
    switch (formData.criteria_type) {
      case 'segment':
        return (
          <div className="space-y-2">
            <Label htmlFor="segment_value">Segment Name</Label>
            <Input
              id="segment_value"
              placeholder="e.g., VIP, Premium, Basic"
              required
            />
          </div>
        );
      case 'total_spent':
        return (
          <div className="space-y-2">
            <Label htmlFor="threshold_value">Minimum Amount ($)</Label>
            <Input
              id="threshold_value"
              type="number"
              placeholder="e.g., 1000"
              required
            />
          </div>
        );
      case 'order_count':
        return (
          <div className="space-y-2">
            <Label htmlFor="threshold_value">Minimum Orders</Label>
            <Input
              id="threshold_value"
              type="number"
              placeholder="e.g., 5"
              required
            />
          </div>
        );
      case 'last_contact':
        return (
          <div className="space-y-2">
            <Label htmlFor="days_value">Days Since Contact</Label>
            <Input
              id="days_value"
              type="number"
              placeholder="e.g., 30"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </DialogTrigger>
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
              placeholder="Describe when this rule should apply"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Criteria Type</Label>
            <Select 
              value={formData.criteria_type} 
              onValueChange={(value) => setFormData({ ...formData, criteria_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select criteria type" />
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

          {renderCriteriaInput()}

          <div className="space-y-2">
            <Label htmlFor="score_points">Score Points</Label>
            <Input
              id="score_points"
              type="number"
              value={formData.score_points}
              onChange={(e) => setFormData({ ...formData, score_points: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 25"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Rule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScoringRuleDialog;
