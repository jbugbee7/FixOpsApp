import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID')!;
    const clientSecret = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET')!;
    
    if (!clientId || !clientSecret) {
      throw new Error('Google Calendar credentials not configured');
    }

    const { action, code, redirectUri } = await req.json();

    console.log('Google Calendar Auth:', action);

    switch (action) {
      case 'get_auth_url': {
        const scopes = [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
        ];

        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', scopes.join(' '));
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', 'consent');

        return new Response(
          JSON.stringify({ authUrl: authUrl.toString() }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'exchange_code': {
        if (!code || !redirectUri) {
          throw new Error('Missing authorization code or redirect URI');
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          }),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token exchange error:', errorText);
          throw new Error('Failed to exchange authorization code');
        }

        const tokens = await tokenResponse.json();
        console.log('Successfully exchanged code for tokens');

        return new Response(
          JSON.stringify({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresIn: tokens.expires_in,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'refresh_token': {
        const { refreshToken } = await req.json();
        
        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
          }),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token refresh error:', errorText);
          throw new Error('Failed to refresh access token');
        }

        const tokens = await tokenResponse.json();
        console.log('Successfully refreshed access token');

        return new Response(
          JSON.stringify({
            accessToken: tokens.access_token,
            expiresIn: tokens.expires_in,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in google-calendar-auth:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});