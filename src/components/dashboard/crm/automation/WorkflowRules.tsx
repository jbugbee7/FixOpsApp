import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Zap, Mail, Phone, Calendar, User } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  execution_count: number;
}

const WorkflowRules = () => {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { session } = useAuth();

  // Fetch workflow rules from database
  const fetchRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workflow_rules')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error fetching workflow rules:', error);
      toast({
        title: "Error",
        description: "Failed to load workflow rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();

    // Set up real-time subscription
    const channel = supabase
      .channel('workflow-rules-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workflow_rules'
        },
        () => {
          console.log('Workflow rules changed, refreshing');
          fetchRules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleRule = async (id: string, currentEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('workflow_rules')
        .update({ enabled: !currentEnabled })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Workflow rule ${!currentEnabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating workflow rule:', error);
      toast({
        title: "Error",
        description: "Failed to update workflow rule",
        variant: "destructive",
      });
    }
  };

  const getTriggerIcon = (trigger: string) => {
    if (trigger.includes('new')) return <User className="h-4 w-4" />;
    if (trigger.includes('days')) return <Calendar className="h-4 w-4" />;
    if (trigger.includes('value')) return <Zap className="h-4 w-4" />;
    return <Mail className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Workflow Automation Rules</CardTitle>
              <CardDescription>
                Automate repetitive tasks and streamline your CRM processes
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
              <Card key={rule.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1 p-2 rounded-lg bg-primary/10">
                        {getTriggerIcon(rule.trigger)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rule.name}</h4>
                          {rule.enabled ? (
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><span className="font-medium">Trigger:</span> {rule.trigger}</p>
                          <p><span className="font-medium">Action:</span> {rule.action}</p>
                          <p className="text-xs">Executed {rule.execution_count} times</p>
                        </div>
                      </div>
                    </div>
                      <div className="flex flex-col items-end gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id, rule.enabled)}
                      />
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowRules;
