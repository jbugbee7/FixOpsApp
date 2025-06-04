
-- Fix RLS policies to prevent infinite recursion
DROP POLICY IF EXISTS "Users can view conversations they are members of" ON conversations;
DROP POLICY IF EXISTS "Users can view conversation members" ON conversation_members;
DROP POLICY IF EXISTS "Users can view messages in conversations they are members of" ON forum_messages;

-- Create simplified RLS policies
CREATE POLICY "Users can view conversations they are members of" ON conversations
FOR SELECT USING (
  id IN (
    SELECT conversation_id 
    FROM conversation_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view conversation members" ON conversation_members
FOR SELECT USING (true);

CREATE POLICY "Users can view messages in conversations they are members of" ON forum_messages
FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id 
    FROM conversation_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages in conversations they are members of" ON forum_messages
FOR INSERT WITH CHECK (
  conversation_id IN (
    SELECT conversation_id 
    FROM conversation_members 
    WHERE user_id = auth.uid()
  )
);

-- Create the default "General Discussion" conversation if it doesn't exist
DO $$
DECLARE
    general_conv_id uuid;
    user_record record;
BEGIN
    -- Check if General Discussion conversation already exists
    SELECT id INTO general_conv_id
    FROM conversations
    WHERE name ILIKE '%general discussion%'
    LIMIT 1;
    
    -- If it doesn't exist, create it
    IF general_conv_id IS NULL THEN
        INSERT INTO conversations (name, description, created_by)
        VALUES (
            'General Discussion',
            'A place for general repair discussions and community chat',
            (SELECT id FROM auth.users LIMIT 1)
        )
        RETURNING id INTO general_conv_id;
        
        -- Add all existing users to the General Discussion
        FOR user_record IN SELECT id FROM auth.users LOOP
            INSERT INTO conversation_members (conversation_id, user_id)
            VALUES (general_conv_id, user_record.id)
            ON CONFLICT (conversation_id, user_id) DO NOTHING;
        END LOOP;
    ELSE
        -- If it exists, make sure all users are members
        FOR user_record IN SELECT id FROM auth.users LOOP
            INSERT INTO conversation_members (conversation_id, user_id)
            VALUES (general_conv_id, user_record.id)
            ON CONFLICT (conversation_id, user_id) DO NOTHING;
        END LOOP;
    END IF;
END $$;

-- Create a trigger to automatically add new users to General Discussion
CREATE OR REPLACE FUNCTION add_user_to_general_discussion()
RETURNS TRIGGER AS $$
DECLARE
    general_conv_id uuid;
BEGIN
    -- Find the General Discussion conversation
    SELECT id INTO general_conv_id
    FROM conversations
    WHERE name ILIKE '%general discussion%'
    LIMIT 1;
    
    -- Add the new user to General Discussion if it exists
    IF general_conv_id IS NOT NULL THEN
        INSERT INTO conversation_members (conversation_id, user_id)
        VALUES (general_conv_id, NEW.id)
        ON CONFLICT (conversation_id, user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
DROP TRIGGER IF EXISTS add_to_general_discussion_trigger ON profiles;
CREATE TRIGGER add_to_general_discussion_trigger
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION add_user_to_general_discussion();
