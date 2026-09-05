// Penyimpanan galeri pada database & storage Lovable Cloud.
import { supabase } from "@/integrations/supabase/client";

export type JenisItem = "foto" | "video" | "dokumen";

export interface ItemGaleri {
  id: string;
  jenis: JenisItem;
  namaFile: string;
  keterangan: string;
  tanggal: string; // ISO yyyy-mm-dd
  pathFile: string;
  tipeMime: string;
  ukuran: number;
  createdAt: string;
  url: string; // tautan berkas (bertanda tangan)
}

const BUCKET = "galeri";
const MASA_BERLAKU = 60 * 60 * 24 * 7; // 7 hari

interface BarisDb {
  id: string;
  jenis: string;
  nama_file: string;
  keterangan: string;
  tanggal: string;
  path_file: string;
  tipe_mime: string;
  ukuran: number;
  created_at: string;
}

async function tautanBerkas(paths: string[]): Promise<Map<string, string>> {
  const peta = new Map<string, string>();
  if (paths.length === 0) return peta;
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, MASA_BERLAKU);
  for (const entri of data ?? []) {
    if (entri.path && entri.signedUrl) peta.set(entri.path, entri.signedUrl);
  }
  return peta;
}

function keItem(baris: BarisDb, url: string): ItemGaleri {
  return {
    id: baris.id,
    jenis: baris.jenis as JenisItem,
    namaFile: baris.nama_file,
    keterangan: baris.keterangan,
    tanggal: baris.tanggal,
    pathFile: baris.path_file,
    tipeMime: baris.tipe_mime,
    ukuran: baris.ukuran,
    createdAt: baris.created_at,
    url,
  };
}

export async function ambilSemuaItem(): Promise<ItemGaleri[]> {
  const { data, error } = await supabase
    .from("item_galeri")
    .select("*")
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const baris = (data ?? []) as BarisDb[];
  const peta = await tautanBerkas(baris.map((b) => b.path_file));
  return baris.map((b) => keItem(b, peta.get(b.path_file) ?? ""));
}

export async function unggahItem(
  file: File,
  jenis: JenisItem,
  keterangan: string,
  tanggal: string
): Promise<ItemGaleri> {
  const ekstensi = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : "";
  const path = `${tanggal}/${crypto.randomUUID()}${ekstensi}`;

  const { error: errUnggah } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (errUnggah) throw errUnggah;

  const { data, error } = await supabase
    .from("item_galeri")
    .insert({
      jenis,
      nama_file: file.name,
      keterangan,
      tanggal,
      path_file: path,
      tipe_mime: file.type || "",
      ukuran: file.size,
    })
    .select("*")
    .single();
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw error;
  }

  const peta = await tautanBerkas([path]);
  return keItem(data as BarisDb, peta.get(path) ?? "");
}

export async function hapusItem(item: ItemGaleri): Promise<void> {
  const { error } = await supabase
    .from("item_galeri")
    .delete()
    .eq("id", item.id);
  if (error) throw error;
  await supabase.storage.from(BUCKET).remove([item.pathFile]);
}

/* ---------- Berbagi & unduh ---------- */

export async function ambilFile(item: ItemGaleri): Promise<File> {
  const respons = await fetch(item.url);
  const blob = await respons.blob();
  return new File([blob], item.namaFile, {
    type: item.tipeMime || blob.type || "application/octet-stream",
  });
}

export function teksBagikan(items: ItemGaleri[]): string {
  const judul = "Galeri Program Guru Magang SMK Muhammadiyah 1 Paguyangan × PT Sekawan Global Komunika";
  const daftar = items
    .map((i) => `• ${i.keterangan} (${formatTanggalIndo(i.tanggal)})\n${i.url}`)
    .join("\n\n");
  return `${judul}\n\n${daftar}`;
}

export async function bagikanItems(items: ItemGaleri[]): Promise<
  "berkas" | "tautan" | "whatsapp"
> {
  const teks = teksBagikan(items);
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };

  if (typeof nav.share === "function") {
    // Coba bagikan berkas langsung (WhatsApp, Drive, Gmail, dll.)
    try {
      const files = await Promise.all(items.slice(0, 10).map(ambilFile));
      if (nav.canShare?.({ files })) {
        await nav.share({
          files,
          title: "Dokumentasi Magang Guru",
          text: items.map((i) => i.keterangan).join(", "),
        });
        return "berkas";
      }
    } catch {
      /* lanjut ke berbagi tautan */
    }
    try {
      await nav.share({ title: "Dokumentasi Magang Guru", text: teks });
      return "tautan";
    } catch {
      /* lanjut ke WhatsApp Web */
    }
  }

  window.open(
    `https://wa.me/?text=${encodeURIComponent(teks)}`,
    "_blank",
    "noopener"
  );
  return "whatsapp";
}

export async function unduhItems(items: ItemGaleri[]): Promise<void> {
  for (const item of items) {
    const file = await ambilFile(item);
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.namaFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    await new Promise((r) => setTimeout(r, 400));
  }
}

export async function salinTautan(items: ItemGaleri[]): Promise<void> {
  await navigator.clipboard.writeText(teksBagikan(items));
}

/* ---------- Validasi & format ---------- */

const TIPE_FOTO = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TIPE_DOKUMEN = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const TIPE_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

const UKURAN_MAKS = 20 * 1024 * 1024;
const UKURAN_MAKS_VIDEO = 200 * 1024 * 1024;

export function klasifikasiFile(
  file: File
): { jenis: JenisItem } | { error: string } {
  if (TIPE_VIDEO.includes(file.type)) {
    if (file.size > UKURAN_MAKS_VIDEO) {
      return { error: `Video "${file.name}" melebihi batas 200 MB.` };
    }
    return { jenis: "video" };
  }
  if (file.size > UKURAN_MAKS) {
    return { error: `Berkas "${file.name}" melebihi batas 20 MB.` };
  }
  if (TIPE_FOTO.includes(file.type)) return { jenis: "foto" };
  if (TIPE_DOKUMEN.includes(file.type)) return { jenis: "dokumen" };
  return {
    error: `Berkas "${file.name}" tidak didukung. Gunakan foto (JPG, PNG, WEBP), video (MP4), atau dokumen (PDF, Word, PowerPoint, Excel).`,
  };
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatTanggalIndo(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}
