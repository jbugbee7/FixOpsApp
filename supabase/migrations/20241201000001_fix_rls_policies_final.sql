
-- Fix RLS policies to work with the new conversation setup
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Admins can create conversations" ON conversations;
DROP POLICY IF EXISTS "Admins can update conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view all conversation members" ON conversation_members;
DROP POLICY IF EXISTS "Admins can manage conversation members" ON conversation_members;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_members;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON forum_messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON forum_messages;

-- Create new RLS policies for conversations
CREATE POLICY "Users can view conversations they are members of" ON conversations
FOR SELECT USING (
  public.user_is_conversation_member(id, auth.uid())
);

CREATE POLICY "Admins can create conversations" ON conversations
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update conversations" ON conversations
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create new RLS policies for conversation_members
CREATE POLICY "Users can view conversation members" ON conversation_members
FOR SELECT USING (true);

CREATE POLICY "Admins can manage conversation members" ON conversation_members
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Users can join conversations" ON conversation_members
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create new RLS policies for forum_messages
CREATE POLICY "Users can view messages in conversations they are members of" ON forum_messages
FOR SELECT USING (
  public.user_is_conversation_member(conversation_id, auth.uid())
);

CREATE POLICY "Users can insert messages in conversations they are members of" ON forum_messages
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  public.user_is_conversation_member(conversation_id, auth.uid())
);
