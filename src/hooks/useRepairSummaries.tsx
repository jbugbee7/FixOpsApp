
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
    if (!user?.id) {
      console.log('No user ID available for fetching repair summaries');
      setHasError(true);
      setErrorMessage('Authentication required. Please log in to view your repair data.');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting repair summaries fetch for user:', user.id);
      setHasError(false);
      setErrorMessage('');
      
      // Fetch all cases for the user with proper error handling
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases for repair summaries:', error);
        setHasError(true);
        
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          setErrorMessage('Database configuration issue detected. Please contact support.');
        } else if (error.message.includes('JWTError') || error.message.includes('JWT')) {
          setErrorMessage('Authentication error. Please sign out and sign back in.');
        } else if (error.message.includes('permission denied') || error.code === 'PGRST301') {
          setErrorMessage('Access denied. Please check your permissions.');
        } else {
          setErrorMessage(`Database error: ${error.message}`);
        }
        
        console.log('Setting empty summaries due to error');
        setRepairSummaries([]);
        return;
      }

      console.log('Successfully fetched cases for analysis:', cases?.length || 0);

      if (!cases || cases.length === 0) {
        console.log('No cases found for analysis');
        setRepairSummaries([]);
        setHasError(false);
        return;
      }

      // Group and analyze cases by appliance type
      const summariesByType: { [key: string]: RepairSummary } = {};
      
      cases.forEach(case_ => {
        const applianceType = case_.appliance_type || 'Unknown';
        
        if (!summariesByType[applianceType]) {
          summariesByType[applianceType] = {
            appliance_type: applianceType,
            case_count: 0,
            common_issues: [],
            recent_solutions: [],
            success_rate: 0,
            last_updated: new Date().toISOString()
          };
        }

        const summary = summariesByType[applianceType];
        summary.case_count++;

        // Add unique issues and solutions
        if (case_.problem_description) {
          const issue = case_.problem_description.trim();
          if (issue && !summary.common_issues.includes(issue)) {
            summary.common_issues.push(issue);
          }
        }

        if (case_.initial_diagnosis) {
          const solution = case_.initial_diagnosis.trim();
          if (solution && !summary.recent_solutions.includes(solution)) {
            summary.recent_solutions.push(solution);
          }
        }
      });

      // Calculate success rates and limit arrays
      Object.keys(summariesByType).forEach(type => {
        const typeCases = cases.filter(c => (c.appliance_type || 'Unknown') === type);
        const completedCases = typeCases.filter(c => c.status === 'Completed');
        summariesByType[type].success_rate = typeCases.length > 0 
          ? Math.round((completedCases.length / typeCases.length) * 100)
          : 0;
        
        // Limit arrays to most recent/common items and ensure they're not empty
        summariesByType[type].common_issues = summariesByType[type].common_issues.slice(0, 5);
        summariesByType[type].recent_solutions = summariesByType[type].recent_solutions.slice(0, 3);
        
        // If no solutions found, add a default message
        if (summariesByType[type].recent_solutions.length === 0) {
          summariesByType[type].recent_solutions.push('No diagnostic solutions recorded yet');
        }
        
        // If no issues found, add a default message
        if (summariesByType[type].common_issues.length === 0) {
          summariesByType[type].common_issues.push('No problem descriptions recorded yet');
        }
      });

      const summaries = Object.values(summariesByType);
      setRepairSummaries(summaries);
      console.log('Analysis complete. Generated summaries for appliance types:', Object.keys(summariesByType));
      
    } catch (error: any) {
      console.error('Unexpected error generating repair summaries:', error);
      setHasError(true);
      setErrorMessage(`Unexpected error: ${error.message || 'Unknown error occurred'}`);
      setRepairSummaries([]);
      
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
    console.log('useRepairSummaries mounted, fetching initial data for user:', user?.id);
    fetchRepairSummaries().finally(() => {
      setLoading(false);
    });
  }, [user?.id]); // Only depend on user.id to prevent unnecessary re-fetches

  return {
    repairSummaries,
    loading,
    refreshing,
    hasError,
    errorMessage,
    handleRefreshAnalysis
  };
};
