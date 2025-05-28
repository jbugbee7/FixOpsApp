import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Wrench, Lightbulb, ChevronDown, ChevronRight, Bot, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import AiSummaryPage from './AiSummaryPage';

interface RepairSummary {
  appliance_type: string;
  common_issues: string[];
  recent_solutions: string[];
  parts_frequency: { part: string; count: number }[];
}

const TrainingPage = () => {
  const { user } = useAuth();
  const [repairSummaries, setRepairSummaries] = useState<RepairSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppliance, setExpandedAppliance] = useState<string | null>(null);
  const [selectedApplianceForAI, setSelectedApplianceForAI] = useState<string | null>(null);

  const applianceGuides = [
    {
      type: "Refrigerator",
      icon: "❄️",
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
      icon: "🧺",
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
      icon: "🌪️",
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
      icon: "🍽️",
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
      icon: "🔥",
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

  const fetchRepairSummaries = async () => {
    if (!user) return;

    try {
      // Fetch recent cases for AI analysis
      const { data: cases, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching cases:', error);
        return;
      }

      // Generate AI summaries by appliance type
      const summariesByType: { [key: string]: RepairSummary } = {};
      
      cases?.forEach(case_ => {
        if (!summariesByType[case_.appliance_type]) {
          summariesByType[case_.appliance_type] = {
            appliance_type: case_.appliance_type,
            common_issues: [],
            recent_solutions: [],
            parts_frequency: []
          };
        }

        if (case_.problem_description) {
          summariesByType[case_.appliance_type].common_issues.push(case_.problem_description);
        }

        if (case_.initial_diagnosis) {
          summariesByType[case_.appliance_type].recent_solutions.push(case_.initial_diagnosis);
        }
      });

      setRepairSummaries(Object.values(summariesByType));
    } catch (error) {
      console.error('Error generating repair summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async (applianceType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: `Based on the recent repair data for ${applianceType} appliances, provide a brief summary of the most common issues and recommended preventive maintenance steps. Keep it concise and practical for technicians.` 
        }
      });

      if (error) throw error;

      toast({
        title: "AI Summary Generated",
        description: `Generated insights for ${applianceType} repairs.`,
      });

      return data.response;
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast({
        title: "AI Summary Error",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive"
      });
      return null;
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

  const handleInsightCardClick = (applianceType: string) => {
    setSelectedApplianceForAI(applianceType);
  };

  if (selectedApplianceForAI) {
    return (
      <AiSummaryPage 
        applianceType={selectedApplianceForAI}
        onBack={() => setSelectedApplianceForAI(null)}
      />
    );
  }

  useEffect(() => {
    fetchRepairSummaries();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <GraduationCap className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Training Center</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">Interactive appliance troubleshooting guides and repair insights</p>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guides">Troubleshooting Guides</TabsTrigger>
          <TabsTrigger value="insights">AI Repair Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4">
            {applianceGuides.map((appliance, index) => (
              <Card key={index} className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 dark:text-slate-100">
                    <span className="text-2xl">{appliance.icon}</span>
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

        <TabsContent value="insights" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold dark:text-slate-100">AI-Generated Repair Insights</h3>
            <Button onClick={fetchRepairSummaries} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">Loading repair insights...</p>
            </div>
          ) : repairSummaries.length === 0 ? (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="text-center py-8">
                <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No repair data available yet. Complete some work orders to see AI insights.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {repairSummaries.map((summary, index) => (
                <Card 
                  key={index} 
                  className="dark:bg-slate-800 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => handleInsightCardClick(summary.appliance_type)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between dark:text-slate-100">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <span>{summary.appliance_type} Insights</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <Bot className="h-4 w-4 mr-1" />
                        Click to generate AI summary
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summary.common_issues.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Recent Issues:</h4>
                          <div className="flex flex-wrap gap-2">
                            {summary.common_issues.slice(0, 3).map((issue, issueIndex) => (
                              <Badge key={issueIndex} variant="secondary" className="text-xs">
                                {issue.substring(0, 50)}...
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {summary.recent_solutions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Recent Solutions:</h4>
                          <div className="space-y-2">
                            {summary.recent_solutions.slice(0, 3).map((solution, solutionIndex) => (
                              <div key={solutionIndex} className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-4 border-blue-500">
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
      </Tabs>
    </div>
  );
};

export default TrainingPage;
