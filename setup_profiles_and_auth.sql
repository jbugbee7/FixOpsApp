-- ============================================
-- LOVABLE CLOUD AUTHENTICATION SETUP
-- Run this SQL in Cloud tab > Database > SQL Editor
-- ============================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  company_id uuid REFERENCES public.companies(id),
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'technician', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Update scheduling tables to link to companies (if they exist)
DO $$
BEGIN
  -- Add company_id to technicians if column doesn't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'technicians') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'technicians' AND column_name = 'company_id') THEN
      ALTER TABLE public.technicians ADD COLUMN company_id uuid REFERENCES public.companies(id);
    END IF;
  END IF;

  -- Add company_id to job_schedules if column doesn't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_schedules') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_schedules' AND column_name = 'company_id') THEN
      ALTER TABLE public.job_schedules ADD COLUMN company_id uuid REFERENCES public.companies(id);
    END IF;
  END IF;

  -- Add company_id to job_checklists if column doesn't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_checklists') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_checklists' AND column_name = 'company_id') THEN
      ALTER TABLE public.job_checklists ADD COLUMN company_id uuid REFERENCES public.companies(id);
    END IF;
  END IF;
END $$;

-- Update RLS policies for scheduling tables to use company_id
DO $$
BEGIN
  -- Technicians policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'technicians') THEN
    DROP POLICY IF EXISTS "Users can view technicians from their company" ON public.technicians;
    CREATE POLICY "Users can view technicians from their company"
      ON public.technicians
      FOR SELECT
      USING (company_id = public.get_user_company_id());

    DROP POLICY IF EXISTS "Users can create technicians for their company" ON public.technicians;
    CREATE POLICY "Users can create technicians for their company"
      ON public.technicians
      FOR INSERT
      WITH CHECK (company_id = public.get_user_company_id());

    DROP POLICY IF EXISTS "Users can update technicians from their company" ON public.technicians;
    CREATE POLICY "Users can update technicians from their company"
      ON public.technicians
      FOR UPDATE
      USING (company_id = public.get_user_company_id());
  END IF;

  -- Job schedules policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_schedules') THEN
    DROP POLICY IF EXISTS "Users can view schedules from their company" ON public.job_schedules;
    CREATE POLICY "Users can view schedules from their company"
      ON public.job_schedules
      FOR SELECT
      USING (company_id = public.get_user_company_id());

    DROP POLICY IF EXISTS "Users can create schedules for their company" ON public.job_schedules;
    CREATE POLICY "Users can create schedules for their company"
      ON public.job_schedules
      FOR INSERT
      WITH CHECK (company_id = public.get_user_company_id());

    DROP POLICY IF EXISTS "Users can update schedules from their company" ON public.job_schedules;
    CREATE POLICY "Users can update schedules from their company"
      ON public.job_schedules
      FOR UPDATE
      USING (company_id = public.get_user_company_id());
  END IF;

  -- Job checklists policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_checklists') THEN
    DROP POLICY IF EXISTS "Users can view checklists from their company" ON public.job_checklists;
    CREATE POLICY "Users can view checklists from their company"
      ON public.job_checklists
      FOR SELECT
      USING (company_id = public.get_user_company_id());

    DROP POLICY IF EXISTS "Users can create checklists for their company" ON public.job_checklists;
    CREATE POLICY "Users can create checklists for their company"
      ON public.job_checklists
      FOR INSERT
      WITH CHECK (company_id = public.get_user_company_id());

    DROP POLICY IF EXISTS "Users can update checklists from their company" ON public.job_checklists;
    CREATE POLICY "Users can update checklists from their company"
      ON public.job_checklists
      FOR UPDATE
      USING (company_id = public.get_user_company_id());
  END IF;
END $$;
