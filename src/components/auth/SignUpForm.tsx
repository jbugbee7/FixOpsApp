
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signUpUser } from '@/services/authService';

interface SignUpFormProps {
  error: string;
  setError: (error: string) => void;
  setShowVerificationMessage: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const SignUpForm = ({ error, setError, setShowVerificationMessage, setActiveTab }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const defaultFullName = email.split('@')[0];
      
      const { data, error } = await signUpUser(
        email, 
        password, 
        fullName || defaultFullName, 
        ''
      );

      if (error) {
        setError(typeof error === 'string' ? error : error.message || 'Sign up failed');
        toast({
          title: "Sign Up Failed",
          description: typeof error === 'string' ? error : error.message || 'Sign up failed',
          variant: "destructive",
        });
      } else if (data?.user) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        
        setShowVerificationMessage(true);
        
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: "Error",
        description: err.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, fullName, setError, setShowVerificationMessage, toast]);

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:bg-muted focus:ring-2 focus:ring-accent"
        />
      </div>
      
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 pr-10 focus:bg-muted focus:ring-2 focus:ring-accent"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 pr-10 focus:bg-muted focus:ring-2 focus:ring-accent"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl h-12 text-base shadow-lg"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignUpForm;
