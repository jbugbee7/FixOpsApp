
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

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

    const url = new URL(req.url);
    const pathname = url.pathname;

    // Parse the request body
    const body = await req.json();

    // Route to handle specific event types
    if (pathname.includes('/handle-event') && req.method === 'POST') {
      const { eventType, payload } = body;

      console.log('Processing event:', eventType, payload);

      // Process the event based on its type
      switch (eventType) {
        case "USER_SIGNUP":
          // Handle user signup event
          console.log("User signed up:", payload);
          
          // You can add database operations here if needed
          // Example: Log the signup event
          if (payload?.userId) {
            const { error: logError } = await supabaseClient
              .from('event_logs')
              .insert({
                event_type: 'USER_SIGNUP',
                user_id: payload.userId,
                payload: payload,
                created_at: new Date().toISOString()
              });
            
            if (logError) {
              console.error('Error logging signup event:', logError);
            }
          }
          break;

        case "USER_LOGIN":
          // Handle user login event
          console.log("User logged in:", payload);
          
          // You can add database operations here if needed
          // Example: Update last login timestamp
          if (payload?.userId) {
            const { error: updateError } = await supabaseClient
              .from('profiles')
              .update({ 
                updated_at: new Date().toISOString()
              })
              .eq('id', payload.userId);
            
            if (updateError) {
              console.error('Error updating user login:', updateError);
            }
          }
          break;

        default:
          console.log("Unknown event type:", eventType);
      }

      return new Response(
        JSON.stringify({ message: "Event processed successfully" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Route to handle another hook
    if (pathname.includes('/another-event') && req.method === 'POST') {
      const { data } = body;
      
      console.log("Another event received:", data);
      
      // You can add specific processing logic here
      // Example: Store the event data
      const { error: storeError } = await supabaseClient
        .from('event_logs')
        .insert({
          event_type: 'ANOTHER_EVENT',
          payload: data,
          created_at: new Date().toISOString()
        });
      
      if (storeError) {
        console.error('Error storing another event:', storeError);
      }

      return new Response(
        JSON.stringify({ message: "Another event processed" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Default response for unmatched routes
    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
