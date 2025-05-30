
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { Case } from '@/types/case';

interface CustomerInformationDisplayProps {
  case: Case;
}

const CustomerInformationDisplay = ({ case: caseData }: CustomerInformationDisplayProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <User className="h-5 w-5" />
          <span>Customer Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Customer Name</label>
            <p className="text-lg font-semibold dark:text-slate-100">{caseData.customer_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number</label>
            <p className="text-lg dark:text-slate-100 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {caseData.customer_phone || 'N/A'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</label>
            <p className="text-lg dark:text-slate-100 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {caseData.customer_email || 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Date</label>
            <p className="text-lg dark:text-slate-100 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(caseData.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Service Address</label>
          <div className="text-lg dark:text-slate-100">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <div>
                {caseData.customer_address && (
                  <div>{caseData.customer_address}</div>
                )}
                {caseData.customer_address_line_2 && (
                  <div>{caseData.customer_address_line_2}</div>
                )}
                {(caseData.customer_city || caseData.customer_state || caseData.customer_zip_code) && (
                  <div>
                    {caseData.customer_city}{caseData.customer_city && caseData.customer_state ? ', ' : ''}
                    {caseData.customer_state} {caseData.customer_zip_code}
                  </div>
                )}
                {!caseData.customer_address && !caseData.customer_city && 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInformationDisplay;
