
import { useState } from 'react';

export const useAuthForm = () => {
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const resetForm = () => {
    setShowVerificationMessage(false);
    setShowVerificationSuccess(false);
    setActiveTab('signin');
  };

  return {
    showVerificationMessage,
    showVerificationSuccess,
    activeTab,
    setShowVerificationMessage,
    setShowVerificationSuccess,
    setActiveTab,
    resetForm
  };
};
