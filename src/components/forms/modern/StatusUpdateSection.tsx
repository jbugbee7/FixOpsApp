
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MapPin, Play, Calendar, X, Activity } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Case } from '@/types/case';

interface StatusUpdateSectionProps {
  currentCase: Case;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const StatusUpdateSection = ({ currentCase, expanded, onToggle, icon: Icon }: StatusUpdateSectionProps) => {
  const { user } = useAuth();
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState('status');

  const statusOptions = [
    { value: 'travel', label: 'Travel', icon: MapPin, description: 'Traveling to appointment' },
    { value: 'active', label: 'Active', icon: Play, description: 'Currently working on the job' },
    { value: 'appointment', label: 'Appointment', icon: Calendar, description: 'Scheduled appointment' },
    { value: 'cancel', label: 'Cancel', icon: X, description: 'Cancel this work order' },
  ];

  const sptOptions = [
    { value: 'spt', label: 'SPT', description: 'Schedule a return visit for parts' },
    { value: 'complete', label: 'Complete', description: 'Mark work order as complete' },
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
      const updateData: any = { spt_status: sptStatus };
      
      if (sptStatus === 'complete') {
        updateData.status = 'Completed';
      }

      const { error } = await supabase
        .from('cases')
        .update(updateData)
        .eq('id', currentCase.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Job Status Updated",
        description: sptStatus === 'complete' ? "Work order marked as complete." : "SPT scheduled.",
      });
    } catch (error) {
      console.error('Error updating SPT status:', error);
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
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="status">Status Update</TabsTrigger>
              <TabsTrigger value="completion">Job Completion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="mt-4">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Update Status</Label>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        variant="outline"
                        onClick={() => handleStatusChange(option.value)}
                        className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                      >
                        <OptionIcon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-slate-500">{option.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="completion" className="mt-4">
              <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Job Completion</Label>
                <div className="grid grid-cols-2 gap-3">
                  {sptOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={currentCase.spt_status === option.value ? "default" : "outline"}
                      onClick={() => handleSPTComplete(option.value)}
                      className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-slate-500">{option.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
                {currentCase.spt_status && (
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Selected: {sptOptions.find(opt => opt.value === currentCase.spt_status)?.label}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

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
        </CardContent>
      )}
    </Card>
  );
};

export default StatusUpdateSection;
