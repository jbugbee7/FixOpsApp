
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  segment: string;
  totalOrders: number;
  totalSpent: number;
  lastContact: string;
  acquisitionDate: string;
  lifetime_value: number;
  avgOrderValue: number;
}

export interface CustomerSegment {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyMetric {
  month: string;
  revenue: number;
  customers: number;
}

export interface ContactInteraction {
  id: string;
  customer_id: number;
  interaction_type: string;
  subject: string;
  description?: string;
  interaction_date: string;
  status: string;
  priority: string;
  outcome?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunicationHistory {
  id: string;
  customer_id: number;
  type: string;
  subject?: string;
  content?: string;
  status: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
}
