
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, Lightbulb, AlertTriangle, Wrench } from 'lucide-react';

interface AiSummaryPageProps {
  applianceType: string;
  onBack: () => void;
}

const AiSummaryPage = ({ applianceType, onBack }: AiSummaryPageProps) => {
  const [loading, setLoading] = useState(false);

  const generateInsights = () => {
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold dark:text-slate-100">
          AI Analysis: {applianceType}
        </h1>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center dark:text-slate-100">
            <Bot className="h-6 w-6 mr-2 text-blue-500" />
            AI-Powered Repair Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <Bot className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 dark:text-slate-100">
              Advanced AI Analysis for {applianceType}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Get personalized repair insights based on your historical data and industry best practices.
            </p>
            <Button onClick={generateInsights} disabled={loading}>
              {loading ? 'Analyzing...' : 'Generate AI Insights'}
            </Button>
          </div>

          {!loading && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    Optimization Tips
                  </h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  AI-generated suggestions to improve your repair efficiency for {applianceType} units.
                </p>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                    Common Pitfalls
                  </h4>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Identify potential issues before they become costly problems.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Wrench className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    Best Practices
                  </h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Industry-leading techniques tailored to your repair patterns.
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Bot className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                    Predictive Analysis
                  </h4>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Forecast repair trends and parts demand for better planning.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AiSummaryPage;
