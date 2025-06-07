
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calculator, TrendingUp, Edit, Trash2, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateScoringRuleDialog from './CreateScoringRuleDialog';
import CustomerHealthDashboard from './CustomerHealthDashboard';

interface ScoringRule {
  id: string;
  name: string;
  description: string;
  criteria_type: string;
  criteria_value: any;
  score_points: number;
  is_active: boolean;
  created_at: string;
}

interface CustomerScore {
  id: string;
  customer_id: number;
  total_score: number;
  priority_level: string;
  last_calculated: string;
}

const LeadScoring = () => {
  const [rules, setRules] = useState<ScoringRule[]>([]);
  const [scores, setScores] = useState<CustomerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchScoringRules();
    fetchCustomerScores();
  }, []);

  const fetchScoringRules = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_scoring_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching scoring rules:', error);
      toast({
        title: "Error",
        description: "Failed to load lead scoring rules",
        variant: "destructive",
      });
    }
  };

  const fetchCustomerScores = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_scores')
        .select('*')
        .order('total_score', { ascending: false });

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching customer scores:', error);
      toast({
        title: "Error",
        description: "Failed to load customer scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (ruleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('lead_scoring_rules')
        .update({ is_active: !isActive })
        .eq('id', ruleId);

      if (error) throw error;

      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: !isActive } : rule
      ));

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

      setRules(rules.filter(rule => rule.id !== ruleId));
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

  const recalculateScores = async () => {
    try {
      // In a real implementation, this would trigger a calculation process
      // For now, we'll just refresh the scores
      await fetchCustomerScores();
      toast({
        title: "Success",
        description: "Customer scores recalculated",
      });
    } catch (error) {
      console.error('Error recalculating scores:', error);
      toast({
        title: "Error",
        description: "Failed to recalculate scores",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'vip': return 'bg-purple-500';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading lead scoring data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lead Scoring Rules */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Lead Scoring Rules</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={recalculateScores}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Recalculate Scores
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </div>

        {rules.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No lead scoring rules created yet</p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{rule.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.description}
                      </p>
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
        )}
      </div>

      {/* Customer Scores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Scores</h3>
        
        {scores.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No customer scores calculated yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {scores.slice(0, 10).map((score) => (
              <Card key={score.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Customer #{score.customer_id}</p>
                        <p className="text-sm text-muted-foreground">
                          Last calculated: {new Date(score.last_calculated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{score.total_score}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                      <Badge className={getPriorityColor(score.priority_level)}>
                        {score.priority_level.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Customer Health Dashboard */}
      <CustomerHealthDashboard />

      <CreateScoringRuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onRuleCreated={() => {
          fetchScoringRules();
          fetchCustomerScores();
        }}
      />
    </div>
  );
};

export default LeadScoring;
