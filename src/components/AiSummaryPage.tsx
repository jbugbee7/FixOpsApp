
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AiSummaryPageProps {
  applianceType: string;
  onBack: () => void;
}

const AiSummaryPage = ({ applianceType, onBack }: AiSummaryPageProps) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateAISummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: `Based on the recent repair data for ${applianceType} appliances, provide a comprehensive summary of the most common issues, recommended preventive maintenance steps, and troubleshooting tips. Include specific technical guidance for technicians working on ${applianceType} repairs. Keep it detailed but practical.` 
        }
      });

      if (error) throw error;

      setSummary(data.response);
      toast({
        title: "AI Summary Generated",
        description: `Generated comprehensive insights for ${applianceType} repairs.`,
      });
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast({
        title: "AI Summary Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateAISummary();
  }, [applianceType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Training
            </Button>
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                AI Summary for {applianceType}
              </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <span>AI-Generated Repair Insights</span>
              </div>
              <Button 
                onClick={generateAISummary}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Generating...' : 'Regenerate'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-600 dark:text-slate-400">Generating AI insights for {applianceType}...</p>
              </div>
            ) : summary ? (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {summary}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400">No summary available. Click regenerate to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiSummaryPage;
