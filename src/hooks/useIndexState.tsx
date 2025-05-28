
import { useState } from 'react';

interface Case {
  id: string;
  customer_name: string;
  appliance_brand: string;
  appliance_type: string;
  status: string;
  created_at: string;
  customer_phone?: string;
  customer_address?: string;
  problem_description: string;
  initial_diagnosis?: string;
  company_id: string;
}

export const useIndexState = () => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [selectedPart, setSelectedPart] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isResyncing, setIsResyncing] = useState(false);

  const handleCaseClick = (case_: Case) => {
    setSelectedCase(case_);
  };

  const handleModelFound = (model: any) => {
    setSelectedModel(model);
    setSelectedCase(null);
    setSelectedPart(null);
  };

  const handlePartFound = (part: any) => {
    setSelectedPart(part);
    setSelectedCase(null);
    setSelectedModel(null);
  };

  const handleHomeClick = () => {
    setSelectedCase(null);
    setSelectedModel(null);
    setSelectedPart(null);
    setActiveTab('dashboard');
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const clearSelections = () => {
    setSelectedCase(null);
    setSelectedModel(null);
    setSelectedPart(null);
  };

  return {
    selectedCase,
    selectedModel,
    selectedPart,
    activeTab,
    isResyncing,
    setActiveTab,
    setIsResyncing,
    handleCaseClick,
    handleModelFound,
    handlePartFound,
    handleHomeClick,
    handleNavigate,
    clearSelections
  };
};
