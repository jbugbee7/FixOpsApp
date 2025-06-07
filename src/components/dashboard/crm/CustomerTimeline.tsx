
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Edit, Plus, CreditCard, CheckCircle, MessageSquare, FileText } from 'lucide-react';
import { CustomerTimelineEntry } from '@/types/interaction';

interface CustomerTimelineProps {
  customerId: number;
  timeline: CustomerTimelineEntry[];
}

const CustomerTimeline = ({ customerId, timeline }: CustomerTimelineProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return <Plus className="h-4 w-4" />;
      case 'updated': return <Edit className="h-4 w-4" />;
      case 'interaction_added': return <MessageSquare className="h-4 w-4" />;
      case 'note_added': return <FileText className="h-4 w-4" />;
      case 'order_placed': return <Plus className="h-4 w-4" />;
      case 'payment_received': return <CreditCard className="h-4 w-4" />;
      case 'service_completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'updated': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'interaction_added': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'note_added': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'order_placed': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'payment_received': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'service_completed': return 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTimeline.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity found for this customer.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTimeline.map((entry, index) => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${getActivityColor(entry.activity_type)}`}>
                    {getActivityIcon(entry.activity_type)}
                  </div>
                  {index < sortedTimeline.length - 1 && (
                    <div className="w-px h-8 bg-border mt-2" />
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{entry.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {formatActivityType(entry.activity_type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString()} at{' '}
                        {new Date(entry.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {entry.description}
                    </p>
                  )}
                  
                  {(entry.old_value || entry.new_value) && (
                    <div className="text-xs bg-muted p-2 rounded">
                      {entry.old_value && (
                        <div>
                          <span className="font-medium">From:</span> {entry.old_value}
                        </div>
                      )}
                      {entry.new_value && (
                        <div>
                          <span className="font-medium">To:</span> {entry.new_value}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {entry.user_id && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Updated by user</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerTimeline;
