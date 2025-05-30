
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Calendar, Search, ExternalLink } from 'lucide-react';

interface ServiceDetailsFormProps {
  formData: {
    serviceType: string;
    problemDescription: string;
    initialDiagnosis: string;
    partsNeeded: string;
    estimatedTime: string;
    technicianNotes: string;
    applianceBrand: string;
    applianceType: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const ServiceDetailsForm = ({ formData, onInputChange }: ServiceDetailsFormProps) => {
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

  return (
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
            onChange={(e) => onInputChange('serviceType', e.target.value)}
            placeholder="e.g., Repair, Maintenance, Installation"
          />
        </div>
        <div>
          <Label htmlFor="problemDescription">Problem Description *</Label>
          <Textarea
            id="problemDescription"
            value={formData.problemDescription}
            onChange={(e) => onInputChange('problemDescription', e.target.value)}
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
            onChange={(e) => onInputChange('initialDiagnosis', e.target.value)}
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
                onChange={(e) => onInputChange('partsNeeded', e.target.value)}
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
          </div>
        </div>
        <div>
          <Label htmlFor="estimatedTime">Estimated Time</Label>
          <Input
            id="estimatedTime"
            value={formData.estimatedTime}
            onChange={(e) => onInputChange('estimatedTime', e.target.value)}
            placeholder="e.g., 2 hours"
          />
        </div>
        <div>
          <Label htmlFor="technicianNotes">Technician Notes</Label>
          <Textarea
            id="technicianNotes"
            value={formData.technicianNotes}
            onChange={(e) => onInputChange('technicianNotes', e.target.value)}
            placeholder="Internal notes, observations, follow-up items"
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceDetailsForm;
