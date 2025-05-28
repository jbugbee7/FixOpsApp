
import { useCompany } from '@/contexts/CompanyContext';

const DashboardHeader = () => {
  const { company } = useCompany();

  if (!company) return null;

  return (
    <div className="mb-4 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">{company.name}</span>
        {company.primary_color !== '#3B82F6' && (
          <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
            Custom Branding
          </span>
        )}
      </p>
    </div>
  );
};

export default DashboardHeader;
