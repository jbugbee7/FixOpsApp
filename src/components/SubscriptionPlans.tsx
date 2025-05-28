
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
        title: "Free Plan",
        description: "You're using the free plan with basic features included.",
        variant: "default"
      });
      return;
    }

    if (planId === 'standard') {
      toast({
        title: "Standard Plan",
        description: "Standard plan subscription coming soon! This will include unlimited work orders and advanced features.",
        variant: "default"
      });
      return;
    }

    if (planId === 'pro') {
      toast({
        title: "Professional Plan",
        description: "Professional plan subscription coming soon! This will include AI diagnostics and premium support.",
        variant: "default"
      });
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold dark:text-slate-100 mb-2">Choose Your Plan</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Professional repair management for individual technicians
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        <p>Start with our free plan and upgrade as your business grows.</p>
        <p className="mt-1">All plans include mobile access and customer management.</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
