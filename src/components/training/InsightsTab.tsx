
import { Button } from "@/components/ui/button";
import { Bot, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';
import { useRepairSummaries } from "@/hooks/useRepairSummaries";
import RepairSummaryCard from "./RepairSummaryCard";
import ErrorStateCard from "./ErrorStateCard";
import EmptyStateCard from "./EmptyStateCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InsightsTabProps {
  user: any;
  onInsightCardClick: (applianceType: string) => void;
}

const InsightsTab = ({ user, onInsightCardClick }: InsightsTabProps) => {
  const {
    repairSummaries,
    loading,
    refreshing,
    hasError,
    errorMessage,
    handleRefreshAnalysis
  } = useRepairSummaries(user);

  console.log('InsightsTab render:', { 
    userExists: !!user, 
    userId: user?.id, 
    loading, 
    hasError, 
    summariesCount: repairSummaries.length 
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold dark:text-slate-100 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          AI Repair Insights
        </h3>
        <Button onClick={handleRefreshAnalysis} disabled={loading || refreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Debug info - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Debug: User ID: {user?.id || 'No user'}, Cases found: {repairSummaries.length}, Loading: {loading.toString()}, Error: {hasError.toString()}
          </AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600 dark:text-slate-400">Analyzing your repair data...</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Fetching cases from database and generating insights...
          </p>
        </div>
      ) : hasError ? (
        <ErrorStateCard 
          errorMessage={errorMessage}
          onRetry={handleRefreshAnalysis}
          refreshing={refreshing}
        />
      ) : repairSummaries.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Found {repairSummaries.length} appliance type{repairSummaries.length !== 1 ? 's' : ''} in your repair history
          </div>
          {repairSummaries.map((summary, index) => (
            <RepairSummaryCard
              key={`${summary.appliance_type}-${index}`}
              summary={summary}
              onCardClick={onInsightCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsTab;
