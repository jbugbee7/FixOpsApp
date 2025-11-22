import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Calendar, Mail, Phone, AlertCircle, Plus } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  type: 'email' | 'call' | 'meeting' | 'followup';
  customer: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

const AutomatedTasks = () => {
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: "Follow-up call with customer",
      type: 'call',
      customer: "John Smith",
      dueDate: "2024-01-20",
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: "Send service satisfaction survey",
      type: 'email',
      customer: "Sarah Johnson",
      dueDate: "2024-01-19",
      status: 'overdue',
      priority: 'medium'
    },
    {
      id: 3,
      title: "Schedule maintenance check",
      type: 'meeting',
      customer: "Mike Davis",
      dueDate: "2024-01-22",
      status: 'pending',
      priority: 'low'
    },
    {
      id: 4,
      title: "Follow-up on quote approval",
      type: 'followup',
      customer: "Emma Wilson",
      dueDate: "2024-01-18",
      status: 'completed',
      priority: 'high'
    }
  ]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-secondary/10 text-secondary"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive/10 text-destructive"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const filterTasks = (status: string) => {
    if (status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Automated Tasks</CardTitle>
            <CardDescription>
              Tasks automatically created based on your workflow rules
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({tasks.filter(t => t.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({tasks.filter(t => t.status === 'overdue').length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({tasks.filter(t => t.status === 'completed').length})</TabsTrigger>
          </TabsList>

          {['all', 'pending', 'overdue', 'completed'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-3">
              {filterTasks(status).map((task) => (
                <Card key={task.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1 p-2 rounded-lg bg-muted">
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{task.title}</h4>
                            {getStatusBadge(task.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Customer: {task.customer}</p>
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                            <p className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              Priority: {task.priority.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {task.status === 'completed' ? 'View' : 'Complete'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AutomatedTasks;
