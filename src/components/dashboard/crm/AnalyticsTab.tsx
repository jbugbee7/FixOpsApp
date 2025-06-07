
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CRMAnalyticsCharts from './analytics/CRMAnalyticsCharts';
import CRMAnalyticsMetrics from './analytics/CRMAnalyticsMetrics';

const AnalyticsTab = () => {
  const { toast } = useToast();

  // Fetch cases data for analytics
  const { data: casesData, isLoading: casesLoading } = useQuery({
    queryKey: ['crm-analytics-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases for analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  // Fetch communication history for analytics
  const { data: communicationData, isLoading: communicationLoading } = useQuery({
    queryKey: ['crm-analytics-communication'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication_history')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching communication data:', error);
        return [];
      }

      return data || [];
    },
  });

  // Fetch customer interactions for analytics
  const { data: interactionsData, isLoading: interactionsLoading } = useQuery({
    queryKey: ['crm-analytics-interactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_interactions')
        .select('*')
        .order('interaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching interactions data:', error);
        return [];
      }

      return data || [];
    },
  });

  const isLoading = casesLoading || communicationLoading || interactionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CRM Analytics</h2>
          <p className="text-muted-foreground">Real-time insights from your customer data</p>
        </div>
      </div>

      <CRMAnalyticsMetrics 
        casesData={casesData || []}
        communicationData={communicationData || []}
        interactionsData={interactionsData || []}
      />

      <CRMAnalyticsCharts 
        casesData={casesData || []}
        communicationData={communicationData || []}
        interactionsData={interactionsData || []}
      />
    </div>
  );
};

export default AnalyticsTab;
