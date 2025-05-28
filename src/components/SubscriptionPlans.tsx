
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  current?: boolean;
}

const SubscriptionPlans = () => {
  const { user } = useAuth();

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'forever',
      description: 'Perfect for individual repair technicians',
      icon: <Zap className="h-6 w-6" />,
      current: true,
      features: [
        'Unlimited work orders',
        'Customer contact storage',
        'Mobile access',
        'Basic appliance database',
        'Parts tracking',
        'Repair history'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 49,
      interval: 'month',
      description: 'Coming soon - Advanced features for growing businesses',
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      features: [
        'Everything in Free',
        'AI-powered diagnostics',
        'Advanced analytics & insights',
        'Priority email support',
        'Custom branding',
        'API access'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      toast({
        title: "Current Plan",
        description: "You're currently using FixOps with all core features included.",
        variant: "default"
      });
      return;
    }

    toast({
      title: "Coming Soon",
      description: "Premium features are in development. Stay tuned for updates!",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-slate-100 mb-2">FixOps Plans</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Professional repair management for individual technicians and growing businesses
        </p>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative dark:bg-slate-800 dark:border-slate-700 ${
              plan.popular ? 'border-blue-500 dark:border-blue-400 scale-105' : ''
            } ${plan.current ? 'border-green-500 dark:border-green-400' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Coming Soon
              </Badge>
            )}
            
            {plan.current && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                Current Plan
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
                {plan.icon}
              </div>
              <CardTitle className="dark:text-slate-100">{plan.name}</CardTitle>
              <div className="text-3xl font-bold dark:text-slate-100">
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
                {plan.price > 0 && (
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                    /{plan.interval}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full ${
                  plan.current 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : ''
                }`}
                variant={plan.current ? 'default' : plan.popular ? 'default' : 'outline'}
                disabled={!plan.current && plan.id !== 'free'}
              >
                {plan.current ? 'Current Plan' : 
                 plan.id === 'free' ? 'Get Started Free' : 'Coming Soon'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        <p>FixOps is free to use with all core repair management features included.</p>
        <p className="mt-1">Premium features for advanced businesses coming soon!</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
