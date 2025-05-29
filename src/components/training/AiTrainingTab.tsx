
import { Button } from "@/components/ui/button";
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import { useAiTrainingData } from "@/hooks/useAiTrainingData";
import AiTrainingCard from "./AiTrainingCard";
import ErrorStateCard from "./ErrorStateCard";

interface AiTrainingTabProps {
  user: any;
  onTrainingCardClick: (applianceType: string) => void;
}

const AiTrainingTab = ({ user, onTrainingCardClick }: AiTrainingTabProps) => {
  const {
    trainingData,
    loading,
    refreshing,
    hasError,
    errorMessage,
    handleRefreshTraining
  } = useAiTrainingData(user);

  console.log('AiTrainingTab render:', { 
    userExists: !!user, 
    userId: user?.id, 
    loading, 
    hasError, 
    trainingDataCount: trainingData.length 
  });

  return (
    <div className="w-full max-w-full space-y-4 px-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold dark:text-slate-100 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
          AI Training Center
        </h3>
        <Button onClick={handleRefreshTraining} disabled={loading || refreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
          {refreshing ? 'Generating...' : 'Refresh Training'}
        </Button>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border">
        <div className="flex items-start space-x-3">
          <Bot className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">AI-Powered Training System</h4>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              Our AI analyzes completed work orders to generate comprehensive training materials. 
              Each card provides step-by-step repair sequences, critical safety points, and common mistakes 
              to help technicians learn from real-world repair data.
            </p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <Bot className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600 dark:text-slate-400">AI is analyzing completed repairs...</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Processing work order data to generate training materials...
          </p>
        </div>
      ) : hasError ? (
        <ErrorStateCard 
          errorMessage={errorMessage}
          onRetry={handleRefreshTraining}
          refreshing={refreshing}
        />
      ) : trainingData.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-lg border">
          <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
            No Training Data Available
          </h4>
          <p className="text-slate-500 dark:text-slate-500 mb-4 px-4">
            Complete some work orders first, then our AI will generate training materials based on successful repairs.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-600 px-4">
            Training cards are generated from completed work orders in the system.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-full space-y-6">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Found {trainingData.length} appliance training module{trainingData.length !== 1 ? 's' : ''} based on completed repairs
          </div>
          <div className="space-y-6">
            {trainingData.map((training, index) => (
              <div key={`${training.appliance_type}-${index}`} className="w-full">
                <AiTrainingCard
                  trainingData={training}
                  onCardClick={onTrainingCardClick}
                />
              </div>
            ))}
          </div>
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Training data automatically updates as more work orders are completed
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiTrainingTab;
