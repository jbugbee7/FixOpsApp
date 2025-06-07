
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCustomerDialog = ({ open, onOpenChange }: AddCustomerDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    customer_city: '',
    customer_state: '',
    customer_zip_code: '',
    appliance_type: '',
    appliance_brand: '',
    problem_description: '',
    diagnostic_fee_type: 'Fixed',
    diagnostic_fee_amount: 100,
    status: 'Scheduled'
  });

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const applianceTypes = [
    'Refrigerator', 'Washer', 'Dryer', 'Dishwasher', 'Oven', 'Microwave', 'Garbage Disposal', 'Ice Maker', 'Wine Cooler', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('cases')
        .insert([{
          ...formData,
          user_id: user.data.user.id
        }]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Customer and case created successfully",
      });
      
      onOpenChange(false);
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_city: '',
        customer_state: '',
        customer_zip_code: '',
        appliance_type: '',
        appliance_brand: '',
        problem_description: '',
        diagnostic_fee_type: 'Fixed',
        diagnostic_fee_amount: 100,
        status: 'Scheduled'
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer and case",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customer_phone">Phone Number</Label>
                <Input
                  id="customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customer_email">Email Address</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleInputChange('customer_email', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="customer_address">Address</Label>
              <Input
                id="customer_address"
                value={formData.customer_address}
                onChange={(e) => handleInputChange('customer_address', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customer_city">City</Label>
                <Input
                  id="customer_city"
                  value={formData.customer_city}
                  onChange={(e) => handleInputChange('customer_city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customer_state">State</Label>
                <Select value={formData.customer_state} onValueChange={(value) => handleInputChange('customer_state', value)}>
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
                <Label htmlFor="customer_zip_code">ZIP Code</Label>
                <Input
                  id="customer_zip_code"
                  value={formData.customer_zip_code}
                  onChange={(e) => handleInputChange('customer_zip_code', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Service Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appliance_type">Appliance Type *</Label>
                <Select value={formData.appliance_type} onValueChange={(value) => handleInputChange('appliance_type', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appliance type" />
                  </SelectTrigger>
                  <SelectContent>
                    {applianceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appliance_brand">Appliance Brand</Label>
                <Input
                  id="appliance_brand"
                  value={formData.appliance_brand}
                  onChange={(e) => handleInputChange('appliance_brand', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="problem_description">Problem Description *</Label>
              <Textarea
                id="problem_description"
                value={formData.problem_description}
                onChange={(e) => handleInputChange('problem_description', e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diagnostic_fee_type">Diagnostic Fee Type</Label>
                <Select value={formData.diagnostic_fee_type} onValueChange={(value) => handleInputChange('diagnostic_fee_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Complimentary">Complimentary</SelectItem>
                    <SelectItem value="Waived">Waived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="diagnostic_fee_amount">Diagnostic Fee Amount</Label>
                <Input
                  id="diagnostic_fee_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.diagnostic_fee_amount}
                  onChange={(e) => handleInputChange('diagnostic_fee_amount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Customer & Case'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
