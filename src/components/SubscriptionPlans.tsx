
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { subscriptionPlans } from '@/data/subscriptionPlans';
import PlanCard from '@/components/subscription/PlanCard';

const SubscriptionPlans = () => {
  const { user } = useAuth();

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
        {subscriptionPlans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onSubscribe={handleSubscribe}
          />
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
