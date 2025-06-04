
import { useState } from 'react';
import { Case } from '@/types/case';

export const useCaseState = (initialCase: Case) => {
  const [status, setStatus] = useState(initialCase.status);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCase, setCurrentCase] = useState(initialCase);
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  const isPublicCase = !currentCase.user_id;

  return {
    status,
    setStatus,
    isEditing,
    setIsEditing,
    currentCase,
    setCurrentCase,
    showPaymentPage,
    setShowPaymentPage,
    isPublicCase
  };
};
