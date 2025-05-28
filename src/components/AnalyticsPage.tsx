
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

const AnalyticsPage = () => {
  const performanceMetrics = [
    { label: "Cases Completed", value: "47", change: "+12%", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
    { label: "Avg. Response Time", value: "1.2h", change: "-8%", icon: <Clock className="h-5 w-5 text-blue-500" /> },
    { label: "Customer Satisfaction", value: "4.8/5", change: "+0.3", icon: <TrendingUp className="h-5 w-5 text-purple-500" /> },
    { label: "First-Time Fix Rate", value: "89%", change: "+5%", icon: <BarChart3 className="h-5 w-5 text-orange-500" /> },
  ];

  const improvementAreas = [
    {
      title: "Diagnostic Accuracy",
      description: "FixBot suggests practicing with refrigeration systems diagnostics",
      severity: "medium",
      aiSuggestion: "Based on recent cases, consider reviewing compressor troubleshooting procedures. FixBot recommends completing the advanced refrigeration course."
    },
    {
      title: "Parts Identification",
      description: "Improvement needed in washing machine component recognition",
      severity: "low",
      aiSuggestion: "FixBot analysis shows 15% slower identification time for washing machine parts. Suggested training: Use FixBot's visual part identification feature more frequently."
    },
    {
      title: "Time Management",
      description: "Opportunity to optimize repair sequencing",
      severity: "high",
      aiSuggestion: "FixBot detected inefficient task ordering in 23% of cases. Recommendation: Follow FixBot's suggested repair workflow for better time management."
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'low': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Performance Analytics</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">Track your progress and get AI-powered insights from FixBot</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="dark:bg-slate-800 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  {metric.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metric.value}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{metric.label}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{metric.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FixBot AI Insights */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>FixBot AI Insights</span>
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Personalized recommendations for skill improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {improvementAreas.map((area, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${getSeverityColor(area.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{area.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    area.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                    area.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  }`}>
                    {area.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{area.description}</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>FixBot Recommendation:</strong> {area.aiSuggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Progress */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Monthly Progress</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Your improvement trajectory with FixBot assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="font-medium dark:text-slate-100">Cases Resolved Independently</span>
              <span className="text-2xl font-bold text-green-600">73%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="font-medium dark:text-slate-100">FixBot Consultations</span>
              <span className="text-2xl font-bold text-blue-600">27</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <span className="font-medium dark:text-slate-100">Skill Improvement Score</span>
              <span className="text-2xl font-bold text-purple-600">+18%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
