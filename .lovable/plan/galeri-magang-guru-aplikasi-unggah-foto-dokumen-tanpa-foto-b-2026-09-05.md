# Galeri Magang Guru — Aplikasi Unggah Foto & Dokumen (Tanpa Foto Bawaan)

## Perubahan dari rencana sebelumnya
Tidak ada foto hasil generate yang dipakai di galeri. Aplikasi menjadi galeri kosong yang diisi sendiri oleh pengguna melalui unggahan foto dan dokumen (drag & drop atau pilih file). Foto-foto hasil generate yang sudah terlanjur dibuat akan dihapus dari proyek.

## Fitur Utama (single page `/`, Bahasa Indonesia)

1. **Hero sinematik elegan**
   - Latar gelap (deep navy/charcoal) dengan aksen emas, tanpa foto bawaan — dekorasi gradien/pola halus
   - Judul "Program Magang Guru" + nama SMK Muhammadiyah 1 Paguyangan × PT Sekawan Global Komunika
   - Animasi teks fade-in perlahan

2. **Area unggah (inti aplikasi)**
   - Zona drag & drop besar + tombol "Pilih File"
   - Menerima foto (JPG, PNG, WEBP) dan dokumen (PDF, DOC, DOCX, PPT, XLS)
   - Setelah memilih foto: pengguna mengisi **keterangan kegiatan** dan **tanggal** (format Bahasa Indonesia, mis. "Senin, 12 Januari 2026" via input date)
   - Dokumen tampil sebagai kartu file dengan ikon, nama, dan tanggal
   - Data tersimpan di browser (localStorage/IndexedDB) sehingga tidak hilang saat halaman dibuka ulang — tanpa perlu akun/login

3. **Galeri foto**
   - Grid responsif (1 kolom ponsel, 2 tablet, 3 desktop) dengan animasi reveal saat scroll
   - Hover: zoom halus + keterangan muncul
   - Klik foto: lightbox layar penuh (panah kiri/kanan, Esc untuk tutup, keterangan & tanggal)
   - Tombol hapus per item, urut berdasarkan tanggal

4. **Penutup & footer formal**
   - Ucapan terima kasih, nama kedua institusi, footer minimal

## Desain
- Elegan, formal, sinematik: latar gelap, aksen emas, tipografi serif untuk judul (Cormorant Garamond) + Inter untuk isi
- Semua warna lewat token di `src/styles.css`; font via `<link>` di `src/routes/__root.tsx`
- Animasi halus dan terukur (fade, hover zoom, transisi lightbox)

## Teknis
- `src/routes/index.tsx` menggantikan placeholder; komponen di `src/components/gallery/` (Hero, UploadZone, GalleryGrid, Lightbox, DokumenList, Footer)
- Unggahan dibaca sebagai data URL / object URL; metadata (keterangan, tanggal, nama file) disimpan bersama gambar di IndexedDB (foto bisa besar, localStorage terbatas ~5MB)
- Validasi ukuran/tipe file + pesan error Bahasa Indonesia
- Head metadata Bahasa Indonesia di route index

## Catatan
- Penyimpanan lokal berarti foto hanya tersimpan di browser perangkat yang mengunggah. Jika nanti ingin foto tersimpan permanen dan bisa dilihat semua pengunjung, itu memerlukan backend (Lovable Cloud) — bisa ditambahkan kemudian.
