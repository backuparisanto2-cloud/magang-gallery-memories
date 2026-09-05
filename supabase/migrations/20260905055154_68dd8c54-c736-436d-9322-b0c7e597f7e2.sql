CREATE POLICY "Baca berkas galeri"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'galeri');

CREATE POLICY "Unggah berkas galeri"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'galeri');

CREATE POLICY "Hapus berkas galeri"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (bucket_id = 'galeri');