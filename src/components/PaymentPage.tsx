
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, DollarSign, User, Wrench } from 'lucide-react';
import { Case } from '@/types/case';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PaymentPageProps {
  case: Case;
  caseParts: any[];
  onBack: () => void;
}

const PaymentPage = ({ case: currentCase, caseParts, onBack }: PaymentPageProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const getTotalAmount = () => {
    const laborCost = currentCase.labor_cost_calculated || 0;
    const diagnosticFee = currentCase.diagnostic_fee_amount || 0;
    const partsCost = caseParts.reduce((total, part) => total + (part.final_price * part.quantity), 0);
    return laborCost + diagnosticFee + partsCost;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const totalAmount = getTotalAmount();
      const amountInCents = Math.round(totalAmount * 100);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          amount: amountInCents,
          currency: 'usd',
          case_id: currentCase.id,
          customer_email: currentCase.customer_email,
          customer_name: currentCase.customer_name,
          wo_number: currentCase.wo_number || `WO-${currentCase.id.slice(0, 8)}`
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Error",
          description: "Failed to create payment session. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payment</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentCase.wo_number || `WO-${currentCase.id.slice(0, 8)}`}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Ready for Payment
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Order Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <User className="h-5 w-5" />
                  <span>Customer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Name</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.customer_name}</p>
                </div>
                {currentCase.customer_email && (
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                    <p className="text-lg dark:text-slate-100">{currentCase.customer_email}</p>
                  </div>
                )}
                {currentCase.customer_phone && (
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone</label>
                    <p className="text-lg dark:text-slate-100">{currentCase.customer_phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Wrench className="h-5 w-5" />
                  <span>Service Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Appliance</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.appliance_brand} {currentCase.appliance_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Type</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.service_type || 'Repair Service'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Problem Description</label>
                  <p className="text-lg dark:text-slate-100">{currentCase.problem_description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <DollarSign className="h-5 w-5" />
                  <span>Payment Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Labor Cost */}
                <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Labor Cost (Level {currentCase.labor_level || 0})</span>
                  <span className="font-semibold dark:text-slate-100">${(currentCase.labor_cost_calculated || 0).toFixed(2)}</span>
                </div>

                {/* Diagnostic Fee */}
                {currentCase.diagnostic_fee_amount && currentCase.diagnostic_fee_amount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Diagnostic Fee ({currentCase.diagnostic_fee_type})</span>
                    <span className="font-semibold dark:text-slate-100">${currentCase.diagnostic_fee_amount.toFixed(2)}</span>
                  </div>
                )}

                {/* Parts */}
                {caseParts.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-slate-600 dark:text-slate-400 font-medium">Parts:</div>
                    {caseParts.map((part, index) => (
                      <div key={index} className="flex justify-between items-center py-1 pl-4">
                        <div>
                          <span className="text-sm dark:text-slate-300">{part.part_name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">Qty: {part.quantity}</span>
                        </div>
                        <span className="font-semibold dark:text-slate-100">${(part.final_price * part.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t-2 border-slate-200 dark:border-slate-600">
                  <span className="text-xl font-bold dark:text-slate-100">Total</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">${getTotalAmount().toFixed(2)}</span>
                </div>

                {/* Payment Button */}
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold"
                  disabled={isProcessing || getTotalAmount() <= 0}
                  size="lg"
                >
                  <CreditCard className="h-6 w-6 mr-3" />
                  {isProcessing ? 'Processing...' : `Pay $${getTotalAmount().toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
