
import React from 'react';
import { useCRMData } from '@/hooks/useCRMData';
import CRMHeader from './crm/CRMHeader';
import CRMTabs from './crm/CRMTabs';

const CRMPage = () => {
  const {
    customers,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    segmentFilter,
    setSegmentFilter
  } = useCRMData();

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
      <CRMHeader />
      <CRMTabs
        customers={customers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        segmentFilter={segmentFilter}
        setSegmentFilter={setSegmentFilter}
      />
    </div>
  );
};

export default CRMPage;
