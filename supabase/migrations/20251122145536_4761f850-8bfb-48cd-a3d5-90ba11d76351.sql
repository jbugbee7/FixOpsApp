-- Fix infinite recursion in RLS policy for conversation_members
ALTER POLICY "Users can view members of their conversations"
ON public.conversation_members
USING (
  -- Users can always see their own membership rows
  user_id = auth.uid()
  OR
  -- Users can see members of conversations that belong to their company
  conversation_id IN (
    SELECT c.id
    FROM public.conversations c
    LEFT JOIN public.profiles p ON p.company_id = c.company_id
    WHERE p.id = auth.uid()
       OR c.company_id IS NULL
  )
);