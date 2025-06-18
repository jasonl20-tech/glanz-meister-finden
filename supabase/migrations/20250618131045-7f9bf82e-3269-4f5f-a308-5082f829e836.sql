
-- Create companies table for KFZ-Aufbereitungsbetriebe
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  mobile_service BOOLEAN DEFAULT false,
  price_range TEXT CHECK (price_range IN ('€', '€€', '€€€')),
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_services junction table
CREATE TABLE public.company_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  price DECIMAL(10,2),
  UNIQUE(company_id, service_id)
);

-- Insert default services
INSERT INTO public.services (name, description) VALUES
('Innenreinigung', 'Professionelle Reinigung des Fahrzeuginnenraums'),
('Lackaufbereitung', 'Aufbereitung und Politur der Fahrzeugaußenhaut'),
('Nanoversiegelung', 'Schutzversiegelung für langanhaltenden Glanz'),
('Polsterreinigung', 'Tiefenreinigung von Sitzen und Polstern'),
('Felgenreinigung', 'Spezialreinigung der Felgen und Reifen'),
('Mobile Aufbereitung', 'Service direkt beim Kunden vor Ort'),
('Motorwäsche', 'Professionelle Reinigung des Motorraums'),
('Cabrio-Verdeck-Pflege', 'Spezielle Behandlung für Cabrio-Verdecke');

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Users can create their own company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own company" ON public.companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own company" ON public.companies FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for services
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);

-- RLS Policies for company_services
CREATE POLICY "Anyone can view company services" ON public.company_services FOR SELECT USING (true);
CREATE POLICY "Company owners can manage their services" ON public.company_services FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE companies.id = company_services.company_id 
    AND companies.user_id = auth.uid()
  )
);
