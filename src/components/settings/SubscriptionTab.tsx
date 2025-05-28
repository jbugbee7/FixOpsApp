
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PlanCard from "@/components/subscription/PlanCard";
import { subscriptionPlans } from '@/data/subscriptionPlans';
import { toast } from "@/hooks/use-toast";

const SubscriptionTab = () => {
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
    <div className="space-y-6 mt-0">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Subscription Plans</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Choose the plan that fits your repair business needs
        </p>
        
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {subscriptionPlans.map((plan) => (
                    <CarouselItem key={plan.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="h-full">
                        <PlanCard 
                          plan={plan} 
                          onSubscribe={handleSubscribe}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            
            <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
              <p>Start with our free plan and upgrade as your business grows.</p>
              <p className="mt-1">All plans include mobile access and customer management.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionTab;
