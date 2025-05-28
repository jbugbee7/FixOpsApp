
import ScrollableDocumentModal from '@/components/ScrollableDocumentModal';
import PolicyContent from '@/components/PolicyContent';
import TermsContent from '@/components/TermsContent';

interface AgreementModalsProps {
  showPolicyModal: boolean;
  showTermsModal: boolean;
  policyAgreed: boolean;
  termsAgreed: boolean;
  onPolicyModalClose: () => void;
  onTermsModalClose: () => void;
  onPolicyAccept: () => void;
  onTermsAccept: () => void;
}

const AgreementModals = ({
  showPolicyModal,
  showTermsModal,
  policyAgreed,
  termsAgreed,
  onPolicyModalClose,
  onTermsModalClose,
  onPolicyAccept,
  onTermsAccept
}: AgreementModalsProps) => {
  return (
    <>
      <ScrollableDocumentModal
        isOpen={showPolicyModal}
        onClose={onPolicyModalClose}
        onAccept={onPolicyAccept}
        title="Privacy Policy"
        isAccepted={policyAgreed}
      >
        <PolicyContent />
      </ScrollableDocumentModal>

      <ScrollableDocumentModal
        isOpen={showTermsModal}
        onClose={onTermsModalClose}
        onAccept={onTermsAccept}
        title="Terms of Service"
        isAccepted={termsAgreed}
      >
        <TermsContent />
      </ScrollableDocumentModal>
    </>
  );
};

export default AgreementModals;
