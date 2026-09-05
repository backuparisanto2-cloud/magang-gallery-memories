import { formatTanggalIndo, type ItemGaleri } from "@/lib/galeri-api";

interface Props {
  fotos: ItemGaleri[];
  onBuka: (indeks: number) => void;
  onHapus: (item: ItemGaleri) => void;
  modePilih: boolean;
  terpilih: Set<string>;
  onToggle: (id: string) => void;
}

export function GalleryGrid({
  fotos,
  onBuka,
  onHapus,
  modePilih,
  terpilih,
  onToggle,
}: Props) {
  if (fotos.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="font-display text-xl font-medium text-foreground">
          Galeri masih kosong.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Unggah foto atau video kegiatan pertama melalui area unggah di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {fotos.map((foto, i) => {
        const dipilih = terpilih.has(foto.id);
        return (
          <figure
            key={foto.id}
            className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm transition-all animate-reveal-up ${
              dipilih
                ? "border-tech ring-2 ring-tech/40"
                : "border-border hover:border-tech/50"
            }`}
            style={{ animationDelay: `${(i % 6) * 90}ms` }}
            onClick={() => (modePilih ? onToggle(foto.id) : onBuka(i))}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              {foto.jenis === "video" ? (
                <>
                  <video
                    src={foto.url}
                    preload="metadata"
                    muted
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-tech/50 bg-card/80 text-tech backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <svg
                        className="ml-0.5 h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.5-6.86a1.03 1.03 0 000-1.76L9.56 4.26A1.03 1.03 0 008 5.14z" />
                      </svg>
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={foto.url}
                  alt={foto.keterangan}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              {/* Bingkai sudut bergaya HUD */}
              <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-tech/50" />
              <span className="pointer-events-none absolute right-2 bottom-2 h-4 w-4 border-b border-r border-tech/50" />
            </div>

            <figcaption className="border-t border-border p-4 text-left">
              <p className="font-display text-base font-medium leading-snug text-foreground">
                {foto.keterangan}
              </p>
              <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-tech">
                {formatTanggalIndo(foto.tanggal)}
              </p>
            </figcaption>

            {modePilih ? (
              <span
                className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border text-xs font-bold transition-colors ${
                  dipilih
                    ? "border-tech bg-primary text-primary-foreground"
                    : "border-input bg-card/90 text-transparent"
                }`}
                aria-hidden="true"
              >
                ✓
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHapus(foto);
                }}
                aria-label={`Hapus ${foto.keterangan}`}
                title="Hapus"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-sm text-muted-foreground shadow-sm transition-all hover:bg-destructive hover:text-destructive-foreground md:opacity-0 md:group-hover:opacity-100"
              >
                ✕
              </button>
            )}
          </figure>
        );
      })}
    </div>
  );
}
