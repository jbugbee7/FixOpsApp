
import React from 'react';

export interface Plan {
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
