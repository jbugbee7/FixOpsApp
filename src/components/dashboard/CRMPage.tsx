
import React from 'react';
import CRMHeader from './crm/CRMHeader';
import CRMTabs from './crm/CRMTabs';
import { useRealtimeCRMData } from '@/hooks/useRealtimeCRMData';
import RealtimeConnectionStatus from './RealtimeConnectionStatus';

const CRMPage = () => {
  const { interactions, communications, loading, error } = useRealtimeCRMData();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="flex-shrink-0 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <CRMHeader />
            <RealtimeConnectionStatus />
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 h-full">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <CRMTabs 
            interactions={interactions} 
            communications={communications} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default CRMPage;
