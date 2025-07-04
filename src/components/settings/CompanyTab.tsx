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
          View your company details and subscription information
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Subscription Status</Label>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={company?.subscription_status === 'active' ? "default" : "destructive"} 
                className="text-sm px-3 py-1 font-medium"
              >
                {company?.subscription_status === 'active' ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </>
                ) : (
                  company?.subscription_status || 'Unknown'
                )}
              </Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {company?.subscription_plan || 'Basic'} plan
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-sm font-medium">Contact Email</Label>
            <Input
              id="contact-email"
              value={company?.contact_email || 'Not provided'}
              disabled
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone" className="text-sm font-medium">Contact Phone</Label>
            <Input
              id="contact-phone"
              value={company?.contact_phone || 'Not provided'}
              disabled
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {company?.address && (
          <div className="space-y-2 mt-6">
            <Label htmlFor="company-address" className="text-sm font-medium">Company Address</Label>
            <Input
              id="company-address"
              value={company.address}
              disabled
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyTab;