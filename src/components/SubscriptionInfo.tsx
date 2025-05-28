
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Zap, Sparkles, Loader2, Building2 } from 'lucide-react';

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
    standard: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    professional: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    company: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  const tierIcons = {
    free: Users,
    standard: Zap,
    professional: Crown,
    company: Building2
  };

  const tierPrices = {
    free: 'Free',
    standard: '$29/month',
    professional: '$49/month', 
    company: '$99/month'
  };

  const TierIcon = tierIcons[currentSubscription.tier];

  const features = [
    {
      name: 'Work Orders per Month',
      key: 'work_orders_per_month',
      format: (limit: number | null) => {
        if (currentSubscription.tier === 'free') return '5';
        if (currentSubscription.tier === 'standard') return '50';
        return 'Unlimited';
      }
    },
    {
      name: 'Team Members',
      key: 'team_members',
      format: (limit: number | null) => {
        if (currentSubscription.tier === 'free') return '1';
        if (currentSubscription.tier === 'standard') return '5';
        if (currentSubscription.tier === 'professional') return '25';
        return 'Unlimited';
      }
    },
    {
      name: 'AI Assistance',
      key: 'ai_assistance',
      format: (limit: number | null) => {
        if (currentSubscription.tier === 'free') return 'Not Available';
        if (currentSubscription.tier === 'standard') return '10 per month';
        return 'Unlimited';
      }
    },
    {
      name: 'Custom Branding',
      key: 'custom_branding',
      format: () => {
        const hasAccess = currentSubscription.tier === 'professional' || currentSubscription.tier === 'company';
        return hasAccess ? 'Available' : 'Not Available';
      }
    },
    {
      name: 'Advanced Analytics',
      key: 'advanced_analytics',
      format: () => {
        const hasAccess = currentSubscription.tier !== 'free';
        return hasAccess ? 'Available' : 'Not Available';
      }
    },
    {
      name: 'Priority Support',
      key: 'priority_support',
      format: () => {
        const hasAccess = currentSubscription.tier === 'professional' || currentSubscription.tier === 'company';
        return hasAccess ? 'Available' : 'Email Support Only';
      }
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TierIcon className="h-5 w-5" />
            <span>Current Subscription</span>
            <Badge className={tierColors[currentSubscription.tier]}>
              {currentSubscription.tier.charAt(0).toUpperCase() + currentSubscription.tier.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div>
              <h3 className="font-semibold text-lg dark:text-slate-100">
                FixOps {currentSubscription.tier.charAt(0).toUpperCase() + currentSubscription.tier.slice(1)}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {currentSubscription.tier === 'free' && 'Perfect for individual repair technicians'}
                {currentSubscription.tier === 'standard' && 'Ideal for small repair shops'}
                {currentSubscription.tier === 'professional' && 'For growing repair businesses'}
                {currentSubscription.tier === 'company' && 'For large operations & franchises'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold dark:text-slate-100">
                {tierPrices[currentSubscription.tier]}
              </div>
              <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                {currentSubscription.status}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3">
            {features.map((feature) => {
              const hasAccess = hasFeatureAccess(feature.key) || feature.key === 'work_orders_per_month' || feature.key === 'team_members';
              
              return (
                <div key={feature.key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium text-sm">{feature.name}</span>
                  <span className={`text-sm ${hasAccess ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {feature.format(getFeatureLimit(feature.key))}
                  </span>
                </div>
              );
            })}
          </div>

          {currentSubscription.current_period_end && (
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Next Billing:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {currentSubscription.tier === 'free' && (
            <div className="pt-4">
              <Button className="w-full" variant="default">
                Upgrade to Standard - $29/month
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FixOps Feature Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            FixOps is your complete repair business management solution. Each subscription tier unlocks more powerful features to help you grow your business.
          </p>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p>Free tier includes the core FixOps functionality - perfect for getting started with repair management.</p>
            <p className="mt-2">Paid tiers unlock advanced features like AI diagnostics, custom branding, and team collaboration tools.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionInfo;
