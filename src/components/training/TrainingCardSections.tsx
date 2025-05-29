
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Lightbulb, ChevronDown, ChevronRight, Wrench } from 'lucide-react';

interface TrainingStep {
  step: number;
  title: string;
  description: string;
  keyPoints: string[];
  safetyNote?: string;
}

interface TrainingCardSectionsProps {
  repairSequence: TrainingStep[];
  criticalPoints: string[];
  commonMistakes: string[];
  toolsRequired: string[];
  expandedSection: string | null;
  onToggleSection: (section: string) => void;
}

const TrainingCardSections = ({ 
  repairSequence, 
  criticalPoints, 
  commonMistakes, 
  toolsRequired,
  expandedSection,
  onToggleSection
}: TrainingCardSectionsProps) => {
  return (
    <div className="space-y-3">
      {/* Repair Sequence */}
      <Collapsible 
        open={expandedSection === 'sequence'}
        onOpenChange={() => onToggleSection('sequence')}
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
            {repairSequence.map((step, index) => (
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
        onOpenChange={() => onToggleSection('critical')}
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
                {criticalPoints.map((point, index) => (
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
                {commonMistakes.map((mistake, index) => (
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
        onOpenChange={() => onToggleSection('tools')}
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
              {toolsRequired.map((tool, index) => (
                <div key={index} className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  <span className="text-sm font-medium break-words">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TrainingCardSections;
