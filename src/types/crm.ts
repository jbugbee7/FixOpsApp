
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
