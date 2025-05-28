
import { useCompany } from '@/contexts/CompanyContext';

const DashboardHeader = () => {
  const { company, loading } = useCompany();

  // Don't render anything while loading or if there's no company
  if (loading || !company) {
    return null;
  }

  return (
    <div className="mb-6">
      {company.primary_color !== '#3B82F6' && (
        <div className="text-center">
          <span className="inline-block px-3 py-1 text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
            Custom Branding Active
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
