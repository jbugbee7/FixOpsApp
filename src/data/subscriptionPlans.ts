
import { Plan } from '@/types/subscription';

export const subscriptionPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Perfect for getting started',
    icon: 'Zap',
    current: true,
    features: [
      'Up to 10 work orders per month',
      'Basic customer contact storage',
      'Mobile access',
      'Basic appliance database',
      'Email support'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 15,
    interval: 'month',
    description: 'Great for growing repair businesses',
    icon: 'Crown',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited work orders',
      'Advanced parts tracking',
      'Customer repair history',
      'Priority email support',
      'Basic analytics'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    interval: 'month',
    description: 'Advanced features for established technicians',
    icon: 'Crown',
    features: [
      'Everything in Standard',
      'AI-powered diagnostics',
      'Advanced analytics & insights',
      'Custom branding',
      'API access',
      'Phone support'
    ]
  }
];
