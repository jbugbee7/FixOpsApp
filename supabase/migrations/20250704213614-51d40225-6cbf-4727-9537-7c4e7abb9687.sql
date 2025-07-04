-- Fix critical privacy issues in RLS policies
-- Remove overly permissive policies that allow cross-company data access

-- Cases table - Remove policies that allow viewing all cases
DROP POLICY IF EXISTS "All authenticated users can view all cases" ON public.cases;
DROP POLICY IF EXISTS "All users can view all cases" ON public.cases;
DROP POLICY IF EXISTS "Authenticated users can view all work orders" ON public.cases;
DROP POLICY IF EXISTS "All authenticated users can delete all cases" ON public.cases;
DROP POLICY IF EXISTS "All authenticated users can update all cases" ON public.cases;
DROP POLICY IF EXISTS "All users can update all cases" ON public.cases;

-- Keep only company-based and user-based access policies for cases
-- The good policies that remain:
-- - "Users can view cases from their company" 
-- - "Users can create cases for their company"
-- - "Users can update cases from their company"

-- Communication History - Remove policy that allows viewing all communication
DROP POLICY IF EXISTS "Users can view all communication history" ON public.communication_history;

-- Add proper company-based policy for communication history
CREATE POLICY "Users can view communication history from their company" 
ON public.communication_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.company_id = (
      SELECT c.company_id FROM public.cases c WHERE c.id = communication_history.customer_id::text::uuid
    )
  )
);

-- Contact Interactions - Remove policy that allows viewing all interactions
DROP POLICY IF EXISTS "Users can view all contact interactions" ON public.contact_interactions;

-- Add proper company-based policy for contact interactions
CREATE POLICY "Users can view contact interactions from their company" 
ON public.contact_interactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.company_id = (
      SELECT c.company_id FROM public.cases c WHERE c.id = contact_interactions.customer_id::text::uuid
    )
  )
);

-- Customer Notes - Remove policy that allows viewing all notes
DROP POLICY IF EXISTS "Users can view all customer notes" ON public.customer_notes;

-- Add proper company-based policy for customer notes
CREATE POLICY "Users can view customer notes from their company" 
ON public.customer_notes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.company_id = (
      SELECT c.company_id FROM public.cases c WHERE c.id = customer_notes.customer_id::text::uuid
    )
  )
);

-- Customer Timeline - Remove policy that allows viewing all timeline entries
DROP POLICY IF EXISTS "Users can view all customer timeline entries" ON public.customer_timeline;

-- Add proper company-based policy for customer timeline
CREATE POLICY "Users can view customer timeline from their company" 
ON public.customer_timeline 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.company_id = (
      SELECT c.company_id FROM public.cases c WHERE c.id = customer_timeline.customer_id::text::uuid
    )
  )
);

-- Clean up duplicate/redundant policies on cases table
DROP POLICY IF EXISTS "All users can create cases" ON public.cases;
DROP POLICY IF EXISTS "All users can insert cases" ON public.cases;
DROP POLICY IF EXISTS "Allow all authenticated users to insert cases" ON public.cases;
DROP POLICY IF EXISTS "Allow all authenticated users to update cases" ON public.cases;
DROP POLICY IF EXISTS "Users can update their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can delete their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can view their own work orders" ON public.cases;
DROP POLICY IF EXISTS "cases_insert_own" ON public.cases;
DROP POLICY IF EXISTS "cases_select_own" ON public.cases;
DROP POLICY IF EXISTS "cases_update_own" ON public.cases;

-- Ensure AI chatbot and fix chat data remain universally accessible
-- Forum messages (fix chat) should remain accessible to conversation members
-- Parts table should remain accessible for AI chatbot recommendations
-- (These policies are already correctly configured)