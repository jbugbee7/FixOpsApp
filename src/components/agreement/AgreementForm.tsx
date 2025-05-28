
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import AgreementItem from './AgreementItem';
import AgreementModals from './AgreementModals';

interface AgreementFormProps {
  onSubmit: () => void;
  loading: boolean;
}

const AgreementForm = ({ onSubmit, loading }: AgreementFormProps) => {
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [policyViewed, setPolicyViewed] = useState(false);
  const [termsViewed, setTermsViewed] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
    <>
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
            <AgreementItem
              type="policy"
              agreed={policyAgreed}
              viewed={policyViewed}
              onAgreedChange={(checked) => setPolicyAgreed(checked as boolean)}
              onViewDocument={() => setShowPolicyModal(true)}
            />

            <AgreementItem
              type="terms"
              agreed={termsAgreed}
              viewed={termsViewed}
              onAgreedChange={(checked) => setTermsAgreed(checked as boolean)}
              onViewDocument={() => setShowTermsModal(true)}
            />
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
            onClick={onSubmit}
            disabled={!canProceed || loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Continue to FixOps"}
          </Button>
        </CardContent>
      </Card>

      <AgreementModals
        showPolicyModal={showPolicyModal}
        showTermsModal={showTermsModal}
        policyAgreed={policyAgreed}
        termsAgreed={termsAgreed}
        onPolicyModalClose={handlePolicyModalClose}
        onTermsModalClose={handleTermsModalClose}
        onPolicyAccept={handlePolicyAccept}
        onTermsAccept={handleTermsAccept}
      />
    </>
  );
};

export default AgreementForm;
