import React from 'react';

interface DispatchingBoardProps {
  schedules: any[];
  technicians: any[];
  onAssignTechnician: (scheduleId: string, technicianId: string) => void;
  onOptimizeRoute: (technicianId: string, date: string) => void;
  onUpdateStatus: (scheduleId: string, status: any) => void;
}

export const DispatchingBoard: React.FC<DispatchingBoardProps> = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Dispatching board not yet implemented</p>
    </div>
  );
};
