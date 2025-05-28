
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from 'lucide-react';
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
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      interval: 'month',
      description: 'Perfect for small repair shops',
      icon: <Zap className="h-6 w-6" />,
      features: [
        'Up to 50 work orders per month',
        'Basic analytics',
        'Email support',
        'Mobile access',
        'Customer management'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 19.99,
      interval: 'month',
      description: 'Ideal for growing businesses',
      icon: <Star className="h-6 w-6" />,
      popular: true,
      features: [
        'Unlimited work orders',
        'Advanced analytics & insights',
        'AI-powered diagnostics',
        'Priority support',
        'Custom branding',
        'Parts inventory tracking',
        'Advanced reporting'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 39.99,
      interval: 'month',
      description: 'For large operations',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Everything in Professional',
        'Multi-location support',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced security features',
        'Custom training',
        'API access',
        'White-label solution'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
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
        <h2 className="text-2xl font-bold dark:text-slate-100 mb-2">Choose Your Plan</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Unlock powerful features to grow your repair business
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative dark:bg-slate-800 dark:border-slate-700 ${
              plan.popular ? 'border-blue-500 dark:border-blue-400' : ''
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
                ${plan.price}
                <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                  /{plan.interval}
                </span>
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
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {loading === plan.id ? 'Processing...' : `Subscribe to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        <p>All plans include a 14-day free trial. Cancel anytime.</p>
        <p className="mt-1">Secure payments powered by Stripe</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
