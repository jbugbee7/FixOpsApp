import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User, MapPin } from 'lucide-react';
import { JobSchedule, Technician } from '@/hooks/useSchedulingData';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface SchedulingCalendarProps {
  schedules: JobSchedule[];
  technicians: Technician[];
  onScheduleUpdate: (id: string, updates: Partial<JobSchedule>) => void;
  onCreateSchedule: () => void;
}

interface ScheduleItemProps {
  schedule: JobSchedule;
  technicians: Technician[];
  onUpdate: (updates: Partial<JobSchedule>) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, technicians, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: schedule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-yellow-100 text-yellow-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-purple-100 text-purple-800',
  };

  const technician = technicians.find(t => t.id === schedule.technician_id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {schedule.scheduled_start_time.slice(0, 5)} - {schedule.scheduled_end_time.slice(0, 5)}
          </span>
        </div>
        <div className="flex gap-1">
          <Badge className={priorityColors[schedule.priority]} variant="secondary">
            {schedule.priority}
          </Badge>
          <Badge className={statusColors[schedule.status]} variant="secondary">
            {schedule.status}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="font-medium text-sm">
          {schedule.case?.customer_name || 'Unknown Customer'}
        </div>
        <div className="text-xs text-muted-foreground">
          {schedule.case?.appliance_type} - {schedule.case?.appliance_brand}
        </div>
        {schedule.case?.customer_address && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {schedule.case.customer_address}
          </div>
        )}
        {technician && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {technician.full_name}
          </div>
        )}
      </div>
    </div>
  );
};

const SchedulingCalendar: React.FC<SchedulingCalendarProps> = ({
  schedules,
  technicians,
  onScheduleUpdate,
  onCreateSchedule,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Generate calendar dates
  const calendarDates = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }, [currentDate]);

  // Group schedules by date
  const schedulesByDate = useMemo(() => {
    const grouped: Record<string, JobSchedule[]> = {};
    schedules.forEach(schedule => {
      const dateKey = schedule.scheduled_date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(schedule);
    });
    
    // Sort schedules by time within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => 
        a.scheduled_start_time.localeCompare(b.scheduled_start_time)
      );
    });
    
    return grouped;
  }, [schedules]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const scheduleId = active.id as string;
    const targetDate = over.id as string;
    
    // Only update if dropped on a different date
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule && schedule.scheduled_date !== targetDate) {
      onScheduleUpdate(scheduleId, { scheduled_date: targetDate });
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Job Scheduling Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[140px] text-center">
              {formatMonthYear(currentDate)}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={onCreateSchedule} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Schedule Job
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[600px]">
            {calendarDates.map((date, index) => {
              const dateKey = date.toISOString().split('T')[0];
              const daySchedules = schedulesByDate[dateKey] || [];
              
              return (
                <SortableContext
                  key={dateKey}
                  id={dateKey}
                  items={daySchedules.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    className={`border-r border-b last:border-r-0 p-2 min-h-[120px] ${
                      !isCurrentMonth(date) ? 'bg-muted/20' : ''
                    } ${isToday(date) ? 'bg-primary/5' : ''}`}
                  >
                    <div className={`text-sm mb-2 ${
                      isToday(date) ? 'font-bold text-primary' : ''
                    } ${!isCurrentMonth(date) ? 'text-muted-foreground' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {daySchedules.map(schedule => (
                        <ScheduleItem
                          key={schedule.id}
                          schedule={schedule}
                          technicians={technicians}
                          onUpdate={(updates) => onScheduleUpdate(schedule.id, updates)}
                        />
                      ))}
                    </div>
                  </div>
                </SortableContext>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <DragOverlay>
        {activeId ? (
          <div className="bg-white border rounded-lg p-3 shadow-lg opacity-90">
            Dragging schedule...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SchedulingCalendar;