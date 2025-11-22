
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  isBiometricSupported,
  isBiometricSetup,
  registerBiometric,
  authenticateWithBiometric,
  saveCredentials,
  getSavedCredentials,
  clearSavedCredentials,
} from '@/utils/biometricAuth';

interface SignInFormProps {
  error: string;
  setError: (error: string) => void;
}

const SignInForm = ({ error, setError }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricSetup, setBiometricSetup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check biometric availability on mount
  useEffect(() => {
    setBiometricAvailable(isBiometricSupported());
    setBiometricSetup(isBiometricSetup());
    
    // Load saved credentials if available
    const saved = getSavedCredentials();
    if (saved) {
      setEmail(saved.email);
      setPassword(saved.password);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and click the verification link before signing in.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user && data.session) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          saveCredentials(email, password);
          
          // Offer to set up biometric if not already done
          if (biometricAvailable && !biometricSetup) {
            try {
              await registerBiometric(email);
              setBiometricSetup(true);
              toast({
                title: "Biometric Login Enabled",
                description: "You can now use Face ID/Touch ID to sign in",
              });
            } catch (err) {
              console.log('Biometric setup skipped or failed');
            }
          }
        } else {
          clearSavedCredentials();
        }
        
        navigate('/', { replace: true });
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, rememberMe, biometricAvailable, biometricSetup, setError, navigate, toast]);

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Authenticate with biometric
      const authenticatedEmail = await authenticateWithBiometric();
      
      if (!authenticatedEmail) {
        setError('Biometric authentication failed');
        return;
      }

      // Get saved credentials for this email
      const saved = getSavedCredentials();
      if (!saved || saved.email !== authenticatedEmail) {
        setError('No saved credentials found');
        return;
      }

      // Sign in with saved credentials
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: saved.email,
        password: saved.password,
      });

      if (signInError) {
        setError('Sign in failed. Please use manual login.');
        return;
      }

      if (data.user && data.session) {
        toast({
          title: "Welcome back!",
          description: "Signed in with biometric authentication",
        });
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl h-12 focus:bg-white/25"
        />
      </div>
      
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl h-12 pr-10 focus:bg-white/25"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-purple-700"
          />
          <label
            htmlFor="remember"
            className="text-sm text-white/80 cursor-pointer"
          >
            Remember me
          </label>
        </div>
        
        <button
          type="button"
          className="text-white/80 text-sm hover:text-white hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white hover:bg-white/90 text-purple-700 font-semibold rounded-xl h-12 text-base shadow-lg"
      >
        {isLoading ? 'Signing in...' : 'Login'}
      </Button>

      {biometricAvailable && biometricSetup && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-white/60">Or</span>
          </div>
        </div>
      )}

      {biometricAvailable && biometricSetup && (
        <Button
          type="button"
          onClick={handleBiometricLogin}
          disabled={isLoading}
          variant="outline"
          className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-xl h-12 text-base"
        >
          <Fingerprint className="h-5 w-5 mr-2" />
          {isLoading ? 'Authenticating...' : 'Login with Face ID / Touch ID'}
        </Button>
      )}
    </form>
  );
};

export default SignInForm;
