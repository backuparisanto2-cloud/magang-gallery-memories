import { formatTanggalIndo, type ItemGaleri } from "@/lib/galeri-api";

interface Props {
  dokumens: ItemGaleri[];
  onHapus: (item: ItemGaleri) => void;
  modePilih: boolean;
  terpilih: Set<string>;
  onToggle: (id: string) => void;
}

function IkonDokumen() {
  return (
    <svg
      className="h-8 w-8 shrink-0 text-tech"
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

export function DokumenList({
  dokumens,
  onHapus,
  modePilih,
  terpilih,
  onToggle,
}: Props) {
  if (dokumens.length === 0) return null;

  return (
    <div className="mt-20">
      <p className="text-center hud-label">Arsip Berkas</p>
      <h3 className="mt-3 text-center font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        Dokumen Kegiatan
      </h3>
      <div className="mx-auto mt-5 w-20 tech-divider" />
      <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {dokumens.map((dok) => {
          const dipilih = terpilih.has(dok.id);
          return (
            <li
              key={dok.id}
              onClick={() => modePilih && onToggle(dok.id)}
              className={`group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors animate-reveal-up ${
                dipilih
                  ? "border-tech ring-2 ring-tech/40"
                  : "border-border hover:border-tech/50"
              } ${modePilih ? "cursor-pointer" : ""}`}
            >
              {modePilih && (
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                    dipilih
                      ? "border-tech bg-primary text-primary-foreground"
                      : "border-input text-transparent"
                  }`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
              <IkonDokumen />
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate font-medium text-foreground">
                  {dok.keterangan}
                </p>
                <a
                  href={dok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="block truncate text-xs text-muted-foreground underline-offset-2 hover:text-tech hover:underline"
                >
                  {dok.namaFile}
                </a>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-tech">
                  {formatTanggalIndo(dok.tanggal)}
                </p>
              </div>
              {!modePilih && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onHapus(dok);
                  }}
                  aria-label={`Hapus ${dok.keterangan}`}
                  title="Hapus dokumen"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  ✕
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
