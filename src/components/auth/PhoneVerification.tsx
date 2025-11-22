
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from '@/hooks/use-toast';
import { verifyPhoneCode, generateVerificationCode, storeVerificationCode, sendVerificationSMS } from '@/services/phoneVerificationService';
import { Smartphone, RefreshCw } from 'lucide-react';

interface PhoneVerificationProps {
  userId: string;
  phoneNumber: string;
  onVerificationComplete: () => void;
}

const PhoneVerification = ({ userId, phoneNumber, onVerificationComplete }: PhoneVerificationProps) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await verifyPhoneCode(userId, code);
      toast({
        title: "Phone Verified!",
        description: "Your phone number has been successfully verified.",
      });
      onVerificationComplete();
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const newCode = generateVerificationCode();
      await storeVerificationCode(userId, newCode);
      await sendVerificationSMS(newCode);
      
      toast({
        title: "Code Requested",
        description: "A new verification code has been requested from the administrator.",
      });
      setCode('');
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to request new verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-6 w-6 text-white" />
        </div>
        <CardTitle>Verification Required</CardTitle>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Please contact the administrator for your 6-digit verification code
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Your account is registered with phone number: <strong>{phoneNumber}</strong>
            <br />
            The administrator will provide you with a verification code to complete your registration.
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleVerifyCode}
            disabled={isVerifying || code.length !== 6}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleResendCode}
            disabled={isResending}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? "Requesting..." : "Request New Code"}
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Don't have a code? Contact the administrator or request a new one above.
        </p>
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
