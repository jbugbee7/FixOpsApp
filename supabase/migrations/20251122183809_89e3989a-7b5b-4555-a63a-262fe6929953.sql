-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can manage customers in their company" ON public.customers;
DROP POLICY IF EXISTS "Users can view customers from their company" ON public.customers;

-- Allow admins to view all customers in their company
CREATE POLICY "Admins can view customers in their company" ON public.customers
FOR SELECT
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow technicians to view customers in their company
CREATE POLICY "Technicians can view customers in their company" ON public.customers
FOR SELECT
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'technician')
);

-- Allow admins to insert customers in their company
CREATE POLICY "Admins can insert customers in their company" ON public.customers
FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update customers in their company
CREATE POLICY "Admins can update customers in their company" ON public.customers
FOR UPDATE
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete customers in their company
CREATE POLICY "Admins can delete customers in their company" ON public.customers
FOR DELETE
USING (
  company_id IN (
    SELECT company_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
  AND public.has_role(auth.uid(), 'admin')
);