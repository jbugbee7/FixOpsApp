
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [checkingAgreements, setCheckingAgreements] = useState(false);
  const [agreementsComplete, setAgreementsComplete] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUserAgreements = async () => {
      if (!user || loading) {
        console.log('No user or still loading, skipping agreement check');
        setCheckingAgreements(false);
        return;
      }

      console.log('Checking user agreements for:', user.id);
      setCheckingAgreements(true);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('policy_agreed, terms_agreed, agreements_date')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking agreements:', error);
          setAgreementsComplete(false);
        } else {
          const isComplete = data?.policy_agreed === true && data?.terms_agreed === true;
          console.log('Agreements status:', { 
            policy: data?.policy_agreed, 
            terms: data?.terms_agreed, 
            complete: isComplete 
          });
          setAgreementsComplete(isComplete);
        }
      } catch (error) {
        console.error('Unexpected error checking agreements:', error);
        setAgreementsComplete(false);
      } finally {
        setCheckingAgreements(false);
      }
    };

    // Only check agreements if we have a stable auth state
    if (!loading && user) {
      checkUserAgreements();
    } else if (!loading && !user) {
      setCheckingAgreements(false);
      setAgreementsComplete(false);
    }
  }, [user, loading]);

  // Show loading while auth is initializing or checking agreements
  if (loading || (user && checkingAgreements)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-gun-metal/10 dark:bg-gun-metal/20 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Wrench className="h-6 w-6 text-gun-metal dark:text-gun-metal" />
            </div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle redirects only after auth state is stable
  if (!user && !loading) {
    console.log('User not authenticated, redirecting to auth');
    if (!redirecting) {
      setRedirecting(true);
      return <Navigate to="/auth" replace />;
    }
  }

  // Handle agreement redirects
  if (user && !checkingAgreements) {
    if (!agreementsComplete && location.pathname !== '/agreement') {
      console.log('User has not completed agreements, redirecting to agreement page');
      return <Navigate to="/agreement" replace />;
    }

    if (agreementsComplete && location.pathname === '/agreement') {
      console.log('User has completed agreements, redirecting to dashboard');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
