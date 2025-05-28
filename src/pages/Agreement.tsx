
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wrench, FileText, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ScrollableDocumentModal from '@/components/ScrollableDocumentModal';
import PolicyContent from '@/components/PolicyContent';
import TermsContent from '@/components/TermsContent';

const Agreement = () => {
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [policyViewed, setPolicyViewed] = useState(false);
  const [termsViewed, setTermsViewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!policyAgreed || !termsAgreed) {
      toast({
        title: "Agreement Required",
        description: "Please agree to both the Privacy Policy and Terms of Service to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!policyViewed || !termsViewed) {
      toast({
        title: "Documents Must Be Reviewed",
        description: "Please read both the Privacy Policy and Terms of Service before proceeding.",
        variant: "destructive",
      });
      return;
    }

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
      const { error } = await supabase
        .from('profiles')
        .update({
          policy_agreed: true,
          terms_agreed: true,
          agreements_date: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating agreements:', error);
        toast({
          title: "Update Failed",
          description: "Failed to save your agreements. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome to FixOps!",
        description: "Your agreements have been saved. You can now access the dashboard.",
      });

      navigate('/');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePolicyModalClose = () => {
    setShowPolicyModal(false);
    setPolicyViewed(true);
  };

  const handleTermsModalClose = () => {
    setShowTermsModal(false);
    setTermsViewed(true);
  };

  const handlePolicyAccept = () => {
    setPolicyAgreed(true);
    setPolicyViewed(true);
  };

  const handleTermsAccept = () => {
    setTermsAgreed(true);
    setTermsViewed(true);
  };

  const canProceed = policyAgreed && termsAgreed && policyViewed && termsViewed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Wrench className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FixOps
          </h1>
        </div>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="dark:text-slate-100">Welcome! Please Review Our Agreements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                Before you can access FixOps, you must read and agree to our Privacy Policy and Terms of Service by clicking the links below.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg dark:border-slate-600">
                <Checkbox
                  id="privacy-policy"
                  checked={policyAgreed}
                  onCheckedChange={(checked) => setPolicyAgreed(checked as boolean)}
                  disabled={!policyViewed}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <label
                      htmlFor="privacy-policy"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200 ${!policyViewed ? 'text-muted-foreground' : ''}`}
                    >
                      I have read and agree to the Privacy Policy
                    </label>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-2">
                    {policyViewed ? 'Document reviewed ✓' : 'You must read this document first'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPolicyModal(true)}
                    className={`text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 ${policyViewed ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {policyViewed ? 'Privacy Policy (Reviewed)' : 'Read Privacy Policy *Required'}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg dark:border-slate-600">
                <Checkbox
                  id="terms-of-service"
                  checked={termsAgreed}
                  onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
                  disabled={!termsViewed}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <label
                      htmlFor="terms-of-service"
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200 ${!termsViewed ? 'text-muted-foreground' : ''}`}
                    >
                      I have read and agree to the Terms of Service
                    </label>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-2">
                    {termsViewed ? 'Document reviewed ✓' : 'You must read this document first'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTermsModal(true)}
                    className={`text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 ${termsViewed ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {termsViewed ? 'Terms of Service (Reviewed)' : 'Read Terms of Service *Required'}
                  </Button>
                </div>
              </div>
            </div>

            {(!policyViewed || !termsViewed) && (
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  You must click and read both documents above before you can proceed.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!canProceed || loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Continue to FixOps"}
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Policy Modal */}
        <ScrollableDocumentModal
          isOpen={showPolicyModal}
          onClose={handlePolicyModalClose}
          onAccept={handlePolicyAccept}
          title="Privacy Policy"
          isAccepted={policyAgreed}
        >
          <PolicyContent />
        </ScrollableDocumentModal>

        {/* Terms of Service Modal */}
        <ScrollableDocumentModal
          isOpen={showTermsModal}
          onClose={handleTermsModalClose}
          onAccept={handleTermsAccept}
          title="Terms of Service"
          isAccepted={termsAgreed}
        >
          <TermsContent />
        </ScrollableDocumentModal>
      </div>
    </div>
  );
};

export default Agreement;
