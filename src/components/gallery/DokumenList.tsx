import { formatTanggalIndo, type ItemGaleri } from "@/lib/galeri-store";

interface Props {
  dokumens: ItemGaleri[];
  onHapus: (id: string) => void;
}

function IkonDokumen() {
  return (
    <svg
      className="h-8 w-8 shrink-0 text-gold"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

export function DokumenList({ dokumens, onHapus }: Props) {
  if (dokumens.length === 0) return null;

  return (
    <div className="mt-20">
      <h3 className="text-center font-display text-2xl font-medium tracking-wide text-foreground md:text-3xl">
        Dokumen Kegiatan
      </h3>
      <div className="mx-auto mt-5 w-20 gold-divider" />
      <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {dokumens.map((dok) => (
          <li
            key={dok.id}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-gold/50 animate-reveal-up"
          >
            <IkonDokumen />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-medium text-foreground">
                {dok.keterangan}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {dok.namaFile}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
                {formatTanggalIndo(dok.tanggal)}
              </p>
            </div>
            <button
              onClick={() => onHapus(dok.id)}
              aria-label={`Hapus ${dok.keterangan}`}
              title="Hapus dokumen"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
