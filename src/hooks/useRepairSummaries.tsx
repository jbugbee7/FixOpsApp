
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
      console.log('=== REPAIR SUMMARIES FETCH START ===');
      console.log('User ID:', user.id);
      console.log('User object:', user);
      
      setHasError(false);
      setErrorMessage('');
      
      // First, let's test basic connection to Supabase
      console.log('Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('cases')
        .select('count')
        .limit(1);
      
      console.log('Connection test result:', { testData, testError });
      
      if (testError) {
        console.error('=== SUPABASE CONNECTION ERROR ===');
        console.error('Error code:', testError.code);
        console.error('Error message:', testError.message);
        console.error('Error details:', testError.details);
        console.error('Error hint:', testError.hint);
        
        setHasError(true);
        
        if (testError.code === '42P17' || testError.message.includes('infinite recursion')) {
          setErrorMessage('Database policy configuration issue detected. This needs to be fixed in the database settings.');
          console.log('=== INFINITE RECURSION DETECTED ===');
        } else if (testError.message.includes('permission denied') || testError.code === 'PGRST301') {
          setErrorMessage('Access denied. Your account may not have proper permissions to view case data.');
          console.log('=== PERMISSION DENIED ===');
        } else if (testError.message.includes('JWTError') || testError.message.includes('JWT')) {
          setErrorMessage('Authentication error. Please sign out and sign back in.');
          console.log('=== JWT ERROR ===');
        } else {
          setErrorMessage(`Database connection error: ${testError.message}`);
          console.log('=== OTHER DATABASE ERROR ===');
        }
        
        setRepairSummaries([]);
        return;
      }
      
      console.log('Supabase connection successful, proceeding with cases fetch...');
      
      // Now fetch cases for the specific user
      console.log('Fetching cases for user:', user.id);
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('=== CASES FETCH RESULT ===');
      console.log('Cases data:', cases);
      console.log('Cases error:', error);
      console.log('Cases count:', cases?.length || 0);

      if (error) {
        console.error('=== CASES FETCH ERROR ===');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
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
        
        setRepairSummaries([]);
        return;
      }

      console.log('Cases fetch successful, processing data...');

      if (!cases || cases.length === 0) {
        console.log('=== NO CASES FOUND ===');
        console.log('User has no cases in the database');
        setRepairSummaries([]);
        setHasError(false);
        return;
      }

      console.log('=== PROCESSING CASES ===');
      console.log('Cases to process:', cases.length);

      // Group and analyze cases by appliance type
      const summariesByType: { [key: string]: RepairSummary } = {};
      
      cases.forEach((case_, index) => {
        console.log(`Processing case ${index + 1}:`, {
          id: case_.id,
          appliance_type: case_.appliance_type,
          problem_description: case_.problem_description,
          status: case_.status
        });
        
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
      console.log('=== FINAL SUMMARIES ===');
      console.log('Generated summaries:', summaries);
      console.log('Appliance types found:', Object.keys(summariesByType));
      
      setRepairSummaries(summaries);
      setHasError(false);
      
    } catch (error: any) {
      console.error('=== UNEXPECTED ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setHasError(true);
      setErrorMessage(`Unexpected error: ${error.message || 'Unknown error occurred'}`);
      setRepairSummaries([]);
      
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred while analyzing your repair data.",
        variant: "destructive",
      });
    } finally {
      console.log('=== REPAIR SUMMARIES FETCH END ===');
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
