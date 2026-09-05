import { useEffect } from "react";
import { formatTanggalIndo, type ItemGaleri } from "@/lib/galeri-api";

interface Props {
  items: ItemGaleri[];
  indeks: number;
  onTutup: () => void;
  onNavigasi: (indeks: number) => void;
  onBagikan: (item: ItemGaleri) => void;
}

export function Lightbox({
  items,
  indeks,
  onTutup,
  onNavigasi,
  onBagikan,
}: Props) {
  const item = items[indeks];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onTutup();
      if (e.key === "ArrowLeft" && indeks > 0) onNavigasi(indeks - 1);
      if (e.key === "ArrowRight" && indeks < items.length - 1)
        onNavigasi(indeks + 1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [indeks, items.length, onTutup, onNavigasi]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={item.keterangan}
      onClick={onTutup}
    >
      <button
        onClick={onTutup}
        aria-label="Tutup"
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:border-tech hover:text-tech"
      >
        ✕
      </button>

      {indeks > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigasi(indeks - 1);
          }}
          aria-label="Sebelumnya"
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-input bg-card/80 text-foreground transition-colors hover:border-tech hover:text-tech md:left-6"
        >
          ←
        </button>
      )}
      {indeks < items.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigasi(indeks + 1);
          }}
          aria-label="Berikutnya"
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-input bg-card/80 text-foreground transition-colors hover:border-tech hover:text-tech md:right-6"
        >
          →
        </button>
      )}

      <div
        className="flex flex-1 items-center justify-center px-6 pt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {item.jenis === "video" ? (
          <video
            key={item.id}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-[70vh] max-w-full rounded-lg shadow-2xl animate-scale-in"
          />
        ) : (
          <img
            src={item.url}
            alt={item.keterangan}
            className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl animate-scale-in"
          />
        )}
      </div>
      <div
        className="px-6 pb-10 pt-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display text-xl text-foreground md:text-2xl">
          {item.keterangan}
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-tech">
          {formatTanggalIndo(item.tanggal)}
        </p>
        <button
          onClick={() => onBagikan(item)}
          className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Bagikan berkas ini
        </button>
      </div>
    </div>
  );
}
