
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, ChevronDown } from 'lucide-react';
import { statusOptions } from './StatusOptions';

interface StatusUpdateDropdownProps {
  onStatusChange: (status: string) => void;
}

const StatusUpdateDropdown = ({ onStatusChange }: StatusUpdateDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Update Status
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-slate-800 border shadow-lg z-50">
        <DropdownMenuLabel className="text-sm font-medium">Status Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => {
          const OptionIcon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`flex items-center gap-3 p-3 cursor-pointer ${option.bgColor} border-l-4 border-transparent hover:border-current`}
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

export default StatusUpdateDropdown;
