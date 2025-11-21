import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Use actual database types
type DbTechnician = Tables<'technicians'>;
type DbJobSchedule = Tables<'job_schedules'>;
type DbJobChecklist = Tables<'job_checklists'>;

export interface Technician extends DbTechnician {}

export interface JobSchedule extends DbJobSchedule {
  // Joined data
  case?: any;
  technician?: DbTechnician;
}

export interface JobChecklist extends DbJobChecklist {}

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
        query = query.lte('scheduled_start', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSchedules(data as JobSchedule[] || []);
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
      
      setSchedules(prev => [...prev, data as JobSchedule]);
      return data;
    } catch (err: any) {
      console.error('Error creating schedule:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, updates: Partial<DbJobSchedule>) => {
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
      
      setSchedules(prev => prev.map(s => s.id === id ? data as JobSchedule : s));
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

  const createChecklist = async (checklistData: any) => {
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
    assignTechnician
  };
};
