
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GoogleSignInButton from './GoogleSignInButton';

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
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName || !companyName) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creating user account and company:', { email, fullName, companyName });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
          emailRedirectTo: `${window.location.origin}/auth?verified=true`
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        setError(error.message);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        console.log('Sign up successful, verification email sent');
        
        // Clear form
        setEmail('');
        setPassword('');
        setFullName('');
        setCompanyName('');
        
        // Show verification message and switch to sign in tab
        setShowVerificationMessage(true);
        setActiveTab('signin');
        
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account, then you can sign in.",
        });
      }
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, fullName, companyName, setError, setShowVerificationMessage, setActiveTab, toast]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Full Name *</Label>
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
          <Label htmlFor="company-name">Company Name *</Label>
          <Input
            id="company-name"
            type="text"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email *</Label>
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
          <Label htmlFor="signup-password">Password *</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Choose a password (minimum 6 characters)"
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
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <GoogleSignInButton loading={loading} setLoading={setLoading} setError={setError} />
    </div>
  );
};

export default SignUpForm;
