import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hero } from "@/components/gallery/Hero";
import { UploadZone } from "@/components/gallery/UploadZone";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { DokumenList } from "@/components/gallery/DokumenList";
import { Lightbox } from "@/components/gallery/Lightbox";
import { Footer } from "@/components/gallery/Footer";
import {
  ambilSemuaItem,
  bagikanItems,
  hapusItem,
  salinTautan,
  unduhItems,
  unggahItem,
  type ItemGaleri,
  type JenisItem,
} from "@/lib/galeri-api";

const JUDUL =
  "Gallery Program Guru Magang SMK Muhammadiyah 1 Paguyangan × PT Sekawan Global Komunika";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gallery Program Guru Magang — SMK Muh 1 Paguyangan" },
      {
        name: "description",
        content:
          "Galeri dokumentasi foto, video, dan dokumen Program Guru Magang SMK Muhammadiyah 1 Paguyangan bersama PT Sekawan Global Komunika.",
      },
      { property: "og:title", content: JUDUL },
      {
        property: "og:description",
        content:
          "Dokumentasi foto, video, dan dokumen Program Guru Magang SMK Muhammadiyah 1 Paguyangan bersama PT Sekawan Global Komunika.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [items, setItems] = useState<ItemGaleri[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [termuat, setTermuat] = useState(false);
  const [modePilih, setModePilih] = useState(false);
  const [terpilih, setTerpilih] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    ambilSemuaItem()
      .then(setItems)
      .catch((e) => {
        console.error(e);
        setStatus("Gagal memuat galeri. Periksa koneksi internet Anda.");
      })
      .finally(() => setTermuat(true));
  }, []);

  const unggah = useCallback(
    async (
      file: File,
      jenis: JenisItem,
      keterangan: string,
      tanggal: string
    ) => {
      const item = await unggahItem(file, jenis, keterangan, tanggal);
      setItems((prev) =>
        [item, ...prev].sort(
          (a, b) =>
            b.tanggal.localeCompare(a.tanggal) ||
            b.createdAt.localeCompare(a.createdAt)
        )
      );
    },
    []
  );

  const hapus = useCallback(async (item: ItemGaleri) => {
    await hapusItem(item);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setTerpilih((prev) => {
      const next = new Set(prev);
      next.delete(item.id);
      return next;
    });
    setLightbox(null);
  }, []);

  const toggle = useCallback((id: string) => {
    setTerpilih((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const fotos = useMemo(
    () => items.filter((i) => i.jenis !== "dokumen"),
    [items]
  );
  const dokumens = useMemo(
    () => items.filter((i) => i.jenis === "dokumen"),
    [items]
  );
  const itemTerpilih = useMemo(
    () => items.filter((i) => terpilih.has(i.id)),
    [items, terpilih]
  );

  async function jalankan(aksi: () => Promise<void>, pesan: string) {
    try {
      setStatus(null);
      await aksi();
      setStatus(pesan);
    } catch (e) {
      console.error(e);
      setStatus("Aksi dibatalkan atau gagal dijalankan.");
    }
    setTimeout(() => setStatus(null), 4000);
  }

  async function hapusTerpilih() {
    for (const item of itemTerpilih) await hapusItem(item);
    const ids = new Set(itemTerpilih.map((i) => i.id));
    setItems((prev) => prev.filter((i) => !ids.has(i.id)));
    setTerpilih(new Set());
  }

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <UploadZone onSimpan={unggah} />

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <p className="text-center hud-label">Arsip Visual</p>
        <h2 className="mt-3 text-center font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Galeri Kegiatan
        </h2>
        <div className="mx-auto mt-5 w-24 tech-divider" />

        {/* Bilah pilih & bagikan */}
        {items.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setModePilih((v) => !v);
                setTerpilih(new Set());
              }}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                modePilih
                  ? "border-tech bg-primary text-primary-foreground"
                  : "border-input text-foreground hover:border-tech hover:text-tech"
              }`}
            >
              {modePilih ? "Selesai memilih" : "Pilih beberapa"}
            </button>

            {modePilih && (
              <>
                <button
                  onClick={() => setTerpilih(new Set(items.map((i) => i.id)))}
                  className="rounded-lg border border-input px-4 py-2 text-sm text-foreground transition-colors hover:border-tech hover:text-tech"
                >
                  Pilih semua ({items.length})
                </button>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {terpilih.size} dipilih
                </span>
              </>
            )}
          </div>
        )}

        {modePilih && itemTerpilih.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-border bg-card p-4 animate-reveal-up">
            <button
              onClick={() =>
                jalankan(
                  async () => {
                    await bagikanItems(itemTerpilih);
                  },
                  "Berkas siap dibagikan ke WhatsApp, Google Drive, atau aplikasi lain."
                )
              }
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Bagikan ({itemTerpilih.length})
            </button>
            <button
              onClick={() =>
                jalankan(
                  () => unduhItems(itemTerpilih),
                  "Berkas terpilih diunduh."
                )
              }
              className="rounded-lg border border-input px-4 py-2 text-sm text-foreground transition-colors hover:border-tech hover:text-tech"
            >
              Unduh
            </button>
            <button
              onClick={() =>
                jalankan(
                  () => salinTautan(itemTerpilih),
                  "Tautan berkas disalin ke papan klip."
                )
              }
              className="rounded-lg border border-input px-4 py-2 text-sm text-foreground transition-colors hover:border-tech hover:text-tech"
            >
              Salin tautan
            </button>
            <button
              onClick={() =>
                jalankan(hapusTerpilih, "Berkas terpilih dihapus.")
              }
              className="rounded-lg border border-destructive/50 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              Hapus
            </button>
          </div>
        )}

        {status && (
          <p className="mt-4 text-center text-sm text-muted-foreground animate-fade-in">
            {status}
          </p>
        )}

        <div className="mt-10">
          {termuat ? (
            <GalleryGrid
              fotos={fotos}
              onBuka={setLightbox}
              onHapus={hapus}
              modePilih={modePilih}
              terpilih={terpilih}
              onToggle={toggle}
            />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Memuat galeri…
            </p>
          )}
        </div>

        <DokumenList
          dokumens={dokumens}
          onHapus={hapus}
          modePilih={modePilih}
          terpilih={terpilih}
          onToggle={toggle}
        />
      </section>

      <Footer />

      {lightbox !== null && (
        <Lightbox
          items={fotos}
          indeks={lightbox}
          onTutup={() => setLightbox(null)}
          onNavigasi={setLightbox}
          onBagikan={(item) =>
            jalankan(
              async () => {
                await bagikanItems([item]);
              },
              "Berkas siap dibagikan."
            )
          }
        />
      )}
    </main>
  );
}
