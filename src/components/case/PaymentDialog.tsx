import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  amount: number;
  workOrderDetails?: {
    customerName?: string;
    applianceType?: string;
    laborCost?: number;
    partsCost?: number;
    totalCost?: number;
  };
}

const PaymentDialog = ({
  open,
  onOpenChange,
  caseId,
  amount,
  workOrderDetails,
}: PaymentDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { caseId, amount },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe Checkout in new tab
        window.open(data.url, "_blank");
        
        toast({
          title: "Redirecting to Payment",
          description: "Please complete payment in the new window.",
        });

        // Close dialog after opening payment
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Work Order Summary */}
          {workOrderDetails && (
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Work Order Summary</h3>
              <div className="space-y-1 text-sm">
                {workOrderDetails.customerName && (
                  <p><span className="font-medium">Customer:</span> {workOrderDetails.customerName}</p>
                )}
                {workOrderDetails.applianceType && (
                  <p><span className="font-medium">Appliance:</span> {workOrderDetails.applianceType}</p>
                )}
              </div>
            </Card>
          )}

          {/* Payment Breakdown */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Payment Breakdown</h3>
            <div className="space-y-1 text-sm">
              {workOrderDetails?.laborCost && (
                <div className="flex justify-between">
                  <span>Labor Cost:</span>
                  <span>${workOrderDetails.laborCost.toFixed(2)}</span>
                </div>
              )}
              {workOrderDetails?.partsCost && (
                <div className="flex justify-between">
                  <span>Parts Cost:</span>
                  <span>${workOrderDetails.partsCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base border-t pt-1 mt-1">
                <span>Total Amount:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <p className="text-sm text-muted-foreground">
            You will be redirected to Stripe to securely process payment. All payment information is encrypted and secure.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
