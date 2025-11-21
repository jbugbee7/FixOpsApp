import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nslufiaeuezvkhnjmehe.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbHVmaWFldWV6dmtobmptZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjM5MTEsImV4cCI6MjA3OTI5OTkxMX0.OlSlpGv1CsAVk2k3qYBHai1MvacPOwmTAXa0he6M4uQ';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
