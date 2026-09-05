CREATE TABLE public.item_galeri (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jenis TEXT NOT NULL CHECK (jenis IN ('foto','video','dokumen')),
  nama_file TEXT NOT NULL,
  keterangan TEXT NOT NULL DEFAULT '',
  tanggal DATE NOT NULL,
  path_file TEXT NOT NULL,
  tipe_mime TEXT NOT NULL DEFAULT '',
  ukuran BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.item_galeri TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.item_galeri TO anon;
GRANT ALL ON public.item_galeri TO service_role;

ALTER TABLE public.item_galeri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua orang dapat melihat item galeri"
  ON public.item_galeri FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Semua orang dapat menambah item galeri"
  ON public.item_galeri FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Semua orang dapat menghapus item galeri"
  ON public.item_galeri FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX item_galeri_tanggal_idx ON public.item_galeri (tanggal DESC, created_at DESC);