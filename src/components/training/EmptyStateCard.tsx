
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from 'lucide-react';

const EmptyStateCard = () => {
  return (
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
  );
};

export default EmptyStateCard;
