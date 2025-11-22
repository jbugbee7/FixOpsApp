import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface GoogleCalendarTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export const useGoogleCalendar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [tokens, setTokens] = useState<GoogleCalendarTokens | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load tokens from localStorage
    const savedTokens = localStorage.getItem('google_calendar_tokens');
    if (savedTokens) {
      const parsed = JSON.parse(savedTokens);
      setTokens(parsed);
      setIsConnected(true);
    }
  }, []);

  const connectGoogleCalendar = async () => {
    try {
      setIsLoading(true);
      const redirectUri = `${window.location.origin}/scheduling`;

      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'get_auth_url', redirectUri }
      });

      if (error) throw error;

      // Open Google OAuth in new window
      const authWindow = window.open(data.authUrl, '_blank', 'width=600,height=600');
      
      // Listen for the OAuth callback
      const handleCallback = async (event: MessageEvent) => {
        if (event.data.type === 'google_calendar_auth' && event.data.code) {
          authWindow?.close();
          
          // Exchange code for tokens
          const { data: tokenData, error: tokenError } = await supabase.functions.invoke('google-calendar-auth', {
            body: { 
              action: 'exchange_code', 
              code: event.data.code,
              redirectUri 
            }
          });

          if (tokenError) throw tokenError;

          const newTokens = {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            expiresAt: Date.now() + (tokenData.expiresIn * 1000),
          };

          localStorage.setItem('google_calendar_tokens', JSON.stringify(newTokens));
          setTokens(newTokens);
          setIsConnected(true);

          toast({
            title: 'Connected!',
            description: 'Google Calendar successfully connected',
          });

          window.removeEventListener('message', handleCallback);
        }
      };

      window.addEventListener('message', handleCallback);
    } catch (error: any) {
      console.error('Error connecting Google Calendar:', error);
      toast({
        title: 'Connection failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectGoogleCalendar = () => {
    localStorage.removeItem('google_calendar_tokens');
    setTokens(null);
    setIsConnected(false);
    toast({
      title: 'Disconnected',
      description: 'Google Calendar disconnected',
    });
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!tokens) return null;

    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
      try {
        const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
          body: { 
            action: 'refresh_token', 
            refreshToken: tokens.refreshToken 
          }
        });

        if (error) throw error;

        const newTokens = {
          ...tokens,
          accessToken: data.accessToken,
          expiresAt: Date.now() + (data.expiresIn * 1000),
        };

        localStorage.setItem('google_calendar_tokens', JSON.stringify(newTokens));
        setTokens(newTokens);

        return data.accessToken;
      } catch (error) {
        console.error('Error refreshing token:', error);
        disconnectGoogleCalendar();
        return null;
      }
    }

    return tokens.accessToken;
  };

  const syncJobToCalendar = async (scheduleData: any) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Not connected to Google Calendar');
      }

      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'create_event',
          scheduleData,
          accessToken,
        }
      });

      if (error) throw error;

      toast({
        title: 'Synced!',
        description: 'Job synced to Google Calendar',
      });

      return data;
    } catch (error: any) {
      console.error('Error syncing to calendar:', error);
      toast({
        title: 'Sync failed',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    isConnected,
    isLoading,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    syncJobToCalendar,
    getAccessToken,
  };
};