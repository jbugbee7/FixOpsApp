
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';
import { Plan } from '@/types/subscription';

interface PlanCardProps {
  plan: Plan;
  onSubscribe: (planId: string) => Promise<void>;
}

const PlanCard = ({ plan, onSubscribe }: PlanCardProps) => {
  return (
    <Card 
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
          onClick={() => onSubscribe(plan.id)}
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
  );
};

export default PlanCard;
