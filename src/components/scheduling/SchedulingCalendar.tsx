import React from 'react';

interface SchedulingCalendarProps {
  schedules: any[];
  technicians: any[];
  onScheduleUpdate: (id: string, updates: any) => void;
  onCreateSchedule: () => void;
}

export const SchedulingCalendar: React.FC<SchedulingCalendarProps> = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Scheduling calendar not yet implemented</p>
    </div>
  );
};
