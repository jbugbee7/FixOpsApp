
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerHealthChart from './CustomerHealthChart';

interface CustomerHealthMetric {
  id: string;
  customer_id: number;
  health_score: number;
  risk_factors: string[];
  opportunities: string[];
  last_interaction_date: string | null;
  next_recommended_action: string | null;
  calculated_at: string;
}

const CustomerHealthDashboard = () => {
  const [metrics, setMetrics] = useState<CustomerHealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer_health_metrics')
        .select('*')
        .order('health_score', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
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

  const refreshMetrics = async () => {
    setRefreshing(true);
    await fetchHealthMetrics();
    setRefreshing(false);
    toast({
      title: "Success",
      description: "Customer health metrics refreshed",
    });
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const getHealthIcon = (score: number) => {
    if (score >= 60) return <Heart className="h-4 w-4 text-green-500" />;
    if (score >= 40) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
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
          onClick={refreshMetrics}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Excellent Health</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.filter(m => m.health_score >= 80).length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {metrics.filter(m => m.health_score < 60 && m.health_score >= 40).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics.filter(m => m.health_score < 40).length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">
                  {metrics.length > 0 ? Math.round(metrics.reduce((acc, m) => acc + m.health_score, 0) / metrics.length) : 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <CustomerHealthChart healthMetrics={metrics} />

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Health Details</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No customer health metrics available
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric) => {
                const status = getHealthStatus(metric.health_score);
                return (
                  <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getHealthIcon(metric.health_score)}
                      <div>
                        <p className="font-medium">Customer #{metric.customer_id}</p>
                        <p className="text-sm text-muted-foreground">
                          Score: {metric.health_score}/100
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={status.color}>
                        {status.label}
                      </Badge>
                      
                      {metric.risk_factors.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {metric.risk_factors.slice(0, 2).map((factor, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                          {metric.risk_factors.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{metric.risk_factors.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {metric.opportunities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {metric.opportunities.slice(0, 1).map((opportunity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {opportunity}
                            </Badge>
                          ))}
                          {metric.opportunities.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                              +{metric.opportunities.length - 1} opportunities
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerHealthDashboard;
