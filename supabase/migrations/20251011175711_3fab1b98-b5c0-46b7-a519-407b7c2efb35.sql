-- Create storage bucket for family images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'family-images',
  'family-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create storage bucket for RVT files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rvt-files',
  'rvt-files',
  true,
  52428800,
  ARRAY['application/octet-stream', 'application/x-revit']
);

-- Create plumbing_families table
CREATE TABLE public.plumbing_families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pipe fitting', 'pipe accessories', 'mechanical equipment', 'specialty equipment', 'structural stiffeners', 'others')),
  image_url TEXT NOT NULL,
  rvt_file_url TEXT NOT NULL,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.plumbing_families ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view plumbing families"
  ON public.plumbing_families
  FOR SELECT
  USING (true);

-- Create policies for public insert (since no auth is needed based on requirements)
CREATE POLICY "Anyone can insert plumbing families"
  ON public.plumbing_families
  FOR INSERT
  WITH CHECK (true);

-- Create policies for public update
CREATE POLICY "Anyone can update plumbing families"
  ON public.plumbing_families
  FOR UPDATE
  USING (true);

-- Create policies for public delete
CREATE POLICY "Anyone can delete plumbing families"
  ON public.plumbing_families
  FOR DELETE
  USING (true);

-- Storage policies for family-images bucket
CREATE POLICY "Anyone can view family images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'family-images');

CREATE POLICY "Anyone can upload family images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'family-images');

-- Storage policies for rvt-files bucket
CREATE POLICY "Anyone can view rvt files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'rvt-files');

CREATE POLICY "Anyone can upload rvt files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'rvt-files');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.plumbing_families
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for plumbing_families table
ALTER PUBLICATION supabase_realtime ADD TABLE public.plumbing_families;