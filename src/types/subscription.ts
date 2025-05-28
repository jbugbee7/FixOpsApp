
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  icon: string;
  popular?: boolean;
  current?: boolean;
}
