
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
      await storeVerificationCode(userId, phoneNumber, newCode);
      await sendVerificationSMS(phoneNumber, newCode);
      
      toast({
        title: "Code Resent",
        description: `A new verification code has been sent to ${phoneNumber}`,
      });
      setCode('');
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="dark:text-slate-100">Verify Your Phone Number</CardTitle>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          We've sent a 6-digit verification code to {phoneNumber}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
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
            {isVerifying ? "Verifying..." : "Verify Phone Number"}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleResendCode}
            disabled={isResending}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? "Resending..." : "Resend Code"}
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Didn't receive the code? Check your messages or try resending.
        </p>
      </CardContent>
    </Card>
  );
};

export default PhoneVerification;
