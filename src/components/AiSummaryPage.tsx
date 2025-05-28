
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, RefreshCw, TrendingUp, AlertTriangle, Wrench } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface AiSummaryPageProps {
  applianceType: string;
  onBack: () => void;
}

interface RepairData {
  cases: any[];
  commonIssues: string[];
  recentSolutions: string[];
  avgResolutionTime: string;
  successRate: string;
}

const AiSummaryPage = ({ applianceType, onBack }: AiSummaryPageProps) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<string>('');
  const [repairData, setRepairData] = useState<RepairData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRepairData = async () => {
    if (!user) return null;

    try {
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .eq('appliance_type', applianceType)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const totalCases = cases?.length || 0;
      const completedCases = cases?.filter(c => c.status === 'Completed') || [];
      const successRate = totalCases > 0 ? Math.round((completedCases.length / totalCases) * 100) : 0;

      const commonIssues = cases?.map(c => c.problem_description).filter(Boolean) || [];
      const recentSolutions = cases?.map(c => c.initial_diagnosis).filter(Boolean) || [];

      return {
        cases: cases || [],
        commonIssues: [...new Set(commonIssues)].slice(0, 10),
        recentSolutions: [...new Set(recentSolutions)].slice(0, 10),
        avgResolutionTime: "2.3 days", // Could be calculated from actual data
        successRate: `${successRate}%`
      };
    } catch (error) {
      console.error('Error fetching repair data:', error);
      return null;
    }
  };

  const generateAISummary = async () => {
    setLoading(true);
    try {
      const data = await fetchRepairData();
      setRepairData(data);

      if (!data || data.cases.length === 0) {
        setSummary(`No repair data available for ${applianceType} appliances yet. Once you complete some work orders for this appliance type, I'll be able to provide detailed insights and recommendations.`);
        return;
      }

      const contextMessage = `
Analyze the following repair data for ${applianceType} appliances and provide a comprehensive summary:

REPAIR STATISTICS:
- Total Cases: ${data.cases.length}
- Success Rate: ${data.successRate}
- Average Resolution Time: ${data.avgResolutionTime}

COMMON ISSUES (${data.commonIssues.length} unique problems):
${data.commonIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

RECENT SOLUTIONS:
${data.recentSolutions.map((solution, i) => `${i + 1}. ${solution}`).join('\n')}

CASE DETAILS:
${data.cases.slice(0, 10).map(c => `
- ${c.customer_name}: ${c.problem_description} 
  Status: ${c.status}
  Brand: ${c.appliance_brand}
  ${c.initial_diagnosis ? `Solution: ${c.initial_diagnosis}` : ''}
`).join('\n')}

Please provide:
1. Top 3 most common failure patterns
2. Preventive maintenance recommendations
3. Troubleshooting workflow for technicians
4. Parts that fail most frequently
5. Best practices based on successful repairs
6. Time-saving tips for diagnostics
7. Customer communication suggestions

Format the response with clear sections and actionable insights for appliance repair technicians.`;

      const { data: aiResponse, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: contextMessage }
      });

      if (error) throw error;

      setSummary(aiResponse.response);
      toast({
        title: "AI Analysis Complete",
        description: `Generated comprehensive insights from ${data.cases.length} ${applianceType} repair cases.`,
      });
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast({
        title: "Analysis Error",
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
                AI Analysis: {applianceType}
              </h1>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Overview Cards */}
        {repairData && repairData.cases.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{repairData.cases.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{repairData.successRate}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{repairData.commonIssues.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Unique Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{repairData.avgResolutionTime}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Avg Resolution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Analysis */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <span>AI-Generated Repair Analysis</span>
              </div>
              <Button 
                onClick={generateAISummary}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Analyzing...' : 'Regenerate'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-600 dark:text-slate-400">
                  Analyzing {repairData?.cases.length || 0} repair cases for {applianceType}...
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Identifying patterns, common issues, and generating recommendations
                </p>
              </div>
            ) : summary ? (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {summary}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-400">No analysis available. Click regenerate to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Raw Data Section */}
        {repairData && repairData.cases.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-slate-100">Common Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {repairData.commonIssues.slice(0, 5).map((issue, index) => (
                    <div key={index} className="p-2 bg-slate-50 dark:bg-slate-700 rounded text-sm">
                      {issue}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-slate-100">Recent Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {repairData.recentSolutions.slice(0, 5).map((solution, index) => (
                    <div key={index} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm border-l-4 border-blue-500">
                      {solution}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSummaryPage;
