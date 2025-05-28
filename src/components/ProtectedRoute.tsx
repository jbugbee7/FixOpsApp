
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [checkingAgreements, setCheckingAgreements] = useState(true);
  const [agreementsComplete, setAgreementsComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUserAgreements = async () => {
      if (!user) {
        console.log('No user found, skipping agreement check');
        setCheckingAgreements(false);
        return;
      }

      try {
        console.log('Checking user agreements for:', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('policy_agreed, terms_agreed, agreements_date')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking agreements:', error);
          // If profile doesn't exist, user needs to agree to terms
          setAgreementsComplete(false);
        } else {
          const isComplete = data?.policy_agreed === true && data?.terms_agreed === true;
          console.log('Agreements status:', { 
            policy: data?.policy_agreed, 
            terms: data?.terms_agreed, 
            complete: isComplete,
            agreementsDate: data?.agreements_date 
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

    if (user && !loading) {
      checkUserAgreements();
    } else {
      setCheckingAgreements(false);
    }
  }, [user, loading]);

  if (loading || checkingAgreements) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    console.log('User not authenticated, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // If user hasn't agreed to terms and is not already on the agreement page
  if (!agreementsComplete && location.pathname !== '/agreement') {
    console.log('User has not completed agreements, redirecting to agreement page');
    return <Navigate to="/agreement" replace />;
  }

  // If user has completed agreements but is on agreement page, redirect to dashboard
  if (agreementsComplete && location.pathname === '/agreement') {
    console.log('User has completed agreements, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
