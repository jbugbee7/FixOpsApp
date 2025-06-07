
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calculator, Edit, Trash2, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScoringRule {
  id: string;
  name: string;
  criteria_type: string;
  criteria_value: any;
  score_points: number;
  is_active: boolean;
  created_at: string;
}

interface ScoringRulesListProps {
  rules: ScoringRule[];
  onRuleUpdated: () => void;
  onCreateClick: () => void;
}

const ScoringRulesList = ({ rules, onRuleUpdated, onCreateClick }: ScoringRulesListProps) => {
  const { toast } = useToast();

  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('lead_scoring_rules')
        .update({ is_active: !isActive })
        .eq('id', ruleId);

      if (error) throw error;

      onRuleUpdated();
      toast({
        title: "Success",
        description: `Scoring rule ${!isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating scoring rule:', error);
      toast({
        title: "Error",
        description: "Failed to update scoring rule",
        variant: "destructive",
      });
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('lead_scoring_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;

      onRuleUpdated();
      toast({
        title: "Success",
        description: "Scoring rule deleted",
      });
    } catch (error) {
      console.error('Error deleting scoring rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete scoring rule",
        variant: "destructive",
      });
    }
  };

  const formatCriteriaValue = (type: string, value: any) => {
    switch (type) {
      case 'segment':
        return value.value;
      case 'total_spent':
        return `$${value.threshold}+`;
      case 'order_count':
        return `${value.threshold}+ orders`;
      case 'last_contact':
        return `${value.days} days ago`;
      case 'engagement_score':
        return `${value.threshold}+ score`;
      default:
        return JSON.stringify(value);
    }
  };

  if (rules.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No lead scoring rules created yet</p>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={onCreateClick}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Rule
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {rules.map((rule) => (
        <Card key={rule.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{rule.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={rule.is_active ? "default" : "secondary"}>
                  {rule.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">
                  +{rule.score_points} points
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">
                  <span className="font-medium">Criteria:</span> {rule.criteria_type.replace('_', ' ')} = {formatCriteriaValue(rule.criteria_type, rule.criteria_value)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRuleStatus(rule.id, rule.is_active)}
                >
                  {rule.is_active ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {rule.is_active ? "Pause" : "Activate"}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteRule(rule.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScoringRulesList;
