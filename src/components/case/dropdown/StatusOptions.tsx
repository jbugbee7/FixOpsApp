
import { MapPin, Play, Calendar, X, Clock, CheckCircle } from 'lucide-react';

export const statusOptions = [
  { 
    value: 'travel', 
    label: 'Travel', 
    icon: MapPin, 
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    description: 'Traveling to appointment' 
  },
  { 
    value: 'active', 
    label: 'Active', 
    icon: Play, 
    color: 'text-red-700',
    bgColor: 'bg-red-100 hover:bg-red-200',
    description: 'Currently working on the job' 
  },
  { 
    value: 'appointment', 
    label: 'Appointment', 
    icon: Calendar, 
    color: 'text-red-800',
    bgColor: 'bg-red-200 hover:bg-red-300',
    description: 'Scheduled appointment' 
  },
  { 
    value: 'cancel', 
    label: 'Cancel', 
    icon: X, 
    color: 'text-red-900',
    bgColor: 'bg-red-300 hover:bg-red-400',
    description: 'Cancel this work order' 
  },
];

export const sptOptions = [
  { 
    value: 'Scheduled', 
    label: 'Scheduled', 
    icon: Calendar, 
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    description: 'Schedule this work order' 
  },
  { 
    value: 'spr', 
    label: 'SPR', 
    icon: Clock,
    color: 'text-red-700',
    bgColor: 'bg-red-100 hover:bg-red-200',
    description: 'Schedule a return visit for parts' 
  },
  { 
    value: 'complete', 
    label: 'Complete', 
    icon: CheckCircle,
    color: 'text-red-800',
    bgColor: 'bg-red-200 hover:bg-red-300',
    description: 'Mark work order as complete' 
  },
];
