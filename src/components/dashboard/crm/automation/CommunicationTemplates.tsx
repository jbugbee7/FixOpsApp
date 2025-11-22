import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Plus, Eye, Copy, Edit, Trash2 } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  subject: string;
  type: 'email' | 'sms';
  category: string;
  usageCount: number;
  content: string;
}

const CommunicationTemplates = () => {
  const [templates] = useState<Template[]>([
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to Our Service!",
      type: 'email',
      category: 'onboarding',
      usageCount: 45,
      content: "Hi {{customer_name}},\n\nThank you for choosing our service! We're excited to work with you..."
    },
    {
      id: 2,
      name: "Service Completion Follow-up",
      subject: "How was your service experience?",
      type: 'email',
      category: 'followup',
      usageCount: 32,
      content: "Hi {{customer_name}},\n\nWe hope you're satisfied with the service we provided..."
    },
    {
      id: 3,
      name: "Appointment Reminder",
      subject: "",
      type: 'sms',
      category: 'reminder',
      usageCount: 78,
      content: "Hi {{customer_name}}, this is a reminder about your appointment on {{appointment_date}}. Reply YES to confirm."
    },
    {
      id: 4,
      name: "Quote Follow-up",
      subject: "Following up on your quote",
      type: 'email',
      category: 'sales',
      usageCount: 23,
      content: "Hi {{customer_name}},\n\nI wanted to follow up on the quote we sent you..."
    },
    {
      id: 5,
      name: "Service Reminder",
      subject: "",
      type: 'sms',
      category: 'reminder',
      usageCount: 56,
      content: "Hi {{customer_name}}, it's time for your annual maintenance check. Call us to schedule!"
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'onboarding': return 'bg-primary/10 text-primary';
      case 'followup': return 'bg-secondary/10 text-secondary';
      case 'reminder': return 'bg-accent/10 text-accent';
      case 'sales': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filterTemplates = (type: 'all' | 'email' | 'sms') => {
    if (type === 'all') return templates;
    return templates.filter(t => t.type === type);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Communication Templates</CardTitle>
            <CardDescription>
              Pre-built email and SMS templates for automated communications
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Templates ({templates.length})</TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email ({templates.filter(t => t.type === 'email').length})
            </TabsTrigger>
            <TabsTrigger value="sms">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS ({templates.filter(t => t.type === 'sms').length})
            </TabsTrigger>
          </TabsList>

          {['all', 'email', 'sms'].map((type) => (
            <TabsContent key={type} value={type} className="space-y-3">
              {filterTemplates(type as 'all' | 'email' | 'sms').map((template) => (
                <Card key={template.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        {template.type === 'email' ? (
                          <Mail className="h-5 w-5" />
                        ) : (
                          <MessageSquare className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge className={getCategoryColor(template.category)}>
                                {template.category}
                              </Badge>
                            </div>
                            {template.subject && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Subject: {template.subject}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            Used {template.usageCount} times
                          </Badge>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-muted/30 mb-3">
                          <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
                            {template.content}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-3 w-3 mr-1" />
                            Duplicate
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <Card className="mt-6 border-border/50 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-base">Available Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <code className="px-2 py-1 rounded bg-muted">{'{{customer_name}}'}</code>
              <code className="px-2 py-1 rounded bg-muted">{'{{customer_email}}'}</code>
              <code className="px-2 py-1 rounded bg-muted">{'{{customer_phone}}'}</code>
              <code className="px-2 py-1 rounded bg-muted">{'{{appointment_date}}'}</code>
              <code className="px-2 py-1 rounded bg-muted">{'{{service_type}}'}</code>
              <code className="px-2 py-1 rounded bg-muted">{'{{total_cost}}'}</code>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Use these variables in your templates to automatically insert customer-specific information
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default CommunicationTemplates;
