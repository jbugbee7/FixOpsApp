
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  const [loading, setLoading] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'forever',
      description: 'Perfect for individual repair technicians',
      icon: <Zap className="h-6 w-6" />,
      features: [
        'Up to 5 work orders per month',
        '1 team member',
        'Basic work order management',
        'Customer contact storage',
        'Mobile access',
        'Basic appliance database'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 29,
      interval: 'month',
      description: 'Ideal for small repair shops',
      icon: <Star className="h-6 w-6" />,
      popular: true,
      features: [
        'Up to 50 work orders per month',
        'Up to 5 team members',
        'AI-powered diagnostics (10 per month)',
        'Advanced analytics & insights',
        'Priority email support',
        'Parts inventory tracking',
        'Customer history tracking'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 49,
      interval: 'month',
      description: 'For growing repair businesses',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Unlimited work orders',
        'Up to 25 team members',
        'Unlimited AI assistance',
        'Custom branding & colors',
        'Advanced reporting & analytics',
        'Priority support',
        'Custom workflows',
        'API access'
      ]
    },
    {
      id: 'company',
      name: 'Company',
      price: 99,
      interval: 'month',
      description: 'For large operations & franchises',
      icon: <Building2 className="h-6 w-6" />,
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Multi-location support',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced security features',
        'Custom training & onboarding'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') {
      toast({
        title: "Already on Free Plan",
        description: "You're currently using the free tier of FixOps.",
        variant: "default"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    setLoading(planId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-slate-100 mb-2">FixOps Subscription Plans</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Unlock powerful features to grow your repair business
        </p>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative dark:bg-slate-800 dark:border-slate-700 ${
              plan.popular ? 'border-blue-500 dark:border-blue-400 scale-105' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Most Popular
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
                disabled={loading === plan.id}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : plan.id === 'free'
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : ''
                }`}
                variant={plan.popular ? 'default' : plan.id === 'free' ? 'secondary' : 'outline'}
              >
                {loading === plan.id ? 'Processing...' : 
                 plan.id === 'free' ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        <p>All paid plans include a 14-day free trial. Cancel anytime.</p>
        <p className="mt-1">Secure payments powered by Stripe</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
