
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useAuthForm } from '@/hooks/useAuthForm';
import AuthLoading from '@/components/auth/AuthLoading';
import VerificationSuccess from '@/components/auth/VerificationSuccess';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const {
    showVerificationMessage,
    showVerificationSuccess,
    activeTab,
    setShowVerificationMessage,
    setShowVerificationSuccess,
    setActiveTab
  } = useAuthForm();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Auth page checking session...');
        
        // Add a small delay to ensure any previous sign-out is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        console.log('Auth page session check:', session?.user?.email || 'no session');
        
        if (session?.user && !hasRedirected) {
          console.log('User already authenticated, redirecting to home');
          setHasRedirected(true);
          navigate('/', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkUser();

    // Handle URL parameters for email verification
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

    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setShowVerificationSuccess(true);
      setActiveTab('signin');
    }

    const message = searchParams.get('message');
    if (message === 'Email confirmed') {
      setShowVerificationSuccess(true);
      setActiveTab('signin');
    }
  }, [navigate, searchParams, toast, setShowVerificationSuccess, setActiveTab, hasRedirected]);

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
    <div className="min-h-screen bg-background md:bg-gradient-to-br md:from-purple-500/20 md:via-blue-500/20 md:to-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full md:max-w-2xl md:bg-card md:rounded-2xl md:shadow-2xl md:p-8">
        <AuthForm
          showVerificationMessage={showVerificationMessage}
          showVerificationSuccess={showVerificationSuccess}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowVerificationMessage={setShowVerificationMessage}
        />
      </div>
    </div>
  );
};

export default Auth;
