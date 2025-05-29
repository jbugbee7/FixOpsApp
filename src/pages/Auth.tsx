
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AuthLoading from '@/components/auth/AuthLoading';
import VerificationSuccess from '@/components/auth/VerificationSuccess';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in with a delay to handle sign-out redirects
    const checkUser = async () => {
      // Wait a bit to ensure any sign-out process is complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth page checking session:', session?.user?.email);
      
      if (session) {
        console.log('User already authenticated, redirecting to home');
        navigate('/');
      }
      setIsCheckingAuth(false);
    };
    
    checkUser();

    // Check for email verification success from URL
    const type = searchParams.get('type');
    const tokenHash = searchParams.get('token_hash');
    
    if (type === 'signup' && tokenHash) {
      setShowVerificationSuccess(true);
      setActiveTab('signin');
      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully. You can now sign in.",
      });
    }

    // Check for other verification scenarios
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setShowVerificationSuccess(true);
      setActiveTab('signin');
    }

    // Check if coming from email verification link
    const message = searchParams.get('message');
    if (message === 'Email confirmed') {
      setShowVerificationSuccess(true);
      setActiveTab('signin');
    }
  }, [navigate, searchParams, toast]);

  // Show loading while checking auth status
  if (isCheckingAuth) {
    return <AuthLoading />;
  }

  // Check if this is the verification success page
  const isVerificationPage = searchParams.get('type') === 'signup';

  if (isVerificationPage) {
    return <VerificationSuccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-3 sm:p-4">
      <AuthForm
        showVerificationMessage={showVerificationMessage}
        showVerificationSuccess={showVerificationSuccess}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowVerificationMessage={setShowVerificationMessage}
      />
    </div>
  );
};

export default Auth;
