import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Filter,
  Route
} from 'lucide-react';
import { JobSchedule, Technician } from '@/hooks/useSchedulingData';

interface DispatchingBoardProps {
  schedules: JobSchedule[];
  technicians: Technician[];
  onAssignTechnician: (scheduleId: string, technicianId: string) => void;
  onOptimizeRoute: (technicianId: string, date: string) => void;
  onUpdateStatus: (scheduleId: string, status: JobSchedule['status']) => void;
}

const DispatchingBoard: React.FC<DispatchingBoardProps> = ({
  schedules,
  technicians,
  onAssignTechnician,
  onOptimizeRoute,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');

  // Filter schedules based on search and filters
  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const matchesSearch = schedule.case?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.case?.customer_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.case?.appliance_type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || schedule.priority === priorityFilter;
      const matchesTechnician = selectedTechnician === 'all' || schedule.technician_id === selectedTechnician;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
    });
  }, [schedules, searchTerm, statusFilter, priorityFilter, selectedTechnician]);

  // Group schedules by priority and status
  const urgentSchedules = filteredSchedules.filter(s => s.priority === 'urgent');
  const unassignedSchedules = filteredSchedules.filter(s => !s.technician_id);
  const todaySchedules = filteredSchedules.filter(s => 
    s.scheduled_date === new Date().toISOString().split('T')[0]
  );

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

  const getDistance = (schedule: JobSchedule, technician: Technician) => {
    // Mock distance calculation - in real app, use Google Maps API
    if (!technician.current_location_lat || !technician.current_location_lng) {
      return 'Unknown';
    }
    return `${Math.floor(Math.random() * 30 + 1)} mi`;
  };

  const getSuggestedTechnician = (schedule: JobSchedule) => {
    // Simple suggestion based on specialization and location
    const suitable = technicians.filter(tech => 
      tech.is_active && 
      tech.specializations.some(spec => 
        schedule.case?.appliance_type?.toLowerCase().includes(spec.toLowerCase())
      )
    );
    
    return suitable.length > 0 ? suitable[0] : technicians.find(t => t.is_active);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Real-time Dispatching Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, customers, addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                {technicians.map(tech => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent Jobs</p>
                <p className="text-2xl font-bold text-red-600">{urgentSchedules.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold text-yellow-600">{unassignedSchedules.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{todaySchedules.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Techs</p>
                <p className="text-2xl font-bold text-green-600">
                  {technicians.filter(t => t.is_active).length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>Job Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSchedules.map(schedule => {
              const technician = technicians.find(t => t.id === schedule.technician_id);
              const suggestedTech = getSuggestedTechnician(schedule);
              
              return (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">
                          {schedule.case?.customer_name || 'Unknown Customer'}
                        </h3>
                        <Badge className={priorityColors[schedule.priority]} variant="secondary">
                          {schedule.priority}
                        </Badge>
                        <Badge className={statusColors[schedule.status]} variant="secondary">
                          {schedule.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {schedule.scheduled_date} at {schedule.scheduled_start_time.slice(0, 5)}
                        </div>
                        {schedule.case?.customer_address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {schedule.case.customer_address}
                          </div>
                        )}
                        {schedule.case?.customer_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {schedule.case.customer_phone}
                          </div>
                        )}
                        <div>
                          {schedule.case?.appliance_type} - {schedule.case?.appliance_brand}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {technician ? (
                        <div className="text-sm">
                          <div className="font-medium">Assigned to:</div>
                          <div className="text-muted-foreground">{technician.full_name}</div>
                          <div className="text-xs text-muted-foreground">
                            Distance: {getDistance(schedule, technician)}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-sm text-red-600 font-medium">Unassigned</div>
                          {suggestedTech && (
                            <div className="text-xs text-muted-foreground">
                              Suggested: {suggestedTech.full_name}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Select
                          value={schedule.technician_id || ''}
                          onValueChange={(value) => value && onAssignTechnician(schedule.id, value)}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Assign Tech" />
                          </SelectTrigger>
                          <SelectContent>
                            {technicians.filter(t => t.is_active).map(tech => (
                              <SelectItem key={tech.id} value={tech.id}>
                                <div className="flex justify-between items-center w-full">
                                  <span>{tech.full_name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {getDistance(schedule, tech)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {schedule.technician_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOptimizeRoute(schedule.technician_id!, schedule.scheduled_date)}
                          >
                            <Route className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <Select
                        value={schedule.status}
                        onValueChange={(value: JobSchedule['status']) => onUpdateStatus(schedule.id, value)}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatchingBoard;