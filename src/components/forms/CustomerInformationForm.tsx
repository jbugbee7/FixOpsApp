
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInformationFormProps {
  formData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
    customerAddressLine2: string;
    customerCity: string;
    customerState: string;
    customerZipCode: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const CustomerInformationForm = ({ formData, onInputChange }: CustomerInformationFormProps) => {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
          <span>Customer Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => onInputChange('customerName', e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => onInputChange('customerPhone', e.target.value)}
              placeholder="(555) 123-4567"
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
          />
        </div>
        <div>
          <Label htmlFor="customerAddress">Address</Label>
          <Input
            id="customerAddress"
            value={formData.customerAddress}
            onChange={(e) => onInputChange('customerAddress', e.target.value)}
            placeholder="Street address"
          />
        </div>
        <div>
          <Label htmlFor="customerAddressLine2">Address Line 2</Label>
          <Input
            id="customerAddressLine2"
            value={formData.customerAddressLine2}
            onChange={(e) => onInputChange('customerAddressLine2', e.target.value)}
            placeholder="Apartment, suite, etc."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="customerCity">City</Label>
            <Input
              id="customerCity"
              value={formData.customerCity}
              onChange={(e) => onInputChange('customerCity', e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="customerState">State</Label>
            <Select value={formData.customerState} onValueChange={(value) => onInputChange('customerState', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInformationForm;
