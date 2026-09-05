import { formatTanggalIndo, type ItemGaleri } from "@/lib/galeri-store";

interface Props {
  fotos: ItemGaleri[];
  urls: Map<string, string>;
  onBuka: (indeks: number) => void;
  onHapus: (id: string) => void;
}

export function GalleryGrid({ fotos, urls, onBuka, onHapus }: Props) {
  if (fotos.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="font-display text-2xl italic text-muted-foreground">
          Galeri masih kosong.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Unggah foto kegiatan pertama Anda melalui area unggah di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {fotos.map((foto, i) => (
        <figure
          key={foto.id}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card animate-reveal-up"
          style={{ animationDelay: `${(i % 6) * 90}ms` }}
          onClick={() => onBuka(i)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            {foto.jenis === "video" ? (
              <>
                <video
                  src={urls.get(foto.id)}
                  preload="metadata"
                  muted
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-background/60 text-gold backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
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
                src={urls.get(foto.id)}
                alt={foto.keterangan}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            )}
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-5 pt-14 text-left opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
            <p className="font-display text-lg leading-snug text-foreground">
              {foto.keterangan}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
              {formatTanggalIndo(foto.tanggal)}
            </p>
          </figcaption>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onHapus(foto.id);
            }}
            aria-label={`Hapus ${foto.keterangan}`}
            title="Hapus foto"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-sm text-foreground opacity-100 transition-all hover:bg-destructive hover:text-destructive-foreground md:opacity-0 md:group-hover:opacity-100"
          >
            ✕
          </button>
        </figure>
      ))}
    </div>
  );
}
