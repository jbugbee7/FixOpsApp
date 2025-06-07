
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CreateScoringRuleDialog from './CreateScoringRuleDialog';
import CustomerHealthDashboard from './CustomerHealthDashboard';
import ScoringRulesList from './scoring/ScoringRulesList';
import CustomerScoresList from './scoring/CustomerScoresList';

interface ScoringRule {
  id: string;
  name: string;
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

  const recalculateScores = async () => {
    try {
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

        <ScoringRulesList 
          rules={rules}
          onRuleUpdated={fetchScoringRules}
          onCreateClick={() => setCreateDialogOpen(true)}
        />
      </div>

      {/* Customer Scores */}
      <CustomerScoresList scores={scores} />

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
