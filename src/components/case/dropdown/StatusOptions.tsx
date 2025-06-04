
import { MapPin, Play, Calendar, X, Clock, CheckCircle } from 'lucide-react';

export const statusOptions = [
  { 
    value: 'travel', 
    label: 'Travel', 
    icon: MapPin, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    description: 'Traveling to appointment' 
  },
  { 
    value: 'active', 
    label: 'Active', 
    icon: Play, 
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    description: 'Currently working on the job' 
  },
  { 
    value: 'appointment', 
    label: 'Appointment', 
    icon: Calendar, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    description: 'Scheduled appointment' 
  },
  { 
    value: 'cancel', 
    label: 'Cancel', 
    icon: X, 
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    description: 'Cancel this work order' 
  },
];

export const sptOptions = [
  { 
    value: 'Scheduled', 
    label: 'Scheduled', 
    icon: Calendar, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    description: 'Schedule this work order' 
  },
  { 
    value: 'spr', 
    label: 'SPR', 
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    description: 'Schedule a return visit for parts' 
  },
  { 
    value: 'complete', 
    label: 'Complete', 
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    description: 'Mark work order as complete' 
  },
];
