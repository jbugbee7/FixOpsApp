
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Play, Calendar, X } from 'lucide-react';

interface StatusUpdateFlowProps {
  onStatusUpdate: (status: string, reason?: string) => void;
  onSPTComplete: (sptStatus: string) => void;
  currentStatus: string;
  sptStatus?: string;
}

const StatusUpdateFlow = ({ onStatusUpdate, onSPTComplete, currentStatus, sptStatus }: StatusUpdateFlowProps) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);

  const statusOptions = [
    { value: 'travel', label: 'Travel', icon: MapPin, description: 'Traveling to appointment' },
    { value: 'active', label: 'Active', icon: Play, description: 'Currently working on the job' },
    { value: 'appointment', label: 'Appointment', icon: Calendar, description: 'Scheduled appointment' },
    { value: 'cancel', label: 'Cancel', icon: X, description: 'Cancel this work order' },
  ];

  const sptOptions = [
    { value: 'spt', label: 'SPT (Scheduled Part Return)', description: 'Schedule a return visit for parts' },
    { value: 'complete', label: 'Complete', description: 'Mark work order as complete' },
  ];

  const handleStatusChange = (status: string) => {
    if (status === 'cancel') {
      setShowCancellationDialog(true);
    } else {
      onStatusUpdate(status);
    }
  };

  const handleCancellation = () => {
    if (cancellationReason.trim()) {
      onStatusUpdate('cancel', cancellationReason);
      setShowCancellationDialog(false);
      setCancellationReason('');
    }
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="dark:text-slate-100">Work Order Status & Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div>
          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Status</Label>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
            {currentStatus}
          </div>
        </div>

        {/* Status Update */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Update Status</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant="outline"
                  onClick={() => handleStatusChange(option.value)}
                  className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* SPT/Complete Options */}
        {(currentStatus === 'active' || currentStatus === 'In Progress') && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Job Completion</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sptOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sptStatus === option.value ? "default" : "outline"}
                  onClick={() => onSPTComplete(option.value)}
                  className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                >
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-slate-500">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            {sptStatus && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Selected: {sptOptions.find(opt => opt.value === sptStatus)?.label}
              </div>
            )}
          </div>
        )}

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
    </Card>
  );
};

export default StatusUpdateFlow;
