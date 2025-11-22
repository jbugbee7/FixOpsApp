import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, scheduleData, accessToken } = await req.json();

    console.log('Google Calendar Sync:', action, 'for user:', user.id);

    switch (action) {
      case 'create_event': {
        if (!accessToken || !scheduleData) {
          throw new Error('Missing required parameters');
        }

        const event = {
          summary: scheduleData.title || 'Work Order',
          description: scheduleData.notes || '',
          start: {
            dateTime: scheduleData.scheduled_start,
            timeZone: 'America/New_York',
          },
          end: {
            dateTime: scheduleData.scheduled_end,
            timeZone: 'America/New_York',
          },
          location: scheduleData.location || '',
        };

        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Google Calendar API error:', errorText);
          throw new Error(`Failed to create calendar event: ${response.status}`);
        }

        const calendarEvent = await response.json();
        console.log('Created calendar event:', calendarEvent.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            eventId: calendarEvent.id,
            eventLink: calendarEvent.htmlLink 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_event': {
        if (!accessToken || !scheduleData || !scheduleData.calendarEventId) {
          throw new Error('Missing required parameters');
        }

        const event = {
          summary: scheduleData.title || 'Work Order',
          description: scheduleData.notes || '',
          start: {
            dateTime: scheduleData.scheduled_start,
            timeZone: 'America/New_York',
          },
          end: {
            dateTime: scheduleData.scheduled_end,
            timeZone: 'America/New_York',
          },
          location: scheduleData.location || '',
        };

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${scheduleData.calendarEventId}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Google Calendar API error:', errorText);
          throw new Error(`Failed to update calendar event: ${response.status}`);
        }

        const calendarEvent = await response.json();
        console.log('Updated calendar event:', calendarEvent.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            eventId: calendarEvent.id,
            eventLink: calendarEvent.htmlLink 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete_event': {
        if (!accessToken || !scheduleData.calendarEventId) {
          throw new Error('Missing required parameters');
        }

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${scheduleData.calendarEventId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok && response.status !== 410) {
          const errorText = await response.text();
          console.error('Google Calendar API error:', errorText);
          throw new Error(`Failed to delete calendar event: ${response.status}`);
        }

        console.log('Deleted calendar event:', scheduleData.calendarEventId);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in google-calendar-sync:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});