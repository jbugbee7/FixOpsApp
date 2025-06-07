
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAccountingData } from '@/hooks/useAccountingData';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateInvoiceDialog = ({ open, onOpenChange }: CreateInvoiceDialogProps) => {
  const { createInvoice } = useAccountingData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    due_date: '',
    tax_rate: 0,
    notes: '',
    payment_terms: 'Net 30',
    status: 'draft' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createInvoice({
        ...formData,
        issue_date: new Date().toISOString().split('T')[0],
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
      });
      
      onOpenChange(false);
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_address: '',
        due_date: '',
        tax_rate: 0,
        notes: '',
        payment_terms: 'Net 30',
        status: 'draft'
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <form onSubmit={handleSubmit} className="space-y-3 pb-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="customer_name" className="text-sm">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="customer_email" className="text-sm">Customer Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange('customer_email', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="customer_address" className="text-sm">Customer Address</Label>
                <Textarea
                  id="customer_address"
                  value={formData.customer_address}
                  onChange={(e) => handleInputChange('customer_address', e.target.value)}
                  rows={2}
                  className="mt-1 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="due_date" className="text-sm">Due Date *</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tax_rate" className="text-sm">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.tax_rate}
                    onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_terms" className="text-sm">Payment Terms</Label>
                <Select value={formData.payment_terms} onValueChange={(value) => handleInputChange('payment_terms', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={2}
                  className="mt-1 resize-none"
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex gap-2 p-6 pt-2 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
