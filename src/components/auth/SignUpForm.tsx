
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateVerificationCode, storeVerificationCode, sendVerificationSMS, getFixedPhoneNumber } from '@/services/phoneVerificationService';
import GoogleSignInButton from './GoogleSignInButton';
import PhoneVerification from './PhoneVerification';

interface SignUpFormProps {
  error: string;
  setError: (error: string) => void;
  setShowVerificationMessage: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const SignUpForm = ({ error, setError, setShowVerificationMessage, setActiveTab }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fixedPhoneNumber = getFixedPhoneNumber();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: fixedPhoneNumber,
          }
        }
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Generate and send verification code
        const verificationCode = generateVerificationCode();
        await storeVerificationCode(data.user.id, verificationCode);
        await sendVerificationSMS(verificationCode);

        // Show phone verification step
        setUserId(data.user.id);
        setShowPhoneVerification(true);
        
        toast({
          title: "Account Created!",
          description: `A verification code has been sent to the admin. Please wait for the code to be provided to you.`,
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerificationComplete = () => {
    // Clear form
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPhoneVerification(false);
    setUserId(null);
    
    // Show verification message and switch to sign in tab
    setShowVerificationMessage(true);
    setActiveTab('signin');
    
    toast({
      title: "Registration Complete!",
      description: "Your account has been created and phone number verified. You can now sign in.",
    });
  };

  if (showPhoneVerification && userId) {
    return (
      <PhoneVerification
        userId={userId}
        phoneNumber={fixedPhoneNumber}
        onVerificationComplete={handlePhoneVerificationComplete}
      />
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
        </div>
        
        {/* Info about phone verification */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Phone verification will be handled by the administrator. You'll receive a verification code to complete your registration.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <GoogleSignInButton loading={loading} setLoading={setLoading} setError={setError} />
    </div>
  );
};

export default SignUpForm;
