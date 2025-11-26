import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (signature: string, signerName: string) => void;
  title: string;
  workOrderDetails?: {
    customerName?: string;
    applianceType?: string;
    problemDescription?: string;
    laborCost?: number;
    partsCost?: number;
    totalCost?: number;
  };
  showPricing?: boolean;
  showTerms?: boolean;
}

const SignatureDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  workOrderDetails,
  showPricing = false,
  showTerms = false,
}: SignatureDialogProps) => {
  const [signerName, setSignerName] = useState("");
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleConfirm = () => {
    if (sigCanvas.current?.isEmpty()) {
      return;
    }
    if (!signerName.trim()) {
      return;
    }
    const signatureData = sigCanvas.current?.toDataURL();
    onConfirm(signatureData, signerName);
    clearSignature();
    setSignerName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Work Order Details */}
          {workOrderDetails && (
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Work Order Details</h3>
              <div className="space-y-1 text-sm">
                {workOrderDetails.customerName && (
                  <p><span className="font-medium">Customer:</span> {workOrderDetails.customerName}</p>
                )}
                {workOrderDetails.applianceType && (
                  <p><span className="font-medium">Appliance:</span> {workOrderDetails.applianceType}</p>
                )}
                {workOrderDetails.problemDescription && (
                  <p><span className="font-medium">Issue:</span> {workOrderDetails.problemDescription}</p>
                )}
              </div>
            </Card>
          )}

          {/* Pricing Breakdown */}
          {showPricing && workOrderDetails && (
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Pricing Breakdown</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Labor Cost:</span>
                  <span>${(workOrderDetails.laborCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parts Cost:</span>
                  <span>${(workOrderDetails.partsCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-1 mt-1">
                  <span>Total:</span>
                  <span>${(workOrderDetails.totalCost || 0).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Terms and Conditions */}
          {showTerms && (
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Terms and Conditions</h3>
              <div className="text-sm space-y-2 max-h-40 overflow-y-auto">
                <p>By signing below, you agree to the following:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>You authorize the repair work as described above</li>
                  <li>You agree to pay the total amount upon completion</li>
                  <li>Payment is due immediately upon service completion</li>
                  <li>All parts and labor are guaranteed for 90 days</li>
                  <li>You understand that additional issues may be discovered during repair</li>
                  <li>Any additional work requires separate authorization</li>
                </ul>
              </div>
            </Card>
          )}

          {/* Signer Name */}
          <div>
            <Label htmlFor="signerName">Full Name</Label>
            <Input
              id="signerName"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Signature Pad */}
          <div>
            <Label>Signature</Label>
            <div className="border rounded-md bg-background">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: "w-full h-48",
                }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSignature}
              className="mt-2"
            >
              Clear Signature
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!signerName.trim() || sigCanvas.current?.isEmpty()}
          >
            Confirm Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
