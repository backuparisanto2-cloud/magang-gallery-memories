import { useEffect } from "react";
import { formatTanggalIndo, type ItemGaleri } from "@/lib/galeri-store";

interface Props {
  items: ItemGaleri[];
  indeks: number;
  urls: Map<string, string>;
  onTutup: () => void;
  onNavigasi: (indeks: number) => void;
}

export function Lightbox({ items, indeks, urls, onTutup, onNavigasi }: Props) {
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
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:border-gold hover:text-gold"
      >
        ✕
      </button>

      {indeks > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigasi(indeks - 1);
          }}
          aria-label="Foto sebelumnya"
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:border-gold hover:text-gold md:left-6"
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
          aria-label="Foto berikutnya"
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:border-gold hover:text-gold md:right-6"
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
            src={urls.get(item.id)}
            controls
            autoPlay
            playsInline
            className="max-h-[70vh] max-w-full rounded-lg shadow-2xl animate-scale-in"
          />
        ) : (
          <img
            src={urls.get(item.id)}
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
        <p className="mt-2 text-sm uppercase tracking-[0.25em] text-gold">
          {formatTanggalIndo(item.tanggal)}
        </p>
      </div>
    </div>
  );
}
