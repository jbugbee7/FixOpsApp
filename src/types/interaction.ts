
export interface ContactInteraction {
  id: string;
  customer_id: number;
  user_id: string;
  interaction_type: 'call' | 'email' | 'meeting' | 'note' | 'follow_up' | 'service_visit' | 'complaint' | 'quote_request';
  subject: string;
  description?: string;
  interaction_date: string;
  follow_up_date?: string;
  status: 'completed' | 'pending' | 'scheduled' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  outcome?: string;
  attachments: any[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CustomerNote {
  id: string;
  customer_id: number;
  user_id: string;
  title: string;
  content: string;
  note_type: 'general' | 'technical' | 'billing' | 'support' | 'sales' | 'internal';
  is_pinned: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomerTimelineEntry {
  id: string;
  customer_id: number;
  user_id?: string;
  activity_type: 'created' | 'updated' | 'status_changed' | 'interaction_added' | 'note_added' | 'order_placed' | 'payment_received' | 'service_completed';
  title: string;
  description?: string;
  old_value?: string;
  new_value?: string;
  metadata: Record<string, any>;
  created_at: string;
}
