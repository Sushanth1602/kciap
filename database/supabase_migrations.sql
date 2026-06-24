-- KCIAP IDEMPOTENT SUPABASE DATABASE MIGRATIONS
-- Safe to run multiple times. Zero data loss. No relation errors.

-- 1. UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION public.check_user_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CREATE TABLES (IF NOT EXISTS)
-- Profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'Citizen' CHECK (role IN ('Citizen', 'Police Officer', 'Government Official')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Roles table (optional metadata reference table)
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL CHECK (name IN ('Citizen', 'Police Officer', 'Government Official')),
    description TEXT
);

-- Officers details table
CREATE TABLE IF NOT EXISTS public.officers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_number TEXT UNIQUE NOT NULL,
    rank TEXT NOT NULL,
    district TEXT NOT NULL,
    police_station TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Retired', 'On Leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Citizens details table
CREATE TABLE IF NOT EXISTS public.citizens (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    aadhaar_number TEXT UNIQUE,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Complaints table submitted by Citizens
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    district TEXT NOT NULL,
    police_station TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Investigation', 'Resolved', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crime Reports table populated by Officers
CREATE TABLE IF NOT EXISTS public.crime_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE SET NULL,
    crime_type TEXT NOT NULL,
    severity_level INT NOT NULL CHECK (severity_level BETWEEN 1 AND 5),
    modus_operandi TEXT,
    weapon_used TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Analytics Metrics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value JSONB NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MIGRATION & COLUMN SAFEGUARDS (Idempotent column alterations)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Citizen' CHECK (role IN ('Citizen', 'Police Officer', 'Government Official'));
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Pending';

-- 4. INDEXES (CREATE IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen ON public.complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_crime_reports_complaint ON public.crime_reports(complaint_id);
CREATE INDEX IF NOT EXISTS idx_crime_reports_officer ON public.crime_reports(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crime_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies creation

-- Profiles Policies
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
CREATE POLICY "Allow users to read their own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.profiles;
CREATE POLICY "Allow anonymous inserts" ON public.profiles 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access to active profiles" ON public.profiles;
CREATE POLICY "Allow public read access to active profiles" ON public.profiles 
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Roles Policies
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.roles;
CREATE POLICY "Allow read access to authenticated users" ON public.roles 
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Officers Policies
DROP POLICY IF EXISTS "Allow all authenticated users to read officer profiles" ON public.officers;
CREATE POLICY "Allow all authenticated users to read officer profiles" ON public.officers 
    FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow officers to update their details" ON public.officers;
CREATE POLICY "Allow officers to update their details" ON public.officers 
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow admin/anonymous registration insertion" ON public.officers;
CREATE POLICY "Allow admin/anonymous registration insertion" ON public.officers 
    FOR INSERT WITH CHECK (true);

-- Citizens Policies
DROP POLICY IF EXISTS "Allow citizens to read/write self details" ON public.citizens;
CREATE POLICY "Allow citizens to read/write self details" ON public.citizens 
    FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow officers and government to view citizen details" ON public.citizens;
CREATE POLICY "Allow officers and government to view citizen details" ON public.citizens 
    FOR SELECT USING (public.check_user_role('Police Officer') OR public.check_user_role('Government Official'));

-- Complaints Policies
DROP POLICY IF EXISTS "Allow citizens to submit complaints" ON public.complaints;
CREATE POLICY "Allow citizens to submit complaints" ON public.complaints 
    FOR INSERT WITH CHECK (auth.uid() = citizen_id);

DROP POLICY IF EXISTS "Allow citizens to view own complaints" ON public.complaints;
CREATE POLICY "Allow citizens to view own complaints" ON public.complaints 
    FOR SELECT USING (auth.uid() = citizen_id);

DROP POLICY IF EXISTS "Allow officers and officials to view all complaints" ON public.complaints;
CREATE POLICY "Allow officers and officials to view all complaints" ON public.complaints 
    FOR SELECT USING (public.check_user_role('Police Officer') OR public.check_user_role('Government Official'));

DROP POLICY IF EXISTS "Allow officers to update complaint statuses" ON public.complaints;
CREATE POLICY "Allow officers to update complaint statuses" ON public.complaints 
    FOR UPDATE USING (public.check_user_role('Police Officer') OR public.check_user_role('Government Official'));

-- Crime Reports Policies
DROP POLICY IF EXISTS "Allow officers/officials to manage crime reports" ON public.crime_reports;
CREATE POLICY "Allow officers/officials to manage crime reports" ON public.crime_reports 
    FOR ALL USING (public.check_user_role('Police Officer') OR public.check_user_role('Government Official'));

DROP POLICY IF EXISTS "Allow public read access to crime reports" ON public.crime_reports;
CREATE POLICY "Allow public read access to crime reports" ON public.crime_reports 
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Notifications Policies
DROP POLICY IF EXISTS "Allow users to read own notifications" ON public.notifications;
CREATE POLICY "Allow users to read own notifications" ON public.notifications 
    FOR SELECT USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Allow users to update own notification status" ON public.notifications;
CREATE POLICY "Allow users to update own notification status" ON public.notifications 
    FOR UPDATE USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Allow system system insertion of notifications" ON public.notifications;
CREATE POLICY "Allow system system insertion of notifications" ON public.notifications 
    FOR INSERT WITH CHECK (true);

-- 6. SYSTEM AUTOMATIC TRIGGERS
-- Create handle user metadata auto-populator
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Anonymous User'),
    new.email,
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'role', 'Citizen')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
