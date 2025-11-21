import React from 'react';

interface ChecklistManagerProps {
  checklists: any[];
  onCreateChecklist: (checklistData: any) => void;
  onUpdateChecklist: (id: any, updates: any) => void;
  onDeleteChecklist: (id: any) => void;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Checklist manager not yet implemented</p>
    </div>
  );
};
