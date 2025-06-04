import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Play, Calendar, X, Activity, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Case } from '@/types/case';

interface StatusActionsDropdownProps {
  currentCase: Case;
}

const StatusActionsDropdown = ({ currentCase }: StatusActionsDropdownProps) => {
  const { user } = useAuth();
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);

  const statusOptions = [
    { 
      value: 'travel', 
      label: 'Travel', 
      icon: MapPin, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Traveling to appointment' 
    },
    { 
      value: 'active', 
      label: 'Active', 
      icon: Play, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      description: 'Currently working on the job' 
    },
    { 
      value: 'appointment', 
      label: 'Appointment', 
      icon: Calendar, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      description: 'Scheduled appointment' 
    },
    { 
      value: 'cancel', 
      label: 'Cancel', 
      icon: X, 
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
      description: 'Cancel this work order' 
    },
  ];

  const sptOptions = [
    { 
      value: 'Scheduled', 
      label: 'Scheduled', 
      icon: Calendar, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Schedule this work order' 
    },
    { 
      value: 'spr', 
      label: 'SPR', 
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      description: 'Schedule a return visit for parts' 
    },
    { 
      value: 'complete', 
      label: 'Complete', 
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      description: 'Mark work order as complete' 
    },
  ];

  const handleStatusUpdate = async (status: string, reason?: string) => {
    if (!user) return;

    try {
      const updateData: any = { status: status };
      
      if (reason) {
        updateData.cancellation_reason = reason;
      }

      const { error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', currentCase.id)
        .eq('user_id', user.id);

      if (error) throw error;

      if (status === 'cancel' && reason) {
        toast({
          title: "Work Order Cancelled",
          description: "The work order has been cancelled.",
        });
      } else {
        toast({
          title: "Status Updated",
          description: `Work order status updated to ${status}.`,
        });
      }

      // Reload the page to reflect changes in the dashboard tabs
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update work order status.",
        variant: "destructive"
      });
    }
  };

  const handleSPTComplete = async (sptStatus: string) => {
    if (!user) return;

    try {
      const updateData: any = {};
      
      if (sptStatus === 'complete') {
        updateData.spt_status = sptStatus;
        updateData.status = 'Completed';
      } else if (sptStatus === 'spr') {
        updateData.spt_status = sptStatus;
        // SPR should keep the work order in active status, not completed
        updateData.status = 'Scheduled';
      } else if (sptStatus === 'Scheduled') {
        // Handle the moved "Scheduled" option
        updateData.status = 'Scheduled';
        // Clear any existing spt_status when scheduling
        updateData.spt_status = null;
      }

      const { error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', currentCase.id)
        .eq('user_id', user.id);

      if (error) throw error;

      if (sptStatus === 'complete') {
        toast({
          title: "Job Status Updated",
          description: "Work order marked as complete.",
        });
      } else if (sptStatus === 'spr') {
        toast({
          title: "Job Status Updated",
          description: "SPR scheduled.",
        });
      } else if (sptStatus === 'Scheduled') {
        toast({
          title: "Status Updated",
          description: "Work order status updated to Scheduled.",
        });
      }

      // Reload the page to reflect changes in the dashboard tabs
      window.location.reload();
    } catch (error) {
      console.error('Error updating SPR status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === 'cancel') {
      setShowCancellationDialog(true);
    } else {
      handleStatusUpdate(status);
    }
  };

  const handleCancellation = () => {
    if (cancellationReason.trim()) {
      handleStatusUpdate('cancel', cancellationReason);
      setShowCancellationDialog(false);
      setCancellationReason('');
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {/* Status Update Dropdown */}
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
                  onClick={() => handleStatusChange(option.value)}
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

        {/* Job Completion Dropdown */}
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
                  onClick={() => handleSPTComplete(option.value)}
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
      </div>

      {/* Cancellation Dialog */}
      <AlertDialog open={showCancellationDialog} onOpenChange={setShowCancellationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Work Order</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for cancelling this work order. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="cancellationReason">Cancellation Reason</Label>
            <Textarea
              id="cancellationReason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please explain why this work order is being cancelled..."
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancellationDialog(false)}>
              Keep Work Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancellation}
              disabled={!cancellationReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Work Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StatusActionsDropdown;
