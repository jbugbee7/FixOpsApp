-- First, let's make created_by nullable in conversations table if it isn't already
ALTER TABLE public.conversations ALTER COLUMN created_by DROP NOT NULL;

-- Create a universal "General Discussion" conversation accessible to all users
INSERT INTO public.conversations (id, name, description, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'General Discussion',
  'Universal discussion accessible to all users and companies',
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Update RLS policies to allow universal access to forum messages
-- Remove the existing restrictive policy
DROP POLICY IF EXISTS "Users can view messages in conversations they are members of" ON public.forum_messages;

-- Create new policy that allows viewing all messages in the general discussion
-- and maintains existing access for other conversations
CREATE POLICY "Universal access to general discussion and member access to others" 
ON public.forum_messages 
FOR SELECT 
USING (
  conversation_id = '00000000-0000-0000-0000-000000000001'::uuid 
  OR user_is_conversation_member(conversation_id, auth.uid())
);

-- Allow anyone to post in the general discussion
DROP POLICY IF EXISTS "Users can insert messages in conversations they are members of" ON public.forum_messages;

CREATE POLICY "Universal posting to general discussion and member posting to others" 
ON public.forum_messages 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  AND (
    conversation_id = '00000000-0000-0000-0000-000000000001'::uuid 
    OR user_is_conversation_member(conversation_id, auth.uid())
  )
);

-- Update conversations table to allow everyone to see the general discussion
DROP POLICY IF EXISTS "Users can view conversations they are members of" ON public.conversations;

CREATE POLICY "Universal access to general discussion and member access to others" 
ON public.conversations 
FOR SELECT 
USING (
  id = '00000000-0000-0000-0000-000000000001'::uuid 
  OR user_is_conversation_member(id, auth.uid())
);

-- Automatically add all existing users to the general discussion
INSERT INTO public.conversation_members (conversation_id, user_id)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  p.id
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.conversation_members cm 
  WHERE cm.conversation_id = '00000000-0000-0000-0000-000000000001'::uuid 
  AND cm.user_id = p.id
);

-- Create a trigger to automatically add new users to the general discussion
CREATE OR REPLACE FUNCTION public.add_user_to_general_discussion()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES ('00000000-0000-0000-0000-000000000001'::uuid, NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to profiles table to auto-add users to general discussion
DROP TRIGGER IF EXISTS add_to_general_discussion_trigger ON public.profiles;
CREATE TRIGGER add_to_general_discussion_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.add_user_to_general_discussion();