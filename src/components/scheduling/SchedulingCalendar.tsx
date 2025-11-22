import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Clock, User, MapPin, Plus } from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';

interface SchedulingCalendarProps {
  schedules: any[];
  technicians: any[];
  onScheduleUpdate: (id: string, updates: any) => void;
  onCreateSchedule: () => void;
}

export const SchedulingCalendar: React.FC<SchedulingCalendarProps> = ({
  schedules,
  technicians,
  onScheduleUpdate,
  onCreateSchedule
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Get schedules for a specific date
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => 
      isSameDay(new Date(schedule.scheduled_start), date)
    );
  };

  // Get schedules for selected date
  const selectedDateSchedules = getSchedulesForDate(selectedDate);

  // Navigate months
  const goToPreviousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    setSelectedDate(today);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Calendar View */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            {format(viewDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                setShowDetailsDialog(true);
              }
            }}
            month={viewDate}
            onMonthChange={setViewDate}
            className="rounded-md border"
            modifiers={{
              hasSchedule: (date) => getSchedulesForDate(date).length > 0
            }}
            modifiersClassNames={{
              hasSchedule: 'font-bold relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary'
            }}
          />
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-muted-foreground">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List for Selected Date */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">
            {format(selectedDate, 'MMM dd, yyyy')}
          </CardTitle>
          <Button size="sm" onClick={onCreateSchedule}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedDateSchedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No schedules for this date</p>
            </div>
          ) : (
            selectedDateSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setShowDetailsDialog(true)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(schedule.status)}`}></div>
                    <span className="font-medium text-sm">
                      Job #{schedule.id.slice(0, 8)}
                    </span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(schedule.status)} className="text-xs">
                    {schedule.status}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(schedule.scheduled_start), 'h:mm a')} - 
                      {format(new Date(schedule.scheduled_end), 'h:mm a')}
                    </span>
                  </div>
                  
                  {schedule.technician && (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{schedule.technician.name}</span>
                    </div>
                  )}
                  
                  {schedule.case?.customer_id && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">Customer Job</span>
                    </div>
                  )}
                </div>
                
                {schedule.notes && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {schedule.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Schedule Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedules for {format(selectedDate, 'MMMM dd, yyyy')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedDateSchedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No schedules for this date</p>
                <Button className="mt-4" onClick={onCreateSchedule}>
                  Create New Schedule
                </Button>
              </div>
            ) : (
              selectedDateSchedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Job #{schedule.id.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(schedule.scheduled_start), 'h:mm a')} - 
                          {format(new Date(schedule.scheduled_end), 'h:mm a')}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </div>

                    {schedule.technician && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Technician</p>
                        <p className="text-sm text-muted-foreground">{schedule.technician.name}</p>
                      </div>
                    )}

                    {schedule.notes && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-muted-foreground">{schedule.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onScheduleUpdate(schedule.id, { status: 'in_progress' })}
                      >
                        Start Job
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onScheduleUpdate(schedule.id, { status: 'completed' })}
                      >
                        Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
