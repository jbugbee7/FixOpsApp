
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Bot, AlertTriangle, Lightbulb, ChevronDown, ChevronRight, Wrench, Clock, CheckCircle } from 'lucide-react';
import { getSuccessRateColor } from "@/utils/colorUtils";

interface TrainingStep {
  step: number;
  title: string;
  description: string;
  keyPoints: string[];
  safetyNote?: string;
}

interface AiTrainingData {
  appliance_type: string;
  case_count: number;
  success_rate: number;
  common_issues: string[];
  repair_sequence: TrainingStep[];
  critical_points: string[];
  common_mistakes: string[];
  tools_required: string[];
  estimated_time: string;
}

interface AiTrainingCardProps {
  trainingData: AiTrainingData;
  onCardClick: (applianceType: string) => void;
}

const AiTrainingCard = ({ trainingData, onCardClick }: AiTrainingCardProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Card className="w-full max-w-full dark:bg-slate-800 dark:border-slate-700 cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:text-slate-100">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Bot className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-lg block truncate">{trainingData.appliance_type} Repair Training</span>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {trainingData.case_count} Cases
                </Badge>
                <span className={`text-sm font-semibold ${getSuccessRateColor(trainingData.success_rate)}`}>
                  {trainingData.success_rate}% Success
                </span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                  AI Generated
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Interactive Training →
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Based on real repair data
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
            <p className="text-sm font-medium truncate">{trainingData.estimated_time}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Avg Time</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <p className="text-sm font-medium">{trainingData.repair_sequence.length}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Steps</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Wrench className="h-4 w-4 mx-auto mb-1 text-orange-600" />
            <p className="text-sm font-medium">{trainingData.tools_required.length}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tools</p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 mx-auto mb-1 text-purple-600" />
            <p className="text-sm font-medium">{trainingData.critical_points.length}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Critical Points</p>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3">
          {/* Repair Sequence */}
          <Collapsible 
            open={expandedSection === 'sequence'}
            onOpenChange={() => toggleSection('sequence')}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-sm">Step-by-Step Repair Sequence</span>
                </div>
                {expandedSection === 'sequence' ? 
                  <ChevronDown className="h-4 w-4 flex-shrink-0" /> : 
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-4 pl-2">
                {trainingData.repair_sequence.map((step, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                      Step {step.step}: {step.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {step.description}
                    </p>
                    {step.keyPoints.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Key Points:</p>
                        <ul className="text-xs space-y-1">
                          {step.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start space-x-2">
                              <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                              <span className="break-words">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {step.safetyNote && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
                        <p className="text-xs text-red-700 dark:text-red-300">
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          Safety Note: {step.safetyNote}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Critical Points */}
          <Collapsible 
            open={expandedSection === 'critical'}
            onOpenChange={() => toggleSection('critical')}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="font-medium text-sm">Critical Points & Common Mistakes</span>
                </div>
                {expandedSection === 'critical' ? 
                  <ChevronDown className="h-4 w-4 flex-shrink-0" /> : 
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="grid lg:grid-cols-2 gap-4 pl-2">
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 text-sm">Critical Points:</h4>
                  <ul className="space-y-2">
                    {trainingData.critical_points.map((point, index) => (
                      <li key={index} className="text-sm flex items-start space-x-2">
                        <span className="text-red-500 mt-1 flex-shrink-0">⚠️</span>
                        <span className="break-words">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 text-sm">Common Mistakes:</h4>
                  <ul className="space-y-2">
                    {trainingData.common_mistakes.map((mistake, index) => (
                      <li key={index} className="text-sm flex items-start space-x-2">
                        <span className="text-orange-500 mt-1 flex-shrink-0">❌</span>
                        <span className="break-words">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Tools & Equipment */}
          <Collapsible 
            open={expandedSection === 'tools'}
            onOpenChange={() => toggleSection('tools')}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                <div className="flex items-center space-x-3">
                  <Wrench className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium text-sm">Required Tools & Equipment</span>
                </div>
                {expandedSection === 'tools' ? 
                  <ChevronDown className="h-4 w-4 flex-shrink-0" /> : 
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="pl-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {trainingData.tools_required.map((tool, index) => (
                    <div key={index} className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <span className="text-sm font-medium break-words">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={() => onCardClick(trainingData.appliance_type)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Bot className="h-4 w-4 mr-2" />
            Get AI-Powered Detailed Training
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTrainingCard;
