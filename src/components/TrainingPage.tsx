import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Wrench, Lightbulb, ChevronDown, ChevronRight, Bot, RefreshCw, BarChart3, AlertTriangle, Database } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from "@/hooks/use-toast";
import AiSummaryPage from './AiSummaryPage';

interface RepairSummary {
  appliance_type: string;
  case_count: number;
  common_issues: string[];
  recent_solutions: string[];
  success_rate: number;
  last_updated: string;
}

const TrainingPage = () => {
  const { user } = useAuth();
  const { company } = useCompany();
  const [repairSummaries, setRepairSummaries] = useState<RepairSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedAppliance, setExpandedAppliance] = useState<string | null>(null);
  const [selectedApplianceForAI, setSelectedApplianceForAI] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchRepairSummaries = async () => {
    if (!user || !company) {
      console.log('No user or company available for fetching data');
      setHasError(true);
      setErrorMessage('Authentication required. Please log in to view your repair data.');
      return;
    }

    try {
      console.log('Starting repair summaries fetch for company:', company.id);
      setHasError(false);
      setErrorMessage('');
      
      // Fetch all cases for the company
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .eq('company_id', company.id)
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

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'Very High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleInsightCardClick = (applianceType: string) => {
    setSelectedApplianceForAI(applianceType);
  };

  useEffect(() => {
    console.log('TrainingPage mounted, fetching initial data');
    fetchRepairSummaries().finally(() => {
      setLoading(false);
    });
  }, [user, company]);

  const applianceGuides = [
    {
      type: "Refrigerator",
      commonProblems: [
        {
          problem: "Not Cooling",
          likelihood: "Very High",
          firstSteps: [
            "Check power supply and circuit breaker",
            "Verify temperature settings (should be 37-40°F)",
            "Clean condenser coils (back or bottom)",
            "Check door seals for air leaks",
            "Listen for compressor operation"
          ],
          possibleCauses: ["Dirty coils", "Faulty thermostat", "Compressor issues", "Refrigerant leak"]
        },
        {
          problem: "Water Leaking",
          likelihood: "High",
          firstSteps: [
            "Check drain pan under unit",
            "Clear drain tube blockage",
            "Inspect water filter connections",
            "Check ice maker water lines"
          ],
          possibleCauses: ["Blocked drain", "Damaged water lines", "Faulty ice maker"]
        },
        {
          problem: "Strange Noises",
          likelihood: "Medium",
          firstSteps: [
            "Identify noise location (compressor, fan, ice maker)",
            "Check for loose items inside",
            "Inspect fan blades for obstructions",
            "Level the refrigerator"
          ],
          possibleCauses: ["Fan motor issues", "Compressor problems", "Loose components"]
        }
      ]
    },
    {
      type: "Washing Machine",
      commonProblems: [
        {
          problem: "Won't Drain",
          likelihood: "Very High",
          firstSteps: [
            "Check for clogs in drain hose",
            "Inspect pump filter for debris",
            "Verify drain hose isn't kinked",
            "Test lid switch operation"
          ],
          possibleCauses: ["Clogged pump", "Faulty drain pump", "Blocked drain hose"]
        },
        {
          problem: "Won't Spin",
          likelihood: "High",
          firstSteps: [
            "Check load balance",
            "Inspect drive belt",
            "Test lid switch",
            "Examine motor coupling"
          ],
          possibleCauses: ["Unbalanced load", "Broken belt", "Motor issues"]
        },
        {
          problem: "Leaking Water",
          likelihood: "Medium",
          firstSteps: [
            "Check hose connections",
            "Inspect door seal",
            "Examine water pump",
            "Check for overloading"
          ],
          possibleCauses: ["Worn seals", "Loose connections", "Damaged hoses"]
        }
      ]
    },
    {
      type: "Dryer",
      commonProblems: [
        {
          problem: "Not Heating",
          likelihood: "Very High",
          firstSteps: [
            "Check lint filter and clean thoroughly",
            "Inspect exhaust vent for blockages",
            "Test heating element continuity",
            "Verify gas supply (gas dryers)"
          ],
          possibleCauses: ["Clogged vent", "Faulty heating element", "Bad thermostat"]
        },
        {
          problem: "Takes Too Long",
          likelihood: "High",
          firstSteps: [
            "Clean lint filter",
            "Check exhaust vent",
            "Reduce load size",
            "Inspect moisture sensor"
          ],
          possibleCauses: ["Poor airflow", "Faulty sensors", "Overloading"]
        }
      ]
    },
    {
      type: "Dishwasher",
      commonProblems: [
        {
          problem: "Not Cleaning Properly",
          likelihood: "High",
          firstSteps: [
            "Check spray arm for clogs",
            "Clean filter assembly",
            "Verify water temperature (120°F)",
            "Inspect detergent dispenser"
          ],
          possibleCauses: ["Clogged spray arms", "Dirty filter", "Water temperature issues"]
        },
        {
          problem: "Not Draining",
          likelihood: "Medium",
          firstSteps: [
            "Check garbage disposal (if connected)",
            "Inspect drain hose",
            "Clean filter",
            "Check for food debris"
          ],
          possibleCauses: ["Clogged drain", "Faulty pump", "Blocked filter"]
        }
      ]
    },
    {
      type: "Oven",
      commonProblems: [
        {
          problem: "Not Heating",
          likelihood: "High",
          firstSteps: [
            "Check circuit breaker",
            "Test bake and broil elements",
            "Verify thermostat operation",
            "Inspect igniter (gas ovens)"
          ],
          possibleCauses: ["Faulty heating element", "Bad thermostat", "Igniter issues"]
        },
        {
          problem: "Uneven Cooking",
          likelihood: "Medium",
          firstSteps: [
            "Check rack positioning",
            "Test temperature accuracy",
            "Inspect door seal",
            "Calibrate thermostat"
          ],
          possibleCauses: ["Poor air circulation", "Temperature calibration", "Damaged seals"]
        }
      ]
    }
  ];

  if (selectedApplianceForAI) {
    return (
      <AiSummaryPage 
        applianceType={selectedApplianceForAI}
        onBack={() => setSelectedApplianceForAI(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <GraduationCap className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Training Center</h2>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">AI Repair Insights</TabsTrigger>
          <TabsTrigger value="guides">Troubleshooting Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold dark:text-slate-100 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Data Insights
            </h3>
            <Button onClick={handleRefreshAnalysis} disabled={loading || refreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-600 dark:text-slate-400">Analyzing your repair data...</p>
            </div>
          ) : hasError ? (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="text-center py-12">
                <Database className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Data Access Issue
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {errorMessage || 'Unable to access your repair data at this time.'}
                </p>
                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-500 mb-4">
                  <p>This could be due to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Database connectivity issues</li>
                    <li>Authentication problems</li>
                    <li>Row-level security policies</li>
                  </ul>
                </div>
                <Button onClick={handleRefreshAnalysis} disabled={refreshing} variant="outline">
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : repairSummaries.length === 0 ? (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Start Building Your Knowledge Base
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Complete some work orders to unlock AI-powered insights based on your actual repair data.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  The more cases you complete, the better the AI insights become!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {repairSummaries.map((summary, index) => (
                <Card 
                  key={index} 
                  className="dark:bg-slate-800 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-l-blue-500"
                  onClick={() => handleInsightCardClick(summary.appliance_type)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between dark:text-slate-100">
                      <div className="flex items-center space-x-3">
                        <Bot className="h-6 w-6 text-blue-500" />
                        <div>
                          <span className="text-lg">{summary.appliance_type} Analysis</span>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {summary.case_count} Cases
                            </Badge>
                            <span className={`text-sm font-semibold ${getSuccessRateColor(summary.success_rate)}`}>
                              {summary.success_rate}% Success Rate
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          Click for AI Analysis →
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Powered by your repair data
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {summary.common_issues.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                            Most Common Issues
                          </h4>
                          <div className="space-y-2">
                            {summary.common_issues.slice(0, 3).map((issue, issueIndex) => (
                              <div key={issueIndex} className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded border-l-4 border-orange-500 text-sm">
                                {issue}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {summary.recent_solutions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                            <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
                            Successful Solutions
                          </h4>
                          <div className="space-y-2">
                            {summary.recent_solutions.slice(0, 3).map((solution, solutionIndex) => (
                              <div key={solutionIndex} className="p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500 text-sm">
                                {solution}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4">
            {applianceGuides.map((appliance, index) => (
              <Card key={index} className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 dark:text-slate-100">
                    <span>{appliance.type}</span>
                    <Badge variant="outline">{appliance.commonProblems.length} Common Issues</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appliance.commonProblems.map((problem, problemIndex) => (
                      <Collapsible 
                        key={problemIndex}
                        open={expandedAppliance === `${appliance.type}-${problemIndex}`}
                        onOpenChange={(open) => setExpandedAppliance(open ? `${appliance.type}-${problemIndex}` : null)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-between p-4 h-auto bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600"
                          >
                            <div className="flex items-center space-x-3">
                              <Wrench className="h-4 w-4" />
                              <span className="font-medium">{problem.problem}</span>
                              <Badge className={getLikelihoodColor(problem.likelihood)}>
                                {problem.likelihood}
                              </Badge>
                            </div>
                            {expandedAppliance === `${appliance.type}-${problemIndex}` ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                          <div className="grid md:grid-cols-2 gap-4 pl-4">
                            <div>
                              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">First Steps:</h4>
                              <ul className="space-y-1">
                                {problem.firstSteps.map((step, stepIndex) => (
                                  <li key={stepIndex} className="text-sm flex items-start space-x-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Possible Causes:</h4>
                              <ul className="space-y-1">
                                {problem.possibleCauses.map((cause, causeIndex) => (
                                  <li key={causeIndex} className="text-sm flex items-start space-x-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{cause}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingPage;
