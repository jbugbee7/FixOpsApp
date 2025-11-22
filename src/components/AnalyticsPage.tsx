
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Lightbulb, Target, Activity, Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AnalyticsPage = () => {
  const isMobile = useIsMobile();
  
  const performanceMetrics = [
    { label: "Cases Completed", value: "47", change: "+12%", icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
    { label: "Avg. Response Time", value: "1.2h", change: "-8%", icon: <Clock className="h-5 w-5 text-blue-500" /> },
    { label: "Customer Satisfaction", value: "4.8/5", change: "+0.3", icon: <TrendingUp className="h-5 w-5 text-purple-500" /> },
    { label: "First-Time Fix Rate", value: "89%", change: "+5%", icon: <BarChart3 className="h-5 w-5 text-orange-500" /> },
  ];

  const improvementAreas = [
    {
      title: "Diagnostic Accuracy",
      severity: "medium",
      aiSuggestion: "Based on recent cases, consider reviewing compressor troubleshooting procedures. FixBot recommends completing the advanced refrigeration course."
    },
    {
      title: "Parts Identification",
      severity: "low",
      aiSuggestion: "FixBot analysis shows 15% slower identification time for washing machine parts. Suggested training: Use FixBot's visual part identification feature more frequently."
    },
    {
      title: "Time Management",
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

  // Mobile view (keep existing simple design)
  if (isMobile) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Analytics</h2>
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
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 dark:text-slate-100">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>FixBot AI Insights</span>
            </CardTitle>
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
          <CardHeader className="text-center">
            <CardTitle className="dark:text-slate-100">Monthly Progress</CardTitle>
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
  }

  // Desktop view (new detailed design)
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-3xl p-8 border border-border/50">
          <div className="flex items-center gap-4 mb-2">
            <BarChart3 className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold">Performance Analytics</h1>
          </div>
          <p className="text-muted-foreground">Track your performance, identify improvement areas, and grow your skills</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Performance Metrics Grid */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics from your recent work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        {metric.icon}
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          metric.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 
                          'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                      <div className="text-3xl font-bold mb-1">{metric.value}</div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <CardTitle>FixBot AI Insights</CardTitle>
                </div>
                <CardDescription>Personalized recommendations to improve your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {improvementAreas.map((area, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl border ${getSeverityColor(area.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">{area.title}</h4>
                        <Badge variant={
                          area.severity === 'high' ? 'destructive' :
                          area.severity === 'medium' ? 'default' : 'secondary'
                        }>
                          {area.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm">
                          <strong className="text-blue-800 dark:text-blue-300">FixBot Recommendation:</strong>
                          <span className="text-blue-700 dark:text-blue-400 ml-1">{area.aiSuggestion}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="col-span-4 space-y-6">
            {/* Monthly Progress */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Your growth this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      +5%
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-1">73%</div>
                  <p className="text-sm text-muted-foreground">Cases Resolved Independently</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <Badge variant="secondary">27</Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">27</div>
                  <p className="text-sm text-muted-foreground">FixBot Consultations</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                      +18%
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-1">+18%</div>
                  <p className="text-sm text-muted-foreground">Skill Improvement</p>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle>Current Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Improve response time</span>
                    <Badge>80%</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-4/5"></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">First-time fix rate</span>
                    <Badge>65%</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-2/3"></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Customer satisfaction</span>
                    <Badge>90%</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[90%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
