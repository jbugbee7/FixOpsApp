
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Phone, Mail, Calendar, MessageSquare, FileText, AlertTriangle } from 'lucide-react';
import { ContactInteraction } from '@/types/interaction';

interface CustomerInteractionsProps {
  customerId: number;
  interactions: ContactInteraction[];
}

const CustomerInteractions = ({ customerId, interactions }: CustomerInteractionsProps) => {
  const [selectedType, setSelectedType] = useState<string>('all');

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      case 'complaint': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredInteractions = selectedType === 'all' 
    ? interactions 
    : interactions.filter(interaction => interaction.interaction_type === selectedType);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Customer Interactions</CardTitle>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Interaction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="call">Calls</TabsTrigger>
            <TabsTrigger value="email">Emails</TabsTrigger>
            <TabsTrigger value="meeting">Meetings</TabsTrigger>
            <TabsTrigger value="note">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedType} className="mt-4">
            <div className="space-y-4">
              {filteredInteractions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No interactions found for this customer.</p>
                </div>
              ) : (
                filteredInteractions.map((interaction) => (
                  <div key={interaction.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                          {getInteractionIcon(interaction.interaction_type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{interaction.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(interaction.interaction_date).toLocaleDateString()} at{' '}
                            {new Date(interaction.interaction_date).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(interaction.priority)}>
                          {interaction.priority}
                        </Badge>
                        <Badge className={getStatusColor(interaction.status)}>
                          {interaction.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {interaction.description && (
                      <p className="text-sm text-muted-foreground pl-11">
                        {interaction.description}
                      </p>
                    )}
                    
                    {interaction.outcome && (
                      <div className="pl-11">
                        <p className="text-sm">
                          <span className="font-medium">Outcome:</span> {interaction.outcome}
                        </p>
                      </div>
                    )}
                    
                    {interaction.follow_up_date && (
                      <div className="pl-11">
                        <p className="text-sm text-orange-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Follow-up: {new Date(interaction.follow_up_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomerInteractions;
