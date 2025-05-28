
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AgreementHeader from '@/components/agreement/AgreementHeader';
import AgreementForm from '@/components/agreement/AgreementForm';

const Agreement = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Saving agreements for user:', user.id);
      
      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          policy_agreed: true,
          terms_agreed: true,
          agreements_date: new Date().toISOString(),
          email: user.email,
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error saving agreements:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save your agreements. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Agreements saved successfully');
      toast({
        title: "Welcome to FixOps!",
        description: "Your agreements have been saved. Redirecting to dashboard...",
      });

      // Navigate immediately to prevent multiple submissions
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Unexpected error saving agreements:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AgreementHeader />
        <AgreementForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default Agreement;
