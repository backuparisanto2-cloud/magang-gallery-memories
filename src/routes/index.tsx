import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Hero } from "@/components/gallery/Hero";
import { UploadZone } from "@/components/gallery/UploadZone";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { DokumenList } from "@/components/gallery/DokumenList";
import { Lightbox } from "@/components/gallery/Lightbox";
import { Footer } from "@/components/gallery/Footer";
import {
  ambilSemuaItem,
  hapusItem,
  simpanItem,
  type ItemGaleri,
} from "@/lib/galeri-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Galeri Program Magang Guru — SMK Muhammadiyah 1 Paguyangan" },
      {
        name: "description",
        content:
          "Galeri dokumentasi kegiatan Program Magang Guru SMK Muhammadiyah 1 Paguyangan di PT Sekawan Global Komunika. Unggah dan lihat foto serta dokumen kegiatan.",
      },
      {
        property: "og:title",
        content: "Galeri Program Magang Guru — SMK Muhammadiyah 1 Paguyangan",
      },
      {
        property: "og:description",
        content:
          "Dokumentasi kegiatan Program Magang Guru SMK Muhammadiyah 1 Paguyangan di PT Sekawan Global Komunika.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [items, setItems] = useState<ItemGaleri[]>([]);
  const [urls, setUrls] = useState<Map<string, string>>(new Map());
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [termuat, setTermuat] = useState(false);

  useEffect(() => {
    ambilSemuaItem().then((data) => {
      setItems(data);
      setUrls(
        new Map(
          data
            .filter((i) => i.jenis === "foto")
            .map((i) => [i.id, URL.createObjectURL(i.blob)])
        )
      );
      setTermuat(true);
    });
  }, []);

  const unggah = useCallback(
    async (
      file: File,
      jenis: "foto" | "dokumen",
      keterangan: string,
      tanggal: string
    ) => {
      const item: ItemGaleri = {
        id: crypto.randomUUID(),
        jenis,
        namaFile: file.name,
        keterangan,
        tanggal,
        dibuatPada: Date.now(),
        blob: file,
      };
      await simpanItem(item);
      setItems((prev) =>
        [item, ...prev].sort(
          (a, b) =>
            b.tanggal.localeCompare(a.tanggal) || b.dibuatPada - a.dibuatPada
        )
      );
      if (jenis === "foto") {
        setUrls((prev) => {
          const berikut = new Map(prev);
          berikut.set(item.id, URL.createObjectURL(file));
          return berikut;
        });
      }
    },
    []
  );

  const hapus = useCallback(async (id: string) => {
    await hapusItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setUrls((prev) => {
      const berikut = new Map(prev);
      const url = berikut.get(id);
      if (url) URL.revokeObjectURL(url);
      berikut.delete(id);
      return berikut;
    });
    setLightbox(null);
  }, []);

  const fotos = items.filter((i) => i.jenis === "foto");
  const dokumens = items.filter((i) => i.jenis === "dokumen");

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <UploadZone onSimpan={unggah} />

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <h2 className="text-center font-display text-3xl font-medium tracking-wide text-foreground md:text-4xl">
          Galeri Kegiatan
        </h2>
        <div className="mx-auto mt-6 w-24 gold-divider" />
        <div className="mt-12">
          {termuat ? (
            <GalleryGrid
              fotos={fotos}
              urls={urls}
              onBuka={setLightbox}
              onHapus={hapus}
            />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Memuat galeri…
            </p>
          )}
        </div>
        <DokumenList dokumens={dokumens} onHapus={hapus} />
      </section>

      <Footer />

      {lightbox !== null && (
        <Lightbox
          items={fotos}
          indeks={lightbox}
          urls={urls}
          onTutup={() => setLightbox(null)}
          onNavigasi={setLightbox}
        />
      )}
    </main>
  );
}
