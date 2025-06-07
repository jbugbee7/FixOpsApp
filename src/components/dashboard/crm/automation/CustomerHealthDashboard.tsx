
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerHealthMetric {
  id: string;
  customer_id: number;
  health_score: number;
  risk_factors: string[];
  opportunities: string[];
  last_interaction_date?: string;
  next_recommended_action?: string;
  calculated_at: string;
}

const CustomerHealthDashboard = () => {
  const [healthMetrics, setHealthMetrics] = useState<CustomerHealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_health_metrics')
        .select('*')
        .order('health_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHealthMetrics(data || []);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load customer health metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDemoHealthScores = async () => {
    setCalculating(true);
    try {
      // Generate demo health scores for customers
      const demoMetrics = Array.from({ length: 10 }, (_, i) => ({
        customer_id: i + 1,
        health_score: Math.floor(Math.random() * 100) + 1,
        risk_factors: getRandomRiskFactors(),
        opportunities: getRandomOpportunities(),
        last_interaction_date: getRandomDate(),
        next_recommended_action: getRandomAction()
      }));

      for (const metric of demoMetrics) {
        await supabase
          .from('customer_health_metrics')
          .upsert(metric, { onConflict: 'customer_id' });
      }

      toast({
        title: "Success",
        description: "Customer health scores calculated successfully",
      });

      fetchHealthMetrics();
    } catch (error) {
      console.error('Error calculating health scores:', error);
      toast({
        title: "Error",
        description: "Failed to calculate health scores",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  const getRandomRiskFactors = () => {
    const factors = [
      'No recent interaction',
      'Declining service frequency',
      'Payment delays',
      'Competitor interest',
      'Service complaints'
    ];
    return factors.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const getRandomOpportunities = () => {
    const opportunities = [
      'Upsell premium service',
      'Maintenance contract',
      'Referral program',
      'Extended warranty',
      'Additional services'
    ];
    return opportunities.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  const getRandomDate = () => {
    const days = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const getRandomAction = () => {
    const actions = [
      'Schedule follow-up call',
      'Send satisfaction survey',
      'Offer maintenance package',
      'Schedule check-in visit',
      'Send promotional offer'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 40) return { label: 'At Risk', variant: 'outline' as const };
    return { label: 'Critical', variant: 'destructive' as const };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading customer health metrics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Health Dashboard</h3>
        <Button 
          onClick={calculateDemoHealthScores}
          disabled={calculating}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${calculating ? 'animate-spin' : ''}`} />
          {calculating ? 'Calculating...' : 'Refresh Scores'}
        </Button>
      </div>

      {healthMetrics.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No customer health data available</p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={calculateDemoHealthScores}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Calculate Demo Health Scores
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {healthMetrics.map((metric) => {
            const healthBadge = getHealthBadge(metric.health_score);
            return (
              <Card key={metric.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className={`h-5 w-5 ${getHealthColor(metric.health_score)}`} />
                      <div>
                        <CardTitle className="text-base">Customer {metric.customer_id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {new Date(metric.calculated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={healthBadge.variant}>{healthBadge.label}</Badge>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getHealthColor(metric.health_score)}`}>
                          {metric.health_score}
                        </p>
                        <p className="text-xs text-muted-foreground">Health Score</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full">
                    <Progress value={metric.health_score} className="h-2" />
                  </div>

                  {metric.risk_factors.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Risk Factors
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {metric.risk_factors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {metric.opportunities.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Opportunities
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {metric.opportunities.map((opportunity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {opportunity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {metric.next_recommended_action && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Recommended Action</p>
                      <p className="text-sm text-blue-700">{metric.next_recommended_action}</p>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Last interaction: {
                        metric.last_interaction_date 
                          ? new Date(metric.last_interaction_date).toLocaleDateString()
                          : 'No recent interaction'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerHealthDashboard;
