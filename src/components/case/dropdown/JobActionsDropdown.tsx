
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle, ChevronDown } from 'lucide-react';
import { sptOptions } from './StatusOptions';
import { Case } from '@/types/case';

interface JobActionsDropdownProps {
  currentCase: Case;
  onSPTComplete: (sptStatus: string) => void;
}

const JobActionsDropdown = ({ currentCase, onSPTComplete }: JobActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Job Actions
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 border shadow-lg z-50">
        <DropdownMenuLabel className="text-sm font-medium">Job Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sptOptions.map((option) => {
          const OptionIcon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSPTComplete(option.value)}
              className={`flex items-center gap-3 p-3 cursor-pointer ${option.bgColor} border-l-4 border-transparent hover:border-current ${
                (currentCase.spt_status === option.value) || 
                (option.value === 'Scheduled' && currentCase.status === 'Scheduled') ? 'border-current' : ''
              }`}
            >
              <OptionIcon className={`h-4 w-4 ${option.color}`} />
              <div className="flex-1">
                <div className={`font-medium text-sm ${option.color}`}>{option.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{option.description}</div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobActionsDropdown;
