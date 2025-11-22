-- Create workflow_rules table for CRM automation
CREATE TABLE IF NOT EXISTS public.workflow_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL,
  action TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workflow_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view workflow rules from their company
CREATE POLICY "Users can view workflow rules from their company"
  ON public.workflow_rules
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Policy: Users can manage workflow rules in their company
CREATE POLICY "Users can manage workflow rules in their company"
  ON public.workflow_rules
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_workflow_rules_updated_at
  BEFORE UPDATE ON public.workflow_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default workflow rules for existing companies
INSERT INTO public.workflow_rules (company_id, name, trigger, action, enabled, execution_count)
SELECT 
  id as company_id,
  'New Lead Assignment',
  'When a new customer is added',
  'Assign to available technician',
  true,
  24
FROM public.companies
ON CONFLICT DO NOTHING;

INSERT INTO public.workflow_rules (company_id, name, trigger, action, enabled, execution_count)
SELECT 
  id as company_id,
  'Follow-up Reminder',
  '3 days after service completion',
  'Send follow-up email',
  true,
  18
FROM public.companies
ON CONFLICT DO NOTHING;

INSERT INTO public.workflow_rules (company_id, name, trigger, action, enabled, execution_count)
SELECT 
  id as company_id,
  'High-Value Customer Alert',
  'Customer lifetime value exceeds $1000',
  'Notify sales team',
  false,
  7
FROM public.companies
ON CONFLICT DO NOTHING;

INSERT INTO public.workflow_rules (company_id, name, trigger, action, enabled, execution_count)
SELECT 
  id as company_id,
  'Inactive Customer Re-engagement',
  'No contact for 60 days',
  'Send re-engagement email',
  true,
  12
FROM public.companies
ON CONFLICT DO NOTHING;