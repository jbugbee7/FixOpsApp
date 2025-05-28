
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Wrench, ChevronDown, ChevronRight } from 'lucide-react';
import { getLikelihoodColor } from "@/utils/colorUtils";
import { ApplianceGuide } from "@/data/applianceGuides";

interface ApplianceGuideCardProps {
  appliance: ApplianceGuide;
}

const ApplianceGuideCard = ({ appliance }: ApplianceGuideCardProps) => {
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
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
              open={expandedProblem === `${appliance.type}-${problemIndex}`}
              onOpenChange={(open) => setExpandedProblem(open ? `${appliance.type}-${problemIndex}` : null)}
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
                  {expandedProblem === `${appliance.type}-${problemIndex}` ? 
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
  );
};

export default ApplianceGuideCard;
