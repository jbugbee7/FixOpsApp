
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Wrench, Search, ExternalLink } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ApplianceSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  expanded: boolean;
  onToggle: () => void;
  icon: LucideIcon;
}

const ApplianceSection = ({ formData, onInputChange, expanded, onToggle, icon: Icon }: ApplianceSectionProps) => {
  const applianceBrands = [
    'Whirlpool', 'GE', 'Samsung', 'LG', 'Maytag', 'Frigidaire', 'KitchenAid', 
    'Bosch', 'Electrolux', 'Kenmore', 'Amana', 'Hotpoint', 'Fisher & Paykel'
  ];

  const applianceTypes = [
    'Refrigerator', 'Dishwasher', 'Washing Machine', 'Dryer', 'Oven', 'Range',
    'Microwave', 'Freezer', 'Ice Maker', 'Garbage Disposal', 'Wine Cooler'
  ];

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

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between dark:text-slate-100">
          <div className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Appliance Information</span>
          </div>
          <Icon className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applianceBrand">Brand *</Label>
              <Select value={formData.applianceBrand} onValueChange={(value) => onInputChange('applianceBrand', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50">
                  {applianceBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="applianceType">Appliance Type *</Label>
              <Select value={formData.applianceType} onValueChange={(value) => onInputChange('applianceType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select appliance type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50">
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
              <div className="flex space-x-2 mt-1">
                <Input
                  id="applianceModel"
                  value={formData.applianceModel}
                  onChange={(e) => onInputChange('applianceModel', e.target.value)}
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
                onChange={(e) => onInputChange('serialNumber', e.target.value)}
                placeholder="Serial number"
                className="mt-1 uppercase"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="warrantyStatus">Warranty Status</Label>
            <Input
              id="warrantyStatus"
              value={formData.warrantyStatus}
              onChange={(e) => onInputChange('warrantyStatus', e.target.value)}
              placeholder="In warranty, Out of warranty, Extended warranty"
              className="mt-1"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ApplianceSection;
