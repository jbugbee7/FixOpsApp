import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Truck, ClipboardList, Users } from 'lucide-react';
import { useSchedulingData } from '@/hooks/useSchedulingData';
import SchedulingCalendar from '@/components/scheduling/SchedulingCalendar';
import DispatchingBoard from '@/components/scheduling/DispatchingBoard';
import ChecklistManager from '@/components/scheduling/ChecklistManager';
import { useToast } from '@/hooks/use-toast';

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
    assignTechnician,
    optimizeRoute
  } = useSchedulingData();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('calendar');

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

  const handleCreateSchedule = () => {
    // This would open a schedule creation dialog
    toast({
      title: 'Create Schedule',
      description: 'Schedule creation feature will be implemented.',
    });
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
    try {
      await optimizeRoute(technicianId, date);
      toast({
        title: 'Route Optimized',
        description: 'The technician\'s route has been optimized for maximum efficiency.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to optimize route. Please try again.',
        variant: 'destructive',
      });
    }
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
};

export default SchedulingPage;