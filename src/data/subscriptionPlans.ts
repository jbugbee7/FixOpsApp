
import { Zap, Crown } from 'lucide-react';
import { Plan } from '@/types/subscription';

export const subscriptionPlans: Plan[] = [
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
