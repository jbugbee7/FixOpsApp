-- Create storage bucket for work order photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'work-order-photos',
  'work-order-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for work order photos
CREATE POLICY "Users can view work order photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'work-order-photos');

CREATE POLICY "Authenticated users can upload work order photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'work-order-photos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their work order photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'work-order-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their work order photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'work-order-photos' AND auth.uid() IS NOT NULL);