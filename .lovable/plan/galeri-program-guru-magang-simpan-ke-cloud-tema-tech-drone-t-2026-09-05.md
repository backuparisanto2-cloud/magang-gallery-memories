# Galeri Program Guru Magang — Simpan ke Cloud, Tema Tech Drone Terang, Bagikan Massal

## 1. Penyimpanan permanen (Lovable Cloud)
Saat ini foto/video/dokumen hanya tersimpan di browser perangkat yang mengunggah, sehingga hilang bila dibuka dari perangkat lain. Akan dipindahkan ke penyimpanan cloud:

- Aktifkan Lovable Cloud (database + penyimpanan file).
- Bucket file publik `galeri` untuk foto, video MP4, dan dokumen, sehingga setiap berkas punya tautan yang bisa dibuka siapa pun.
- Tabel `item_galeri`: jenis (foto/video/dokumen), nama file, keterangan, tanggal kegiatan, path file, ukuran, waktu unggah.
- Semua pengunjung bisa melihat galeri lengkap tanpa login. Unggah dan hapus juga terbuka untuk siapa saja (sesuai pemakaian sekarang tanpa login) — bila nanti ingin dibatasi, bisa ditambahkan login admin.
- Data lama yang masih ada di browser tidak ikut pindah; foto perlu diunggah ulang sekali.

## 2. Tema baru: tech formal drone, terang
- Latar terang (putih/abu sangat muda), aksen biru teknis (sky/indigo) dan aksen jingga sinyal secukupnya.
- Tipografi: judul memakai huruf sans geometris tegas (Space Grotesk), isi memakai Inter. Serif emas lama dihapus.
- Detail visual bernuansa drone/teknis: garis grid halus, koordinat/label kecil bergaya HUD, bingkai sudut pada kartu, tanpa emas dan tanpa latar gelap.
- Animasi tetap halus dan sinematik (fade, parallax ringan, hover), disesuaikan agar cocok dengan latar terang.
- Semua warna lewat token tema, bukan warna tetap di komponen.

## 3. Pilih banyak & bagikan (WhatsApp, Google Drive, dll.)
- Mode pilih: tombol "Pilih" mengaktifkan kotak centang pada setiap foto, video, dan dokumen; ada "Pilih semua" dan penghitung jumlah terpilih.
- Bilah aksi muncul saat ada yang dipilih: **Bagikan**, **Unduh**, **Salin tautan**, **Hapus terpilih**.
- Bagikan memakai fitur berbagi bawaan perangkat (Android/iOS) sehingga langsung muncul pilihan WhatsApp, Google Drive, Gmail, dan aplikasi lain; berkas dikirim sebagai lampiran bila didukung, jika tidak maka tautan yang dibagikan.
- Di komputer yang tidak mendukung berbagi bawaan: tombol WhatsApp Web dan salin daftar tautan.

## 4. Judul
Judul situs dan judul di halaman menjadi:
**Gallery Program Guru Magang SMK Muhammadiyah 1 Paguyangan – PT Sekawan Global Komunika**
(termasuk judul tab browser dan pratinjau saat dibagikan).

## Catatan teknis
- Migrasi: tabel `item_galeri` + GRANT + RLS (SELECT/INSERT/DELETE untuk anon & authenticated), bucket storage publik `galeri` dengan policy baca publik dan unggah publik.
- Akses data lewat client Supabase di browser untuk unggah/hapus, dan server function publik untuk daftar item pada loader route agar SSR/pratinjau tetap jalan.
- `src/lib/galeri-store.ts` (IndexedDB) diganti `src/lib/galeri-api.ts`; `formatTanggalIndo` dipertahankan.
- Seleksi dikelola state di `src/routes/index.tsx`, dibagikan ke `GalleryGrid`/`DokumenList`; berbagi via `navigator.share` dengan `files` (fallback `url`), unduhan massal berurutan.
- Token warna baru di `src/styles.css`; font Space Grotesk + Inter via `<link>` di `__root.tsx`.
