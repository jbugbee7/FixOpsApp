import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Match actual database schema from types.ts
export interface Technician {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  is_active: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface JobSchedule {
  id: string;
  company_id: string;
  case_id?: string;
  technician_id?: string;
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  case?: any;
  technician?: Technician;
}

export interface JobChecklist {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  items: any;
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
        .order('name');

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
        .order('scheduled_start', { ascending: true });

      if (startDate) {
        query = query.gte('scheduled_start', startDate);
      }
      if (endDate) {
        query = query.lte('scheduled_end', endDate);
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
        .select('*')
        .eq('technician_id', technicianId)
        .gte('scheduled_start', date)
        .lt('scheduled_start', `${date}T23:59:59`)
        .eq('status', 'scheduled');

      if (error) throw error;

      // Simple optimization: sort by time
      const optimizedJobs = jobs?.sort((a, b) => 
        a.scheduled_start.localeCompare(b.scheduled_start)
      ) || [];

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
      startOfMonth.toISOString(),
      endOfMonth.toISOString()
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
