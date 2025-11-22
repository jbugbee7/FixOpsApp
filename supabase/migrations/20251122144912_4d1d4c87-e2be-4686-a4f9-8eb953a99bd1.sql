-- Add INSERT policy for conversations table to allow users to create conversations
CREATE POLICY "Users can create conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow creating conversations without company_id (for AI assistant)
  company_id IS NULL 
  OR 
  -- Or allow creating conversations in their own company
  company_id IN (
    SELECT profiles.company_id
    FROM profiles
    WHERE profiles.id = auth.uid()
  )
);