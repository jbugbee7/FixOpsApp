
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerHealthChart from './CustomerHealthChart';
import HealthMetricsSummary from './health/HealthMetricsSummary';
import HealthMetricsDetails from './health/HealthMetricsDetails';

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
      
      // Transform the data to handle JSON fields properly
      const transformedData = (data || []).map(item => ({
        ...item,
        risk_factors: Array.isArray(item.risk_factors) ? item.risk_factors : 
                     typeof item.risk_factors === 'string' ? JSON.parse(item.risk_factors) : [],
        opportunities: Array.isArray(item.opportunities) ? item.opportunities : 
                      typeof item.opportunities === 'string' ? JSON.parse(item.opportunities) : []
      }));
      
      setMetrics(transformedData);
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

      <HealthMetricsSummary metrics={metrics} />
      <CustomerHealthChart healthMetrics={metrics} />
      <HealthMetricsDetails metrics={metrics} />
    </div>
  );
};

export default CustomerHealthDashboard;
