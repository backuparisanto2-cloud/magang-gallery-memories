import { useRef, useState } from "react";
import { klasifikasiFile } from "@/lib/galeri-store";

interface PendingFile {
  file: File;
  jenis: "foto" | "dokumen";
  previewUrl?: string;
}

interface Props {
  onSimpan: (
    file: File,
    jenis: "foto" | "dokumen",
    keterangan: string,
    tanggal: string
  ) => Promise<void>;
}

export function UploadZone({ onSimpan }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [menyeret, setMenyeret] = useState(false);
  const [pending, setPending] = useState<PendingFile | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [kesalahan, setKesalahan] = useState<string | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

  function prosesFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;
    const hasil = klasifikasiFile(file);
    if ("error" in hasil) {
      setKesalahan(hasil.error);
      return;
    }
    setKesalahan(null);
    setKeterangan("");
    setPending({
      file,
      jenis: hasil.jenis,
      previewUrl:
        hasil.jenis === "foto" ? URL.createObjectURL(file) : undefined,
    });
  }

  async function konfirmasi() {
    if (!pending) return;
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
      await onSimpan(
        pending.file,
        pending.jenis,
        keterangan.trim().slice(0, 200),
        tanggal
      );
      setPending(null);
      setKeterangan("");
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <section id="unggah" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-center font-display text-3xl font-medium tracking-wide text-foreground md:text-4xl">
        Unggah Dokumentasi
      </h2>
      <div className="mx-auto mt-6 w-24 gold-divider" />
      <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
        Seret dan letakkan foto atau dokumen kegiatan magang ke area di bawah
        ini, atau pilih berkas dari perangkat Anda.
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
            ? "border-gold bg-surface-elevated scale-[1.01]"
            : "border-input bg-surface hover:border-gold/60 hover:bg-surface-elevated"
        }`}
      >
        <svg
          className="h-10 w-10 text-gold"
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
          atau klik untuk memilih — Foto (JPG, PNG, WEBP) & Dokumen (PDF, Word,
          PowerPoint, Excel), maks. 20 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            prosesFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {kesalahan && (
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground animate-fade-in">
          {kesalahan}
        </p>
      )}

      {pending && (
        <div className="mt-8 rounded-xl border border-border bg-card p-6 animate-reveal-up">
          <h3 className="font-display text-xl text-foreground">
            Lengkapi Keterangan
          </h3>
          <div className="mt-4 flex flex-col gap-5 md:flex-row">
            {pending.previewUrl ? (
              <img
                src={pending.previewUrl}
                alt={`Pratinjau ${pending.file.name}`}
                className="h-40 w-full rounded-lg object-cover md:w-56"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-surface-elevated text-xs text-muted-foreground md:w-56">
                {pending.file.name}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">
                  Keterangan kegiatan
                </span>
                <input
                  type="text"
                  value={keterangan}
                  maxLength={200}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="cth. Observasi Proses Instalasi Jaringan"
                  className="rounded-lg border border-input bg-surface px-4 py-2.5 text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">
                  Tanggal kegiatan
                </span>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="rounded-lg border border-input bg-surface px-4 py-2.5 text-foreground focus:border-gold focus:outline-none [color-scheme:dark]"
                />
              </label>
              <div className="mt-auto flex gap-3">
                <button
                  onClick={konfirmasi}
                  disabled={menyimpan}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {menyimpan ? "Menyimpan…" : "Simpan ke Galeri"}
                </button>
                <button
                  onClick={() => setPending(null)}
                  className="rounded-lg border border-input px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
