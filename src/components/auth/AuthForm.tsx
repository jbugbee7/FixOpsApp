
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Wrench, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/fixops-logo.png';

interface AuthFormProps {
  showVerificationMessage: boolean;
  showVerificationSuccess: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowVerificationMessage: (show: boolean) => void;
}

type AuthStep = 'initial' | 'signin' | 'signup';

const AuthForm = ({ 
  showVerificationMessage, 
  showVerificationSuccess, 
  activeTab, 
  setActiveTab, 
  setShowVerificationMessage 
}: AuthFormProps) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Initial landing page
  if (step === 'initial') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-12">
            <img src={logo} alt="FixOps" className="h-20 w-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground">FixOps</h1>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => setStep('signin')}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl h-12 text-base shadow-lg"
            >
              Login
            </Button>
            
            <Button
              onClick={() => setStep('signup')}
              variant="outline"
              className="w-full bg-transparent hover:bg-muted border-2 border-border font-semibold rounded-xl h-12 text-base"
            >
              Sign Up
            </Button>
          </div>

          {/* Continue as guest */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            Continue as guest
          </p>
        </div>
      </div>
    );
  }

  // Login page
  if (step === 'signin') {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome.</h1>
            <p className="text-muted-foreground text-lg">Glad to see you!</p>
          </div>

          {/* Success Messages */}
          {showVerificationSuccess && (
            <Alert className="mb-4 bg-green-500/20 border-green-400/50">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <AlertDescription className="text-green-100 text-sm">
                Email verified! You can now sign in.
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <SignInForm error="" setError={() => {}} />

          {/* Social Login */}
          <div className="mt-6">
            <div className="text-center text-muted-foreground text-sm mb-4">
              Or Login with
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="bg-muted hover:bg-muted/80 border-border h-12 rounded-xl"
              >
                <FcGoogle className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="bg-muted hover:bg-muted/80 border-border h-12 rounded-xl"
                disabled
              >
                <FaFacebook className="h-5 w-5 text-blue-600" />
              </Button>
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => setStep('signup')}
              className="text-accent font-semibold hover:underline"
            >
              Sign Up Now
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Sign up page
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">to get started now!</p>
        </div>

        {/* Success Messages */}
        {showVerificationMessage && (
          <Alert className="mb-4 bg-green-500/20 border-green-400/50">
            <CheckCircle className="h-4 w-4 text-green-300" />
            <AlertDescription className="text-green-100 text-sm">
              Verification email sent! Check your inbox.
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <SignUpForm
          error=""
          setError={() => {}}
          setShowVerificationMessage={setShowVerificationMessage}
          setActiveTab={setActiveTab}
        />

        {/* Social Login */}
        <div className="mt-6">
          <div className="text-center text-muted-foreground text-sm mb-4">
            Or Sign Up with
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="bg-muted hover:bg-muted/80 border-border h-12 rounded-xl"
            >
              <FcGoogle className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="bg-muted hover:bg-muted/80 border-border h-12 rounded-xl"
              disabled
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </div>

        {/* Login link */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Already have an account?{' '}
          <button
            onClick={() => setStep('signin')}
            className="text-accent font-semibold hover:underline"
          >
            Login Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
