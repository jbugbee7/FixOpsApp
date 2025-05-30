
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Case } from '@/types/case';
import StatusActionsDropdown from '../../case/StatusActionsDropdown';

interface StatusUpdateSectionProps {
  currentCase: Case;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const StatusUpdateSection = ({ currentCase, expanded, onToggle, icon: Icon }: StatusUpdateSectionProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Status & Actions</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
              Current: {currentCase.status}
            </span>
            <Icon className="h-5 w-5" />
          </div>
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="animate-fade-in">
          <StatusActionsDropdown currentCase={currentCase} />
        </CardContent>
      )}
    </Card>
  );
};

export default StatusUpdateSection;
