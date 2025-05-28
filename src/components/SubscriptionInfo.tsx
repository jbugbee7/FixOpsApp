
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Users, Zap, Sparkles, Loader2, Building2, CheckCircle, XCircle } from 'lucide-react';

const SubscriptionInfo = () => {
  const { company, subscription, loading, hasFeatureAccess, getFeatureLimit } = useCompany();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-3 text-blue-600" />
          <p className="text-gray-500 text-lg">Loading subscription information...</p>
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-gray-500 text-center">Company information not available.</p>
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
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TierIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">Current Subscription</span>
                <Badge className={`${tierColors[currentSubscription.tier]} text-sm px-3 py-1`}>
                  {currentSubscription.tier.charAt(0).toUpperCase() + currentSubscription.tier.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {currentSubscription.tier === 'free' && 'Perfect for individual repair technicians'}
                {currentSubscription.tier === 'standard' && 'Ideal for small repair shops'}
                {currentSubscription.tier === 'professional' && 'For growing repair businesses'}
                {currentSubscription.tier === 'company' && 'For large operations & franchises'}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl mb-6">
            <div>
              <h3 className="font-semibold text-2xl dark:text-slate-100">
                FixOps {currentSubscription.tier.charAt(0).toUpperCase() + currentSubscription.tier.slice(1)}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {currentSubscription.tier === 'free' && 'Essential features for getting started'}
                {currentSubscription.tier === 'standard' && 'Advanced tools for growing businesses'}
                {currentSubscription.tier === 'professional' && 'Professional features and priority support'}
                {currentSubscription.tier === 'company' && 'Enterprise-grade solution with dedicated support'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold dark:text-slate-100">
                {tierPrices[currentSubscription.tier]}
              </div>
              <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                {currentSubscription.status === 'active' ? 'Active' : currentSubscription.status}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            <h4 className="font-semibold text-lg mb-2">Plan Features</h4>
            {features.map((feature) => {
              const hasAccess = hasFeatureAccess(feature.key) || feature.key === 'work_orders_per_month' || feature.key === 'team_members';
              const value = feature.format(getFeatureLimit(feature.key));
              const isAvailable = value !== 'Not Available' && value !== 'Email Support Only';
              
              return (
                <div key={feature.key} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    {isAvailable ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium">{feature.name}</span>
                  </div>
                  <span className={`font-medium ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>

          {currentSubscription.current_period_end && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Next Billing Date:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(currentSubscription.current_period_end).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}

          {currentSubscription.tier === 'free' && (
            <div className="mt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
                Upgrade to Standard - $29/month
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>About FixOps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            FixOps is your complete repair business management solution designed specifically for appliance repair professionals. 
            Each subscription tier unlocks more powerful features to help streamline your operations and grow your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Free Tier</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Perfect for individual technicians just getting started with digital work order management.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Paid Tiers</h4>
              <p className="text-green-700 dark:text-green-300">
                Unlock AI diagnostics, team collaboration, custom branding, and advanced analytics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionInfo;
