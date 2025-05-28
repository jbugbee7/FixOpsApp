
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Calendar, MapPin, Phone, User, Wrench, FileText, Camera } from 'lucide-react';

const CaseForm = () => {
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceAddress: '',
    
    // Appliance Information
    applianceBrand: '',
    applianceModel: '',
    applianceType: '',
    serialNumber: '',
    warrantyStatus: '',
    
    // Service Details
    serviceType: '',
    problemDescription: '',
    initialDiagnosis: '',
    partsNeeded: '',
    estimatedTime: '',
    laborCost: '',
    partsCost: '',
    
    // Additional Notes
    technicianNotes: '',
    customerNotes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.applianceBrand || !formData.problemDescription) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in customer name, appliance brand, and problem description.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Case Created Successfully",
      description: "The repair case has been logged and assigned.",
    });

    // Reset form
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      serviceAddress: '',
      applianceBrand: '',
      applianceModel: '',
      applianceType: '',
      serialNumber: '',
      warrantyStatus: '',
      serviceType: '',
      problemDescription: '',
      initialDiagnosis: '',
      partsNeeded: '',
      estimatedTime: '',
      laborCost: '',
      partsCost: '',
      technicianNotes: '',
      customerNotes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Case</h1>
        <p className="text-lg text-slate-600">Log a new repair case with all relevant details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </CardTitle>
            <CardDescription>Basic customer details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
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
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="customer@email.com"
              />
            </div>
            <div>
              <Label htmlFor="serviceAddress">Service Address</Label>
              <Input
                id="serviceAddress"
                value={formData.serviceAddress}
                onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appliance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Appliance Information</span>
            </CardTitle>
            <CardDescription>Details about the appliance being serviced</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applianceBrand">Brand *</Label>
                <Input
                  id="applianceBrand"
                  value={formData.applianceBrand}
                  onChange={(e) => handleInputChange('applianceBrand', e.target.value)}
                  placeholder="e.g., Whirlpool, GE, Samsung"
                  required
                />
              </div>
              <div>
                <Label htmlFor="applianceModel">Model Number</Label>
                <Input
                  id="applianceModel"
                  value={formData.applianceModel}
                  onChange={(e) => handleInputChange('applianceModel', e.target.value)}
                  placeholder="Model number"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applianceType">Appliance Type</Label>
                <Input
                  id="applianceType"
                  value={formData.applianceType}
                  onChange={(e) => handleInputChange('applianceType', e.target.value)}
                  placeholder="e.g., Dishwasher, Refrigerator, Washer"
                />
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  placeholder="Serial number"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="warrantyStatus">Warranty Status</Label>
              <Input
                id="warrantyStatus"
                value={formData.warrantyStatus}
                onChange={(e) => handleInputChange('warrantyStatus', e.target.value)}
                placeholder="In warranty, Out of warranty, Extended warranty"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Service Details</span>
            </CardTitle>
            <CardDescription>Repair information and diagnostics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                placeholder="e.g., Repair, Maintenance, Installation"
              />
            </div>
            <div>
              <Label htmlFor="problemDescription">Problem Description *</Label>
              <Textarea
                id="problemDescription"
                value={formData.problemDescription}
                onChange={(e) => handleInputChange('problemDescription', e.target.value)}
                placeholder="Describe the issue reported by the customer"
                className="min-h-[100px]"
                required
              />
            </div>
            <div>
              <Label htmlFor="initialDiagnosis">Initial Diagnosis</Label>
              <Textarea
                id="initialDiagnosis"
                value={formData.initialDiagnosis}
                onChange={(e) => handleInputChange('initialDiagnosis', e.target.value)}
                placeholder="Initial assessment and suspected cause"
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="partsNeeded">Parts Needed</Label>
              <Textarea
                id="partsNeeded"
                value={formData.partsNeeded}
                onChange={(e) => handleInputChange('partsNeeded', e.target.value)}
                placeholder="List required parts and part numbers"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="estimatedTime">Estimated Time</Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div>
                <Label htmlFor="laborCost">Labor Cost</Label>
                <Input
                  id="laborCost"
                  value={formData.laborCost}
                  onChange={(e) => handleInputChange('laborCost', e.target.value)}
                  placeholder="$0.00"
                />
              </div>
              <div>
                <Label htmlFor="partsCost">Parts Cost</Label>
                <Input
                  id="partsCost"
                  value={formData.partsCost}
                  onChange={(e) => handleInputChange('partsCost', e.target.value)}
                  placeholder="$0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Extra information and observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="technicianNotes">Technician Notes</Label>
              <Textarea
                id="technicianNotes"
                value={formData.technicianNotes}
                onChange={(e) => handleInputChange('technicianNotes', e.target.value)}
                placeholder="Internal notes, observations, follow-up items"
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="customerNotes">Customer Notes</Label>
              <Textarea
                id="customerNotes"
                value={formData.customerNotes}
                onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                placeholder="Customer requests, preferences, special instructions"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setFormData({
                customerName: '',
                customerPhone: '',
                customerEmail: '',
                serviceAddress: '',
                applianceBrand: '',
                applianceModel: '',
                applianceType: '',
                serialNumber: '',
                warrantyStatus: '',
                serviceType: '',
                problemDescription: '',
                initialDiagnosis: '',
                partsNeeded: '',
                estimatedTime: '',
                laborCost: '',
                partsCost: '',
                technicianNotes: '',
                customerNotes: '',
              });
            }}
          >
            Clear Form
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Create Case
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
