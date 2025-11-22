import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Truck, ClipboardList, Users, Clock, MapPin, Activity, CheckCircle } from 'lucide-react';
import { useSchedulingData } from '@/hooks/useSchedulingData';
import { SchedulingCalendar } from '@/components/scheduling/SchedulingCalendar';
import { DispatchingBoard } from '@/components/scheduling/DispatchingBoard';
import { ChecklistManager } from '@/components/scheduling/ChecklistManager';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

const SchedulingPage = () => {
  const {
    technicians,
    schedules,
    checklists,
    loading,
    error,
    createSchedule,
    updateSchedule,
    createTechnician,
    createChecklist,
    assignTechnician
  } = useSchedulingData();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('calendar');
  const isMobile = useIsMobile();
  const { 
    isConnected, 
    isLoading: calendarLoading, 
    connectGoogleCalendar, 
    disconnectGoogleCalendar 
  } = useGoogleCalendar();

  const handleScheduleUpdate = async (id: string, updates: any) => {
    try {
      await updateSchedule(id, updates);
      toast({
        title: 'Schedule Updated',
        description: 'The job schedule has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update schedule. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      await createSchedule(scheduleData);
      toast({
        title: 'Schedule Created',
        description: 'New job schedule has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create schedule. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleAssignTechnician = async (scheduleId: string, technicianId: string) => {
    try {
      await assignTechnician(scheduleId, technicianId);
      toast({
        title: 'Technician Assigned',
        description: 'The job has been assigned to the technician.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign technician. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleOptimizeRoute = async (technicianId: string, date: string) => {
    toast({
      title: 'Info',
      description: 'Route optimization feature coming soon.',
    });
  };

  const handleUpdateStatus = async (scheduleId: string, status: any) => {
    try {
      await updateSchedule(scheduleId, { status });
      toast({
        title: 'Status Updated',
        description: `Job status updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateChecklist = async (checklistData: any) => {
    try {
      await createChecklist(checklistData);
      toast({
        title: 'Checklist Created',
        description: 'New job checklist has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create checklist. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Error Loading Scheduling Data</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Mobile view (keep existing simple design)
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="flex-shrink-0 border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Job Scheduling & Dispatching</h1>
            <p className="text-muted-foreground">
              Manage appointments, dispatch technicians, and optimize routes
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-6 h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="dispatching" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Dispatching
                </TabsTrigger>
                <TabsTrigger value="checklists" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Checklists
                </TabsTrigger>
                <TabsTrigger value="technicians" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Technicians
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 mt-6 overflow-hidden">
                <TabsContent value="calendar" className="h-full">
                  <SchedulingCalendar
                    schedules={schedules}
                    technicians={technicians}
                    onScheduleUpdate={handleScheduleUpdate}
                    onCreateSchedule={handleCreateSchedule}
                  />
                </TabsContent>
                
                <TabsContent value="dispatching" className="h-full overflow-auto">
                  <DispatchingBoard
                    schedules={schedules}
                    technicians={technicians}
                    onAssignTechnician={handleAssignTechnician}
                    onOptimizeRoute={handleOptimizeRoute}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </TabsContent>
                
                <TabsContent value="checklists" className="h-full overflow-auto">
                  <ChecklistManager
                    checklists={checklists}
                    onCreateChecklist={handleCreateChecklist}
                    onUpdateChecklist={(id, updates) => console.log('Update checklist:', id, updates)}
                    onDeleteChecklist={(id) => console.log('Delete checklist:', id)}
                  />
                </TabsContent>
                
                <TabsContent value="technicians" className="h-full overflow-auto">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Technician Management</h3>
                      <p className="text-muted-foreground">
                        Technician management interface will be implemented here.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view (new detailed design)
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-shrink-0 border-b">
        <div className="max-w-7xl mx-auto px-6 py-1.5">
          <h1 className="text-xl font-bold mb-0">Job Scheduling & Dispatching</h1>
          <p className="text-xs text-muted-foreground">Manage appointments, dispatch technicians, and optimize routes</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-8 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger value="dispatching" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Dispatching
                  </TabsTrigger>
                  <TabsTrigger value="checklists" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Checklists
                  </TabsTrigger>
                  <TabsTrigger value="technicians" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Technicians
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1 mt-6 overflow-hidden">
                  <TabsContent value="calendar" className="h-full">
                    <SchedulingCalendar
                      schedules={schedules}
                      technicians={technicians}
                      onScheduleUpdate={handleScheduleUpdate}
                      onCreateSchedule={handleCreateSchedule}
                    />
                  </TabsContent>
                  
                  <TabsContent value="dispatching" className="h-full overflow-auto">
                    <DispatchingBoard
                      schedules={schedules}
                      technicians={technicians}
                      onAssignTechnician={handleAssignTechnician}
                      onOptimizeRoute={handleOptimizeRoute}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  </TabsContent>
                  
                  <TabsContent value="checklists" className="h-full overflow-auto">
                    <ChecklistManager
                      checklists={checklists}
                      onCreateChecklist={handleCreateChecklist}
                      onUpdateChecklist={(id, updates) => console.log('Update checklist:', id, updates)}
                      onDeleteChecklist={(id) => console.log('Delete checklist:', id)}
                    />
                  </TabsContent>
                  
                  <TabsContent value="technicians" className="h-full overflow-auto">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Technician Management</h3>
                        <p className="text-muted-foreground">
                          Technician management interface will be implemented here.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="col-span-4 space-y-6">
              {/* Google Calendar Integration */}
              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Google Calendar
                  </CardTitle>
                  <CardDescription>
                    {isConnected ? 'Sync jobs with Google Calendar' : 'Connect to sync jobs automatically'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isConnected ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Connected</span>
                      </div>
                      <Button
                        onClick={disconnectGoogleCalendar}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={connectGoogleCalendar}
                      disabled={calendarLoading}
                      className="w-full"
                      size="sm"
                    >
                      {calendarLoading ? 'Connecting...' : 'Connect Google Calendar'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Today's Overview</CardTitle>
                  <CardDescription>Current schedule status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <Badge variant="secondary">{schedules?.length || 0}</Badge>
                    </div>
                    <div className="text-2xl font-bold">{schedules?.filter(s => s.status === 'scheduled').length || 0}</div>
                    <p className="text-sm text-muted-foreground">Scheduled Jobs</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="h-5 w-5 text-accent" />
                      <Badge variant="secondary">{technicians?.length || 0}</Badge>
                    </div>
                    <div className="text-2xl font-bold">{technicians?.filter(t => t.is_active).length || 0}</div>
                    <p className="text-sm text-muted-foreground">Active Technicians</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <Badge variant="secondary">{schedules?.filter(s => s.status === 'completed').length || 0}</Badge>
                    </div>
                    <div className="text-2xl font-bold">{schedules?.filter(s => s.status === 'completed').length || 0}</div>
                    <p className="text-sm text-muted-foreground">Completed Today</p>
                  </div>
                </CardContent>
              </Card>

              {/* Active Jobs */}
              <Card className="rounded-2xl border-border/50">
                <CardHeader>
                  <CardTitle>Active Jobs</CardTitle>
                  <CardDescription>Currently in progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedules?.filter(s => s.status === 'in_progress').slice(0, 3).map((schedule, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                      <Activity className="h-4 w-4 text-accent mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Job #{schedule.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(schedule.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Schedule new job</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Optimize routes</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium">Manage technicians</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingPage;