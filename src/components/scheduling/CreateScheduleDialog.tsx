import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CreateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSchedule: (scheduleData: any) => Promise<void>;
  technicians: any[];
  cases: any[];
  initialDate?: Date;
  companyId: string;
}

export const CreateScheduleDialog: React.FC<CreateScheduleDialogProps> = ({
  open,
  onOpenChange,
  onCreateSchedule,
  technicians,
  cases,
  initialDate,
  companyId
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [technicianId, setTechnicianId] = useState('');
  const [caseId, setCaseId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      toast({
        title: 'Validation Error',
        description: 'Please select start and end times.',
        variant: 'destructive'
      });
      return;
    }

    // Create datetime strings
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const scheduledStart = `${dateStr}T${startTime}:00`;
    const scheduledEnd = `${dateStr}T${endTime}:00`;

    // Validate that end time is after start time
    if (new Date(scheduledEnd) <= new Date(scheduledStart)) {
      toast({
        title: 'Validation Error',
        description: 'End time must be after start time.',
        variant: 'destructive'
      });
      return;
    }

    const scheduleData = {
      company_id: companyId,
      scheduled_start: scheduledStart,
      scheduled_end: scheduledEnd,
      technician_id: technicianId || null,
      case_id: caseId || null,
      notes: notes || null,
      status: 'scheduled'
    };

    try {
      setLoading(true);
      await onCreateSchedule(scheduleData);
      
      toast({
        title: 'Schedule Created',
        description: 'New job schedule has been created successfully.'
      });
      
      // Reset form
      setStartTime('09:00');
      setEndTime('10:00');
      setTechnicianId('');
      setCaseId('');
      setNotes('');
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create schedule. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Technician Selection */}
          <div className="space-y-2">
            <Label htmlFor="technician">Technician (Optional)</Label>
            <Select value={technicianId} onValueChange={setTechnicianId}>
              <SelectTrigger id="technician">
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Case Selection */}
          <div className="space-y-2">
            <Label htmlFor="case">Work Order (Optional)</Label>
            <Select value={caseId} onValueChange={setCaseId}>
              <SelectTrigger id="case">
                <SelectValue placeholder="Select a work order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No work order</SelectItem>
                {cases?.slice(0, 10).map((caseItem) => (
                  <SelectItem key={caseItem.id} value={caseItem.id}>
                    {caseItem.id.slice(0, 8)} - {caseItem.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Schedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
