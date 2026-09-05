# Galeri Foto Kegiatan Magang Guru — SMK Muhammadiyah 1 Paguyangan × PT Sekawan Global Komunika

## Tujuan
WebApp galeri foto dokumentasi kegiatan Program Magang Guru SMK Muhammadiyah 1 Paguyangan di PT Sekawan Global Komunika, berbahasa Indonesia, tampilan elegan-formal dengan nuansa sinematik, animasi halus, dan responsif di semua perangkat.

## Struktur Halaman (single page `/`)

1. **Hero sinematik**
   - Foto utama layar penuh dengan overlay gelap elegan
   - Judul: "Program Magang Guru" + subjudul nama sekolah dan perusahaan
   - Animasi teks muncul perlahan (fade + slide) dan efek parallax halus saat scroll

2. **Sambutan singkat / tentang program**
   - Paragraf pembuka formal berbahasa Indonesia tentang tujuan magang guru (peningkatan kompetensi, link & match industri)
   - Statistik kecil: jumlah guru, durasi magang, periode pelaksanaan (placeholder, bisa disesuaikan)

3. **Galeri foto (inti halaman)**
   - Grid foto dengan layout masonry/beragam ukuran
   - Setiap foto memiliki keterangan kegiatan + tanggal dalam Bahasa Indonesia (contoh: "Observasi Proses Produksi — Senin, 12 Januari 2026")
   - Efek hover: zoom halus + keterangan muncul
   - Klik foto membuka **lightbox** layar penuh (navigasi kiri/kanan, tombol tutup, keterangan & tanggal di bawah foto)
   - Animasi reveal saat scroll (fade-in bertahap)

4. **Penutup & footer**
   - Ucapan terima kasih kepada PT Sekawan Global Komunika
   - Logo/nama kedua institusi, footer minimal formal

## Desain
- **Gaya:** elegan, formal, sinematik — latar gelap (deep navy/charcoal) dengan aksen emas lembut, tipografi serif untuk judul (mis. Cormorant/Playfair) dan sans bersih untuk isi
- **Animasi:** reveal saat scroll, parallax hero, hover zoom, transisi lightbox halus — tidak berlebihan, tetap formal
- **Responsif:** grid 1 kolom di ponsel, 2 di tablet, 3 di desktop; lightbox penuh di semua ukuran
- Semua warna lewat token desain di `src/styles.css` (oklch), tidak ada warna hardcoded

## Konten & Foto
- ±8–10 foto kegiatan dihasilkan sebagai ilustrasi dokumentasi (guru berdiskusi dengan teknisi, observasi jaringan/server, pelatihan, penyerahan sertifikat, dsb.)
- Keterangan & tanggal adalah placeholder yang wajar — pengguna bisa meminta penggantian dengan foto asli dan tanggal sebenarnya

## Teknis
- Route: `src/routes/index.tsx` (menggantikan placeholder)
- Komponen: `src/components/gallery/` (Hero, About, GalleryGrid, Lightbox, Footer)
- Animasi: utility animasi bawaan + CSS transition; lightbox dengan state React + keyboard navigation (Esc, panah)
- Head metadata: judul, deskripsi, og:title/description Bahasa Indonesia
- Font dimuat via `<link>` di `src/routes/__root.tsx`
