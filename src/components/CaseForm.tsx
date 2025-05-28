
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Calendar, Wrench, Search, ExternalLink } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

const CaseForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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
    
    // Additional Notes
    technicianNotes: '',
  });

  const applianceBrands = [
    'Whirlpool', 'GE', 'Samsung', 'LG', 'Maytag', 'Frigidaire', 'KitchenAid', 
    'Bosch', 'Electrolux', 'Kenmore', 'Amana', 'Hotpoint', 'Fisher & Paykel'
  ];

  const applianceTypes = [
    'Refrigerator', 'Dishwasher', 'Washing Machine', 'Dryer', 'Oven', 'Range',
    'Microwave', 'Freezer', 'Ice Maker', 'Garbage Disposal', 'Wine Cooler'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModelSearch = () => {
    if (formData.applianceBrand && formData.applianceModel) {
      const searchQuery = `${formData.applianceBrand} ${formData.applianceModel} manual specifications`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(googleSearchUrl, '_blank');
    } else {
      toast({
        title: "Missing Information",
        description: "Please enter both brand and model number before searching.",
        variant: "destructive"
      });
    }
  };

  const handlePartsSearch = () => {
    if (formData.partsNeeded.trim()) {
      const searchQuery = `${formData.applianceBrand} ${formData.applianceType} ${formData.partsNeeded} part number`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(googleSearchUrl, '_blank');
    } else {
      toast({
        title: "Missing Information",
        description: "Please enter part information before searching.",
        variant: "destructive"
      });
    }
  };

  const saveApplianceModel = async () => {
    if (!user || !formData.applianceBrand || !formData.applianceModel || !formData.applianceType) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appliance_models')
        .upsert({
          brand: formData.applianceBrand,
          model: formData.applianceModel,
          appliance_type: formData.applianceType,
          serial_number: formData.serialNumber || null,
          user_id: user.id
        }, {
          onConflict: 'brand,model,serial_number'
        });

      if (error) {
        console.error('Error saving appliance model:', error);
      }
    } catch (error) {
      console.error('Error saving appliance model:', error);
    }
  };

  const savePartsData = async () => {
    if (!user || !formData.partsNeeded.trim()) {
      return;
    }

    try {
      // Split parts by comma or newline and save each part
      const partsList = formData.partsNeeded.split(/[,\n]/).map(part => part.trim()).filter(part => part);
      
      for (const part of partsList) {
        // Try to extract part number from the description (looking for patterns like alphanumeric codes)
        const partNumberMatch = part.match(/\b([A-Z0-9]{3,})\b/i);
        const partNumber = partNumberMatch ? partNumberMatch[1] : part;
        
        await supabase
          .from('parts')
          .upsert({
            part_name: part,
            part_number: partNumber,
            appliance_brand: formData.applianceBrand || null,
            appliance_model: formData.applianceModel || null,
            appliance_type: formData.applianceType || null,
            user_id: user.id
          }, {
            onConflict: 'part_number,appliance_brand,appliance_model'
          });
      }
    } catch (error) {
      console.error('Error saving parts data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
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
      technicianNotes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create work orders.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.applianceBrand || !formData.applianceType || !formData.problemDescription) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in appliance brand, type, and problem description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save appliance model and parts data to database
      await Promise.all([
        saveApplianceModel(),
        savePartsData()
      ]);

      const { error } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          customer_name: 'TBD', // Placeholder since field is required but not collected
          appliance_brand: formData.applianceBrand,
          appliance_model: formData.applianceModel,
          appliance_type: formData.applianceType,
          serial_number: formData.serialNumber,
          warranty_status: formData.warrantyStatus,
          service_type: formData.serviceType,
          problem_description: formData.problemDescription,
          initial_diagnosis: formData.initialDiagnosis,
          parts_needed: formData.partsNeeded,
          estimated_time: formData.estimatedTime,
          technician_notes: formData.technicianNotes,
          status: 'Scheduled'
        });

      if (error) {
        console.error('Error creating work order:', error);
        toast({
          title: "Error Creating Work Order",
          description: "There was an error creating the work order. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Work Order Created Successfully",
        description: "The work order has been logged and assigned. Appliance and parts data saved to database.",
      });

      resetForm();
    } catch (error) {
      console.error('Error creating work order:', error);
      toast({
        title: "Error Creating Work Order",
        description: "There was an error creating the work order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appliance Information */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
              <Wrench className="h-5 w-5" />
              <span>Appliance Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applianceBrand">Brand *</Label>
                <Select value={formData.applianceBrand} onValueChange={(value) => handleInputChange('applianceBrand', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {applianceBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="applianceType">Appliance Type *</Label>
                <Select value={formData.applianceType} onValueChange={(value) => handleInputChange('applianceType', value)}>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applianceModel">Model Number</Label>
                <div className="flex space-x-2">
                  <Input
                    id="applianceModel"
                    value={formData.applianceModel}
                    onChange={(e) => handleInputChange('applianceModel', e.target.value)}
                    placeholder="Model number"
                    className="flex-1 uppercase"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleModelSearch}
                    className="flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  placeholder="Serial number"
                  className="uppercase"
                  style={{ textTransform: 'uppercase' }}
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
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
              <Calendar className="h-5 w-5" />
              <span>Service Details</span>
            </CardTitle>
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
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Textarea
                    id="partsNeeded"
                    value={formData.partsNeeded}
                    onChange={(e) => handleInputChange('partsNeeded', e.target.value)}
                    placeholder="List required parts and part numbers (one per line or comma-separated)"
                    className="min-h-[80px] flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePartsSearch}
                    className="flex items-center space-x-1 self-start mt-1"
                  >
                    <Search className="h-4 w-4" />
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tip: Use the search button to find parts online. Parts data will be automatically saved for future reference.
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                placeholder="e.g., 2 hours"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Additional Notes</CardTitle>
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
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Clear Form
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Work Order...' : 'Create Work Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
