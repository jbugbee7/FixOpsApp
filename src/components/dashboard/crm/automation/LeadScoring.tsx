import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Settings, Calculator, Edit, Trash2, Power } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateScoringRuleDialog from './CreateScoringRuleDialog';

interface LeadScoringRule {
  id: string;
  name: string;
  description?: string;
  criteria_type: string;
  criteria_value: any;
  score_points: number;
  is_active: boolean;
}

interface CustomerScore {
  id: string;
  customer_id: number;
  total_score: number;
  priority_level: string;
  last_calculated: string;
}

const LeadScoring = () => {
  const [rules, setRules] = useState<LeadScoringRule[]>([]);
  const [customerScores, setCustomerScores] = useState<CustomerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rulesResult, scoresResult] = await Promise.all([
        supabase
          .from('lead_scoring_rules')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('customer_scores')
          .select('*')
          .order('total_score', { ascending: false })
          .limit(10)
      ]);

      if (rulesResult.error) throw rulesResult.error;
      if (scoresResult.error) throw scoresResult.error;

      setRules(rulesResult.data || []);
      setCustomerScores(scoresResult.data || []);
    } catch (error) {
      console.error('Error fetching lead scoring data:', error);
      toast({
        title: "Error",
        description: "Failed to load lead scoring data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lead_scoring_rules')
        .update({ is_active: !currentStatus })
        .eq('id', ruleId);

      if (error) throw error;

      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: !currentStatus } : rule
      ));

      toast({
        title: "Success",
        description: `Rule ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating rule:', error);
      toast({
        title: "Error",
        description: "Failed to update rule",
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
        description: "Rule deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      });
    }
  };

  const calculateScore = async (customerId?: number) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_customer_score', { customer_id_param: customerId || 1 });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Customer score calculated: ${data}`,
      });

      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error calculating score:', error);
      toast({
        title: "Error",
        description: "Failed to calculate customer score",
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
        return `Segment: ${value.value}`;
      case 'total_spent':
        return `Min spent: $${value.threshold}`;
      case 'order_count':
        return `Min orders: ${value.threshold}`;
      case 'last_contact':
        return `Within ${value.days} days`;
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
          <h3 className="text-lg font-semibold">Scoring Rules</h3>
          <CreateScoringRuleDialog onRuleCreated={fetchData} />
        </div>

        {rules.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No scoring rules configured</p>
              <CreateScoringRuleDialog onRuleCreated={fetchData} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm font-semibold text-purple-600">
                          +{rule.score_points} pts
                        </span>
                      </div>
                      {rule.description && (
                        <p className="text-sm text-muted-foreground mb-1">{rule.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatCriteriaValue(rule.criteria_type, rule.criteria_value)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRuleStatus(rule.id, rule.is_active)}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Customer Scores</h3>
          <Button 
            variant="outline"
            onClick={() => calculateScore()}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Recalculate Scores
          </Button>
        </div>

        {customerScores.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No customer scores available</p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => calculateScore()}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Demo Scores
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Scores Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerScores.map((score, index) => (
                  <div key={score.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium">Customer {score.customer_id}</p>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {new Date(score.last_calculated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold">{score.total_score} pts</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(score.priority_level)}`} />
                          <span className="text-sm capitalize">{score.priority_level}</span>
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress value={Math.min(score.total_score, 100)} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeadScoring;
