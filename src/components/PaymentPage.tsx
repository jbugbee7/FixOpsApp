
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Receipt, Calculator } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Case } from '@/types/case';

interface PaymentPageProps {
  case: Case;
  caseParts: any[];
  onBack: () => void;
}

const PaymentPage = ({ case: caseData, caseParts, onBack }: PaymentPageProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [taxRate] = useState(0.0875); // 8.75% tax rate

  // Calculate costs
  const laborCost = caseData.labor_cost_calculated || 0;
  const diagnosticFee = caseData.diagnostic_fee_amount || 0;
  const partsCost = caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
  const subtotal = laborCost + diagnosticFee + partsCost;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to process payments.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // First, create a payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          case_id: caseData.id,
          user_id: user.id,
          amount: Math.round(subtotal * 100), // Convert to cents
          tax_amount: Math.round(taxAmount * 100), // Convert to cents
          total_amount: Math.round(totalAmount * 100), // Convert to cents
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
        toast({
          title: "Payment Error",
          description: "Failed to create payment record. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          caseId: caseData.id,
          paymentId: paymentData.id,
          amount: Math.round(totalAmount * 100), // Total amount in cents
          description: `Work Order #${caseData.id} - ${caseData.appliance_brand} ${caseData.appliance_type}`,
          customerEmail: caseData.customer_email || user.email
        }
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        toast({
          title: "Payment Error",
          description: "Failed to create payment session. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to Payment",
          description: "Opening Stripe checkout in a new tab...",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Work Order</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payment</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Case #{caseData.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <Receipt className="h-5 w-5" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Customer</h4>
                <p className="text-slate-600 dark:text-slate-400">{caseData.customer_name}</p>
                {caseData.customer_email && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{caseData.customer_email}</p>
                )}
              </div>

              <Separator />

              {/* Appliance Info */}
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Appliance</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  {caseData.appliance_brand} {caseData.appliance_type}
                </p>
                {caseData.appliance_model && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Model: {caseData.appliance_model}</p>
                )}
              </div>

              <Separator />

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Cost Breakdown</h4>
                
                {laborCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Labor (Level {caseData.labor_level})
                    </span>
                    <span className="dark:text-slate-100">${laborCost.toFixed(2)}</span>
                  </div>
                )}

                {diagnosticFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Diagnostic Fee ({caseData.diagnostic_fee_type})
                    </span>
                    <span className="dark:text-slate-100">${diagnosticFee.toFixed(2)}</span>
                  </div>
                )}

                {caseParts.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Parts</span>
                      <span className="dark:text-slate-100">${partsCost.toFixed(2)}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {caseParts.map((part, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">
                            {part.part_name} (x{part.quantity})
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            ${(part.final_price * part.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="dark:text-slate-100">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tax ({(taxRate * 100).toFixed(2)}%)
                  </span>
                  <span className="dark:text-slate-100">${taxAmount.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="dark:text-slate-100">Total</span>
                  <span className="text-green-600 dark:text-green-400">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <CreditCard className="h-5 w-5" />
                <span>Payment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                  <Calculator className="h-5 w-5" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Your payment will be processed securely through Stripe. You'll be redirected to complete the payment.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Payment Summary</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Work Order</span>
                      <span className="dark:text-slate-100">#{caseData.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Amount</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing || totalAmount <= 0}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay ${totalAmount.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  By clicking "Pay", you agree to our terms of service and privacy policy.
                  Your payment information is secured by Stripe.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
