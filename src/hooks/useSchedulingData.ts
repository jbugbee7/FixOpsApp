import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Technician {
  id: string;
  user_id: string;
  employee_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  specializations: string[];
  current_location_lat?: number;
  current_location_lng?: number;
  location_updated_at?: string;
  is_active: boolean;
  working_hours: any;
  created_at: string;
  updated_at: string;
}

export interface JobSchedule {
  id: string;
  case_id: string;
  technician_id?: string;
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  estimated_duration: number;
  status: string;
  priority: string;
  travel_time_minutes: number;
  notes?: string;
  customer_confirmed: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined data
  case?: any;
  technician?: Technician;
}

export interface JobChecklist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  appliance_type?: string;
  service_type?: string;
  checklist_items: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSchedulingData = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [schedules, setSchedules] = useState<JobSchedule[]>([]);
  const [checklists, setChecklists] = useState<JobChecklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setTechnicians(data || []);
    } catch (err: any) {
      console.error('Error fetching technicians:', err);
      setError(err.message);
    }
  };

  const fetchSchedules = async (startDate?: string, endDate?: string) => {
    try {
      let query = supabase
        .from('job_schedules')
        .select(`
          *,
          case:cases(*),
          technician:technicians(*)
        `)
        .order('scheduled_date', { ascending: true })
        .order('scheduled_start_time', { ascending: true });

      if (startDate) {
        query = query.gte('scheduled_date', startDate);
      }
      if (endDate) {
        query = query.lte('scheduled_date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSchedules(data || []);
    } catch (err: any) {
      console.error('Error fetching schedules:', err);
      setError(err.message);
    }
  };

  const fetchChecklists = async () => {
    try {
      const { data, error } = await supabase
        .from('job_checklists')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setChecklists(data || []);
    } catch (err: any) {
      console.error('Error fetching checklists:', err);
      setError(err.message);
    }
  };

  const createSchedule = async (scheduleData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_schedules')
        .insert([scheduleData])
        .select(`
          *,
          case:cases(*),
          technician:technicians(*)
        `)
        .single();

      if (error) throw error;
      
      setSchedules(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating schedule:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, updates: Partial<JobSchedule>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_schedules')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          case:cases(*),
          technician:technicians(*)
        `)
        .single();

      if (error) throw error;
      
      setSchedules(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err: any) {
      console.error('Error updating schedule:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTechnician = async (technicianData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('technicians')
        .insert([technicianData])
        .select('*')
        .single();

      if (error) throw error;
      
      setTechnicians(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating technician:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createChecklist = async (checklistData: Omit<JobChecklist, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_checklists')
        .insert([checklistData])
        .select('*')
        .single();

      if (error) throw error;
      
      setChecklists(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating checklist:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignTechnician = async (scheduleId: string, technicianId: string) => {
    return updateSchedule(scheduleId, { technician_id: technicianId });
  };

  const optimizeRoute = async (technicianId: string, date: string) => {
    try {
      // Get all scheduled jobs for the technician on the given date
      const { data: jobs, error } = await supabase
        .from('job_schedules')
        .select(`
          *,
          case:cases(customer_address, customer_city, customer_state)
        `)
        .eq('technician_id', technicianId)
        .eq('scheduled_date', date)
        .eq('status', 'scheduled');

      if (error) throw error;

      // Simple optimization: sort by time (in real app, you'd use a routing API)
      const optimizedJobs = jobs?.sort((a, b) => 
        a.scheduled_start_time.localeCompare(b.scheduled_start_time)
      ) || [];

      // Store the optimized route
      const { error: routeError } = await supabase
        .from('route_optimizations')
        .insert({
          technician_id: technicianId,
          optimization_date: date,
          scheduled_jobs: jobs?.map(j => j.id) || [],
          optimized_route: optimizedJobs.map(j => ({
            schedule_id: j.id,
            order: optimizedJobs.indexOf(j) + 1,
            estimated_arrival: j.scheduled_start_time
          }))
        });

      if (routeError) throw routeError;

      return optimizedJobs;
    } catch (err: any) {
      console.error('Error optimizing route:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTechnicians();
    fetchChecklists();
    
    // Fetch schedules for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    fetchSchedules(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
  }, []);

  return {
    technicians,
    schedules,
    checklists,
    loading,
    error,
    fetchTechnicians,
    fetchSchedules,
    fetchChecklists,
    createSchedule,
    updateSchedule,
    createTechnician,
    createChecklist,
    assignTechnician,
    optimizeRoute
  };
};