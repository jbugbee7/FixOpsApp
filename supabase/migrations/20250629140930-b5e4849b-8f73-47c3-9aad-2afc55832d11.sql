
-- Create companies table
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  subscription_status text NOT NULL DEFAULT 'active',
  subscription_plan text NOT NULL DEFAULT 'basic',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  contact_email text,
  contact_phone text,
  address text,
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Add company_id columns to existing tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.invoices(id);
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.parts ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.inventory_items ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.appliance_models ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);

-- Create function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT company_id 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Create policy for companies - users can only see their own company
CREATE POLICY "Users can view their own company" 
  ON public.companies 
  FOR SELECT 
  USING (
    id = public.get_user_company_id()
  );

-- Create policy for companies - only company owners can update company info
CREATE POLICY "Company owners can update company" 
  ON public.companies 
  FOR UPDATE 
  USING (
    id = public.get_user_company_id() AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Update RLS policies for cases table (only if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cases' AND policyname = 'Users can view their own cases') THEN
    DROP POLICY "Users can view their own cases" ON public.cases;
  END IF;
END $$;

CREATE POLICY "Users can view cases from their company" 
  ON public.cases 
  FOR SELECT 
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can create cases for their company" 
  ON public.cases 
  FOR INSERT 
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update cases from their company" 
  ON public.cases 
  FOR UPDATE 
  USING (company_id = public.get_user_company_id());

-- Create function to create a new company and assign the user as owner
CREATE OR REPLACE FUNCTION public.create_company_and_assign_owner(
  company_name text,
  owner_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_company_id uuid;
BEGIN
  -- Create the company
  INSERT INTO public.companies (name)
  VALUES (company_name)
  RETURNING id INTO new_company_id;
  
  -- Update the user's profile to link to this company
  UPDATE public.profiles 
  SET company_id = new_company_id
  WHERE id = owner_user_id;
  
  -- Assign admin role to the user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (owner_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN new_company_id;
END;
$$;
