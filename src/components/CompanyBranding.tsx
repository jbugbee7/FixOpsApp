
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const CompanyBranding = () => {
  const { company, subscription, refreshCompany, hasFeatureAccess } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: company?.name || '',
    primary_color: company?.primary_color || '#3B82F6',
    secondary_color: company?.secondary_color || '#1E40AF',
  });

  const canCustomizeBranding = hasFeatureAccess('custom_branding');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company || !canCustomizeBranding) {
      toast({
        title: "Feature Not Available",
        description: "Custom branding is not available on your current plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          updated_at: new Date().toISOString(),
        })
        .eq('id', company.id);

      if (error) {
        console.error('Error updating company:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update company branding.",
          variant: "destructive",
        });
        return;
      }

      await refreshCompany();
      toast({
        title: "Branding Updated",
        description: "Company branding has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!company) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Loading company information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Branding</CardTitle>
        {!canCustomizeBranding && (
          <p className="text-sm text-gray-500">
            Upgrade to Professional or Enterprise to customize your branding.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!canCustomizeBranding || isLoading}
              placeholder="Your Company Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  disabled={!canCustomizeBranding || isLoading}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  disabled={!canCustomizeBranding || isLoading}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  disabled={!canCustomizeBranding || isLoading}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  disabled={!canCustomizeBranding || isLoading}
                  placeholder="#1E40AF"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={!canCustomizeBranding || isLoading}
              className="w-full"
            >
              {isLoading ? 'Updating...' : 'Update Branding'}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Current Plan: {subscription?.tier || 'Free'}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your current subscription: <span className="capitalize">{subscription?.tier}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyBranding;
