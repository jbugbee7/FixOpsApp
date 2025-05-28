
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Zap, Sparkles, Loader2 } from 'lucide-react';

const SubscriptionInfo = () => {
  const { company, subscription, loading, hasFeatureAccess, getFeatureLimit } = useCompany();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p className="text-gray-500">Loading subscription information...</p>
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Company information not available.</p>
        </CardContent>
      </Card>
    );
  }

  // Default to free tier if no subscription is found
  const currentSubscription = subscription || {
    tier: 'free' as const,
    status: 'active',
    current_period_end: null
  };

  const tierColors = {
    free: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    professional: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    enterprise: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  const tierIcons = {
    free: Users,
    basic: Zap,
    professional: Crown,
    enterprise: Sparkles
  };

  const TierIcon = tierIcons[currentSubscription.tier];

  const features = [
    {
      name: 'Work Orders per Month',
      key: 'work_orders_per_month',
      format: (limit: number | null) => limit === null ? 'Unlimited' : limit.toString()
    },
    {
      name: 'Team Members',
      key: 'team_members',
      format: (limit: number | null) => limit === null ? 'Unlimited' : limit.toString()
    },
    {
      name: 'AI Assistance',
      key: 'ai_assistance',
      format: (limit: number | null) => limit === null ? 'Unlimited' : limit === 0 ? 'Not Available' : limit.toString()
    },
    {
      name: 'Custom Branding',
      key: 'custom_branding',
      format: () => hasFeatureAccess('custom_branding') ? 'Available' : 'Not Available'
    },
    {
      name: 'Advanced Analytics',
      key: 'advanced_analytics',
      format: () => hasFeatureAccess('advanced_analytics') ? 'Available' : 'Not Available'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TierIcon className="h-5 w-5" />
          <span>Subscription Plan</span>
          <Badge className={tierColors[currentSubscription.tier]}>
            {currentSubscription.tier.charAt(0).toUpperCase() + currentSubscription.tier.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {features.map((feature) => {
            const limit = getFeatureLimit(feature.key);
            const hasAccess = hasFeatureAccess(feature.key);
            
            return (
              <div key={feature.key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-sm">{feature.name}</span>
                <span className={`text-sm ${hasAccess ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  {feature.format(limit)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Status:</span>
              <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                {currentSubscription.status}
              </Badge>
            </div>
            
            {currentSubscription.current_period_end && (
              <div className="flex justify-between text-sm">
                <span>Next Billing:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {currentSubscription.tier === 'free' && (
          <div className="pt-4">
            <Button className="w-full" variant="outline">
              Upgrade Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionInfo;
