
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RealtimeConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('connection-test')
      .on('broadcast', { event: 'test' }, () => {
        // This is just for testing the connection
      })
      .subscribe((status) => {
        console.log('Realtime connection status:', status);
        
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          setLastUpdate(new Date());
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setConnectionStatus('disconnected');
        } else {
          setConnectionStatus('connecting');
        }
      });

    // Test connection every 30 seconds
    const interval = setInterval(() => {
      if (connectionStatus === 'connected') {
        setLastUpdate(new Date());
      }
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [connectionStatus]);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3" />;
      case 'disconnected':
        return <WifiOff className="h-3 w-3" />;
      case 'connecting':
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Real-time Connected';
      case 'disconnected':
        return 'Real-time Disconnected';
      case 'connecting':
        return 'Connecting...';
    }
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <Badge variant="outline" className={`${getStatusColor()} border`}>
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </Badge>
      {lastUpdate && connectionStatus === 'connected' && (
        <span className="text-gray-500">
          Last update: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default RealtimeConnectionStatus;
