import { useRef, useState } from "react";
import { klasifikasiFile, type JenisItem } from "@/lib/galeri-api";

interface PendingFile {
  file: File;
  jenis: JenisItem;
  previewUrl: string | undefined;
}

interface Props {
  onSimpan: (
    file: File,
    jenis: JenisItem,
    keterangan: string,
    tanggal: string
  ) => Promise<void>;
}

export function UploadZone({ onSimpan }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [menyeret, setMenyeret] = useState(false);
  const [antrian, setAntrian] = useState<PendingFile[]>([]);
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [kesalahan, setKesalahan] = useState<string | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

  function prosesFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const diterima: PendingFile[] = [];
    const galat: string[] = [];
    for (const file of Array.from(files)) {
      const hasil = klasifikasiFile(file);
      if ("error" in hasil) {
        galat.push(hasil.error);
        continue;
      }
      diterima.push({
        file,
        jenis: hasil.jenis,
        previewUrl:
          hasil.jenis === "dokumen" ? undefined : URL.createObjectURL(file),
      });
    }
    setKesalahan(galat.length > 0 ? galat.join(" ") : null);
    if (diterima.length > 0) setAntrian((prev) => [...prev, ...diterima]);
  }

  async function konfirmasi() {
    if (antrian.length === 0) return;
    if (!keterangan.trim()) {
      setKesalahan("Mohon isi keterangan kegiatan terlebih dahulu.");
      return;
    }
    if (!tanggal) {
      setKesalahan("Mohon pilih tanggal kegiatan.");
      return;
    }
    setMenyimpan(true);
    setKesalahan(null);
    try {
      for (const p of antrian) {
        await onSimpan(p.file, p.jenis, keterangan.trim().slice(0, 200), tanggal);
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      }
      setAntrian([]);
      setKeterangan("");
    } catch (e) {
      setKesalahan(
        "Gagal menyimpan berkas. Periksa koneksi internet lalu coba lagi."
      );
      console.error(e);
    } finally {
      setMenyimpan(false);
    }
  }

  function batal() {
    antrian.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
    setAntrian([]);
  }

  return (
    <section id="unggah" className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-center hud-label">Unit Unggah</p>
      <h2 className="mt-3 text-center font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Unggah Dokumentasi
      </h2>
      <div className="mx-auto mt-5 w-24 tech-divider" />
      <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
        Seret dan letakkan foto, video, atau dokumen kegiatan magang ke area di
        bawah ini. Bisa memilih beberapa berkas sekaligus. Semua berkas
        tersimpan di database sehingga tetap ada saat halaman dimuat ulang atau
        dibuka dari perangkat lain.
      </p>

      <div
        role="button"
        tabIndex={0}
        aria-label="Area unggah berkas"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setMenyeret(true);
        }}
        onDragLeave={() => setMenyeret(false)}
        onDrop={(e) => {
          e.preventDefault();
          setMenyeret(false);
          prosesFiles(e.dataTransfer.files);
        }}
        className={`mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-14 text-center transition-all duration-300 ${
          menyeret
            ? "scale-[1.01] border-tech bg-surface-elevated"
            : "border-input bg-surface hover:border-tech/60 hover:bg-surface-elevated"
        }`}
      >
        <svg
          className="h-10 w-10 text-tech"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="mt-4 text-sm font-medium text-foreground">
          Seret berkas ke sini
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          atau klik untuk memilih — Foto (JPG, PNG, WEBP), Video (MP4, maks.
          200 MB) &amp; Dokumen (PDF, Word, PowerPoint, Excel), maks. 20 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            prosesFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {kesalahan && (
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
          {kesalahan}
        </p>
      )}

      {antrian.length > 0 && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6 animate-reveal-up">
          <h3 className="font-display text-lg font-semibold text-foreground">
            Lengkapi Keterangan{" "}
            <span className="font-mono text-xs text-muted-foreground">
              ({antrian.length} berkas)
            </span>
          </h3>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {antrian.map((p, i) => (
              <div key={i} className="shrink-0">
                {p.jenis === "foto" && p.previewUrl ? (
                  <img
                    src={p.previewUrl}
                    alt={`Pratinjau ${p.file.name}`}
                    className="h-24 w-32 rounded-lg border border-border object-cover"
                  />
                ) : p.jenis === "video" && p.previewUrl ? (
                  <video
                    src={p.previewUrl}
                    preload="metadata"
                    muted
                    className="h-24 w-32 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-border bg-surface p-2 text-center text-[0.65rem] text-muted-foreground">
                    {p.file.name}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">Keterangan kegiatan</span>
              <input
                type="text"
                value={keterangan}
                maxLength={200}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="cth. Observasi Proses Instalasi Jaringan"
                className="rounded-lg border border-input bg-surface px-4 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:border-tech focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-muted-foreground">Tanggal kegiatan</span>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="rounded-lg border border-input bg-surface px-4 py-2.5 text-foreground focus:border-tech focus:outline-none"
              />
            </label>
            <div className="flex gap-3">
              <button
                onClick={konfirmasi}
                disabled={menyimpan}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {menyimpan ? "Menyimpan…" : "Simpan ke Galeri"}
              </button>
              <button
                onClick={batal}
                disabled={menyimpan}
                className="rounded-lg border border-input px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
