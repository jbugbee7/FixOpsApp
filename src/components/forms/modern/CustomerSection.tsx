
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CustomerSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const CustomerSection = ({ formData, onInputChange, expanded, onToggle, icon: Icon }: CustomerSectionProps) => {
  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Customer Information</span>
          </div>
          <Icon className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => onInputChange('customerName', e.target.value)}
                placeholder="Full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => onInputChange('customerPhone', e.target.value)}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="customerEmail">Email Address</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => onInputChange('customerEmail', e.target.value)}
              placeholder="customer@email.com"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Input
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) => onInputChange('customerAddress', e.target.value)}
                placeholder="Street address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customerAddressLine2">Address Line 2</Label>
              <Input
                id="customerAddressLine2"
                value={formData.customerAddressLine2}
                onChange={(e) => onInputChange('customerAddressLine2', e.target.value)}
                placeholder="Apartment, suite, etc."
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customerCity">City</Label>
              <Input
                id="customerCity"
                value={formData.customerCity}
                onChange={(e) => onInputChange('customerCity', e.target.value)}
                placeholder="City"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customerState">State</Label>
              <Select value={formData.customerState} onValueChange={(value) => onInputChange('customerState', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50">
                  {usStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customerZipCode">ZIP Code</Label>
              <Input
                id="customerZipCode"
                value={formData.customerZipCode}
                onChange={(e) => onInputChange('customerZipCode', e.target.value)}
                placeholder="12345"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CustomerSection;
