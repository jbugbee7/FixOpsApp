
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, CheckCircle } from 'lucide-react';

const SubscriptionInfo = () => {
  const currentSubscription = {
    tier: 'free' as const,
    status: 'active',
    current_period_end: null
  };

  const features = [
    {
      name: 'Work Orders',
      value: 'Unlimited',
      available: true
    },
    {
      name: 'Customer Management',
      value: 'Full Access',
      available: true
    },
    {
      name: 'Parts Tracking',
      value: 'Included',
      available: true
    },
    {
      name: 'Mobile Access',
      value: 'Full Access',
      available: true
    },
    {
      name: 'Repair History',
      value: 'Complete Access',
      available: true
    },
    {
      name: 'Appliance Database',
      value: 'Included',
      available: true
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-b">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">Current Plan</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 text-sm px-3 py-1">
                  Free Plan
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Complete repair management solution - always free
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl mb-6">
            <div>
              <h3 className="font-semibold text-2xl dark:text-slate-100">
                FixOps Free
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                All essential features for professional repair management
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                Free
              </div>
              <Badge variant="default" className="mt-2 bg-green-600">
                Active
              </Badge>
            </div>
          </div>

          <div className="grid gap-4">
            <h4 className="font-semibold text-lg mb-2">Included Features</h4>
            {features.map((feature, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{feature.name}</span>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {feature.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Note:</strong> FixOps provides all core repair management features completely free. 
              Premium features for large businesses are in development and will be announced soon.
            </p>
          </div>
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
            FixOps is designed specifically for appliance repair professionals who want a simple, 
            powerful tool to manage their work orders, track parts, and maintain customer relationships - 
            all without the complexity of enterprise software.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Always Free Core</h4>
              <p className="text-green-700 dark:text-green-300">
                Work order management, customer tracking, parts inventory, and mobile access will always be free.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Future Premium</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Advanced features like AI diagnostics, custom branding, and team collaboration coming soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionInfo;
