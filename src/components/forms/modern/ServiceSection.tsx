
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Calendar, Search, ExternalLink } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ServiceSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const ServiceSection = ({ formData, onInputChange, expanded, onToggle, icon: Icon }: ServiceSectionProps) => {
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
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Service Details</span>
          </div>
          <Icon className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4 animate-fade-in">
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Input
              id="serviceType"
              value={formData.serviceType}
              onChange={(e) => onInputChange('serviceType', e.target.value)}
              placeholder="e.g., Repair, Maintenance, Installation"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="problemDescription">Problem Description *</Label>
            <Textarea
              id="problemDescription"
              value={formData.problemDescription}
              onChange={(e) => onInputChange('problemDescription', e.target.value)}
              placeholder="Describe the issue reported by the customer"
              className="min-h-[100px] mt-1"
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
              className="min-h-[80px] mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="partsNeeded">Parts Needed</Label>
            <div className="space-y-2 mt-1">
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
              className="mt-1"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ServiceSection;
