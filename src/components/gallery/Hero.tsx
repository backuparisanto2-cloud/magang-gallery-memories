export function Hero() {
  return (
    <header className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Dekorasi sinematik */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.28 0.04 255 / 0.9), transparent), radial-gradient(ellipse 60% 50% at 50% 110%, oklch(0.78 0.11 85 / 0.12), transparent)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px gold-divider" />

      <div className="relative max-w-4xl animate-reveal-up">
        <p className="font-display text-sm uppercase tracking-[0.5em] text-gold">
          Dokumentasi Kegiatan
        </p>
        <h1 className="mt-6 font-display text-5xl font-medium leading-tight tracking-wide text-foreground md:text-7xl">
          Program Magang Guru
        </h1>
        <div className="mx-auto mt-8 w-40 gold-divider" />
        <p className="mt-8 font-display text-xl italic text-gold-soft md:text-2xl">
          SMK Muhammadiyah 1 Paguyangan
        </p>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          bersama
        </p>
        <p className="mt-2 font-display text-xl italic text-gold-soft md:text-2xl">
          PT Sekawan Global Komunika
        </p>
      </div>

      <a
        href="#unggah"
        className="absolute bottom-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-gold"
      >
        Gulir ke bawah
        <span className="inline-block h-8 w-px animate-pulse bg-gold" />
      </a>
    </header>
  );
}
