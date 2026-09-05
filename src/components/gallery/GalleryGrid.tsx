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
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={urls.get(foto.id)}
              alt={foto.keterangan}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
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
