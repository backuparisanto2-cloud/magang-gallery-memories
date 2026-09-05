// Penyimpanan lokal galeri menggunakan IndexedDB.
// Foto disimpan sebagai Blob agar tidak terbatas ukuran localStorage.

export interface ItemGaleri {
  id: string;
  jenis: "foto" | "dokumen";
  namaFile: string;
  keterangan: string;
  tanggal: string; // ISO yyyy-mm-dd
  dibuatPada: number;
  blob: Blob;
}

const NAMA_DB = "galeri-magang-guru";
const NAMA_STORE = "item";
const VERSI = 1;

function bukaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NAMA_DB, VERSI);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(NAMA_STORE)) {
        db.createObjectStore(NAMA_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function ambilSemuaItem(): Promise<ItemGaleri[]> {
  const db = await bukaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NAMA_STORE, "readonly");
    const req = tx.objectStore(NAMA_STORE).getAll();
    req.onsuccess = () => {
      const items = (req.result as ItemGaleri[]).sort(
        (a, b) =>
          b.tanggal.localeCompare(a.tanggal) || b.dibuatPada - a.dibuatPada
      );
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function simpanItem(item: ItemGaleri): Promise<void> {
  const db = await bukaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NAMA_STORE, "readwrite");
    tx.objectStore(NAMA_STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function hapusItem(id: string): Promise<void> {
  const db = await bukaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NAMA_STORE, "readwrite");
    tx.objectStore(NAMA_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

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

const UKURAN_MAKS = 20 * 1024 * 1024; // 20 MB

export function klasifikasiFile(
  file: File
): { jenis: "foto" | "dokumen" } | { error: string } {
  if (file.size > UKURAN_MAKS) {
    return { error: `Berkas "${file.name}" melebihi batas 20 MB.` };
  }
  if (TIPE_FOTO.includes(file.type)) return { jenis: "foto" };
  if (TIPE_DOKUMEN.includes(file.type)) return { jenis: "dokumen" };
  return {
    error: `Berkas "${file.name}" tidak didukung. Gunakan foto (JPG, PNG, WEBP) atau dokumen (PDF, Word, PowerPoint, Excel).`,
  };
}

const HARI = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
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
