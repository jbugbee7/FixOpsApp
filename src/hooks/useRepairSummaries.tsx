
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface RepairSummary {
  appliance_type: string;
  case_count: number;
  common_issues: string[];
  recent_solutions: string[];
  success_rate: number;
  last_updated: string;
}

export const useRepairSummaries = (user: any) => {
  const [repairSummaries, setRepairSummaries] = useState<RepairSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchRepairSummaries = async () => {
    if (!user) {
      console.log('No user available for fetching data');
      setHasError(true);
      setErrorMessage('Authentication required. Please log in to view your repair data.');
      return;
    }

    try {
      console.log('Starting repair summaries fetch for user:', user.id);
      setHasError(false);
      setErrorMessage('');
      
      // Fetch all cases for the user
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases:', error);
        setHasError(true);
        setErrorMessage(`Database error: ${error.message}`);
        
        // Only show toast for unexpected errors
        if (!error.message?.includes('infinite recursion') && !error.message?.includes('policy')) {
          toast({
            title: "Database Error",
            description: `Failed to fetch repair data: ${error.message}`,
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Successfully fetched cases:', cases?.length || 0);

      if (!cases || cases.length === 0) {
        console.log('No cases found for analysis');
        setRepairSummaries([]);
        return;
      }

      // Group and analyze cases by appliance type
      const summariesByType: { [key: string]: RepairSummary } = {};
      
      cases.forEach(case_ => {
        if (!summariesByType[case_.appliance_type]) {
          summariesByType[case_.appliance_type] = {
            appliance_type: case_.appliance_type,
            case_count: 0,
            common_issues: [],
            recent_solutions: [],
            success_rate: 0,
            last_updated: new Date().toISOString()
          };
        }

        const summary = summariesByType[case_.appliance_type];
        summary.case_count++;

        // Add unique issues and solutions
        if (case_.problem_description && !summary.common_issues.includes(case_.problem_description)) {
          summary.common_issues.push(case_.problem_description);
        }

        if (case_.initial_diagnosis && !summary.recent_solutions.includes(case_.initial_diagnosis)) {
          summary.recent_solutions.push(case_.initial_diagnosis);
        }
      });

      // Calculate success rates and limit arrays
      Object.keys(summariesByType).forEach(type => {
        const typeCases = cases.filter(c => c.appliance_type === type);
        const completedCases = typeCases.filter(c => c.status === 'Completed');
        summariesByType[type].success_rate = typeCases.length > 0 
          ? Math.round((completedCases.length / typeCases.length) * 100)
          : 0;
        
        // Limit arrays to most recent/common items
        summariesByType[type].common_issues = summariesByType[type].common_issues.slice(0, 5);
        summariesByType[type].recent_solutions = summariesByType[type].recent_solutions.slice(0, 3);
      });

      const summaries = Object.values(summariesByType);
      setRepairSummaries(summaries);
      console.log('Analysis complete. Generated summaries for:', Object.keys(summariesByType));
      
    } catch (error: any) {
      console.error('Unexpected error generating repair summaries:', error);
      setHasError(true);
      setErrorMessage(`Unexpected error: ${error.message || 'Unknown error occurred'}`);
      
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred while analyzing your repair data.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshAnalysis = async () => {
    if (refreshing) {
      console.log('Refresh already in progress, ignoring click');
      return;
    }

    console.log('Starting manual refresh analysis');
    setRefreshing(true);
    
    try {
      await fetchRepairSummaries();
      if (!hasError) {
        toast({
          title: "Analysis Updated",
          description: "Your repair data has been refreshed successfully.",
        });
      }
    } catch (error) {
      console.error('Error during manual refresh:', error);
    } finally {
      setRefreshing(false);
      console.log('Manual refresh complete');
    }
  };

  useEffect(() => {
    console.log('useRepairSummaries mounted, fetching initial data');
    fetchRepairSummaries().finally(() => {
      setLoading(false);
    });
  }, [user]);

  return {
    repairSummaries,
    loading,
    refreshing,
    hasError,
    errorMessage,
    handleRefreshAnalysis
  };
};
