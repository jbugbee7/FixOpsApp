-- Create technicians table for managing field workers
CREATE TABLE public.technicians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  employee_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  specializations TEXT[] DEFAULT '{}',
  current_location_lat DECIMAL,
  current_location_lng DECIMAL,
  location_updated_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  working_hours JSONB DEFAULT '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}, "saturday": {"start": "09:00", "end": "15:00"}, "sunday": {"start": null, "end": null}}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_schedules table for appointment scheduling
CREATE TABLE public.job_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  technician_id UUID,
  scheduled_date DATE NOT NULL,
  scheduled_start_time TIME NOT NULL,
  scheduled_end_time TIME NOT NULL,
  estimated_duration INTEGER DEFAULT 120, -- minutes
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  travel_time_minutes INTEGER DEFAULT 0,
  notes TEXT,
  customer_confirmed BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_checklists table for custom repair checklists
CREATE TABLE public.job_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  appliance_type TEXT,
  service_type TEXT,
  checklist_items JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create checklist_completions table to track completed checklists
CREATE TABLE public.checklist_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  checklist_id UUID NOT NULL,
  technician_id UUID NOT NULL,
  completed_items JSONB DEFAULT '{}',
  completion_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create route_optimizations table for tracking optimized routes
CREATE TABLE public.route_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID NOT NULL,
  optimization_date DATE NOT NULL,
  scheduled_jobs JSONB NOT NULL DEFAULT '[]',
  optimized_route JSONB NOT NULL DEFAULT '[]',
  total_distance_miles DECIMAL,
  total_travel_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_optimizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for technicians
CREATE POLICY "Users can view technicians from their company" 
ON public.technicians 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.company_id = (
    SELECT company_id FROM public.profiles WHERE id = technicians.user_id
  )
));

CREATE POLICY "Admins can manage technicians" 
ON public.technicians 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS Policies for job_schedules
CREATE POLICY "Users can view schedules from their company" 
ON public.job_schedules 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cases c 
  JOIN public.profiles p ON c.user_id = p.id
  WHERE c.id = job_schedules.case_id 
  AND p.company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
));

CREATE POLICY "Users can create schedules for their company cases" 
ON public.job_schedules 
FOR INSERT 
WITH CHECK (auth.uid() = created_by AND EXISTS (
  SELECT 1 FROM public.cases c 
  JOIN public.profiles p ON c.user_id = p.id
  WHERE c.id = job_schedules.case_id 
  AND p.company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
));

CREATE POLICY "Users can update schedules from their company" 
ON public.job_schedules 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.cases c 
  JOIN public.profiles p ON c.user_id = p.id
  WHERE c.id = job_schedules.case_id 
  AND p.company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
));

-- RLS Policies for job_checklists
CREATE POLICY "Users can create their own checklists" 
ON public.job_checklists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view checklists from their company" 
ON public.job_checklists 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p1, public.profiles p2
  WHERE p1.id = auth.uid() AND p2.id = job_checklists.user_id
  AND p1.company_id = p2.company_id
));

CREATE POLICY "Users can update their own checklists" 
ON public.job_checklists 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for checklist_completions
CREATE POLICY "Users can view checklist completions from their company" 
ON public.checklist_completions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.cases c 
  JOIN public.profiles p ON c.user_id = p.id
  WHERE c.id = checklist_completions.case_id 
  AND p.company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
));

CREATE POLICY "Technicians can create and update their completions" 
ON public.checklist_completions 
FOR ALL 
USING (auth.uid() = technician_id);

-- RLS Policies for route_optimizations
CREATE POLICY "Users can view route optimizations from their company" 
ON public.route_optimizations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.technicians t 
  JOIN public.profiles p ON t.user_id = p.id
  WHERE t.id = route_optimizations.technician_id 
  AND p.company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
));

CREATE POLICY "System can create route optimizations" 
ON public.route_optimizations 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_technicians_user_id ON public.technicians(user_id);
CREATE INDEX idx_technicians_location ON public.technicians(current_location_lat, current_location_lng);
CREATE INDEX idx_job_schedules_case_id ON public.job_schedules(case_id);
CREATE INDEX idx_job_schedules_technician_id ON public.job_schedules(technician_id);
CREATE INDEX idx_job_schedules_date ON public.job_schedules(scheduled_date);
CREATE INDEX idx_job_checklists_user_id ON public.job_checklists(user_id);
CREATE INDEX idx_checklist_completions_case_id ON public.checklist_completions(case_id);
CREATE INDEX idx_route_optimizations_technician_date ON public.route_optimizations(technician_id, optimization_date);

-- Create foreign key constraints
ALTER TABLE public.job_schedules ADD CONSTRAINT fk_job_schedules_case_id 
  FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE public.job_schedules ADD CONSTRAINT fk_job_schedules_technician_id 
  FOREIGN KEY (technician_id) REFERENCES public.technicians(id) ON DELETE SET NULL;

ALTER TABLE public.checklist_completions ADD CONSTRAINT fk_checklist_completions_case_id 
  FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE public.checklist_completions ADD CONSTRAINT fk_checklist_completions_checklist_id 
  FOREIGN KEY (checklist_id) REFERENCES public.job_checklists(id) ON DELETE CASCADE;

ALTER TABLE public.checklist_completions ADD CONSTRAINT fk_checklist_completions_technician_id 
  FOREIGN KEY (technician_id) REFERENCES public.technicians(id) ON DELETE CASCADE;

ALTER TABLE public.route_optimizations ADD CONSTRAINT fk_route_optimizations_technician_id 
  FOREIGN KEY (technician_id) REFERENCES public.technicians(id) ON DELETE CASCADE;

-- Create trigger to update timestamps
CREATE TRIGGER update_technicians_updated_at
  BEFORE UPDATE ON public.technicians
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_schedules_updated_at
  BEFORE UPDATE ON public.job_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_checklists_updated_at
  BEFORE UPDATE ON public.job_checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checklist_completions_updated_at
  BEFORE UPDATE ON public.checklist_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();