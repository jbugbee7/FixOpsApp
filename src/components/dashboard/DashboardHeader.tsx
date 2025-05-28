
import { useCompany } from '@/contexts/CompanyContext';

const DashboardHeader = () => {
  const { company } = useCompany();

  if (!company) return null;

  return (
    <div className="mb-6 text-center">
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-2">
          Welcome to {company.name}
        </h1>
        <p className="text-purple-600 dark:text-purple-300">
          Your comprehensive repair management solution
        </p>
        {company.primary_color !== '#3B82F6' && (
          <div className="mt-3">
            <span className="inline-block px-3 py-1 text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
              Custom Branding Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
