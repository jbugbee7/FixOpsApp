
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateVerificationCode, storeVerificationCode, sendVerificationSMS } from '@/services/phoneVerificationService';
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add +1 if it's a 10-digit US number
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    // Add + if it doesn't start with it
    if (cleaned.length > 10 && !phone.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return phone;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: formattedPhone,
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
        await storeVerificationCode(data.user.id, formattedPhone, verificationCode);
        await sendVerificationSMS(formattedPhone, verificationCode);

        // Show phone verification step
        setUserId(data.user.id);
        setShowPhoneVerification(true);
        
        toast({
          title: "Account Created!",
          description: `Verification code sent to ${formattedPhone}. Please verify your phone number to continue.`,
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
    setPhoneNumber('');
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
        phoneNumber={formatPhoneNumber(phoneNumber)}
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
          <Label htmlFor="signup-phone">Phone Number</Label>
          <Input
            id="signup-phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            disabled={loading}
          />
          <p className="text-xs text-slate-500">
            Include country code (e.g., +1 for US numbers)
          </p>
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
