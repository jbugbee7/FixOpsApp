
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user ID from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Verify the JWT token and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const cacheKey = `cases_${user.id}`;
    const now = Date.now();
    
    // Check if the data is already cached and not expired
    if (cache.has(cacheKey)) {
      const cachedEntry = cache.get(cacheKey);
      if (now - cachedEntry.timestamp < CACHE_TTL) {
        console.log('Cache hit for user:', user.id);
        return new Response(JSON.stringify(cachedEntry.data), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json', 
            'X-Cache': 'HIT'
          },
        });
      } else {
        // Remove expired cache entry
        cache.delete(cacheKey);
      }
    }

    console.log('Cache miss for user:', user.id, 'fetching fresh data');

    // Fetch data from Supabase cases table
    const { data, error } = await supabaseClient
      .from('cases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Cache the data with timestamp
    cache.set(cacheKey, {
      data: data || [],
      timestamp: now
    });

    console.log('Cached fresh data for user:', user.id, 'cases:', data?.length || 0);

    return new Response(JSON.stringify(data || []), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json', 
        'X-Cache': 'MISS'
      },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
