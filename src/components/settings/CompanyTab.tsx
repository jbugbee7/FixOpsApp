import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCompany } from '@/hooks/useCompany';
import { Building2, CheckCircle } from 'lucide-react';

const CompanyTab = () => {
  const { company, loading } = useCompany();

  if (loading) {
    return (
      <div className="space-y-6 mt-0">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-0">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Company Information</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          View your company details
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="company-name" className="text-sm font-medium">Company Name</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="company-name"
              value={company?.name || 'No company name'}
              disabled
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
            <Building2 className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTab;