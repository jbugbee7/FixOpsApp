
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

const CancellationDialog = ({ open, onOpenChange, onConfirm }: CancellationDialogProps) => {
  const [cancellationReason, setCancellationReason] = useState('');

  const handleConfirm = () => {
    if (cancellationReason.trim()) {
      onConfirm(cancellationReason);
      setCancellationReason('');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCancellationReason('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <AlertDialogCancel onClick={handleClose}>
            Keep Work Order
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!cancellationReason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            Cancel Work Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancellationDialog;
