export function Hero() {
  return (
    <header className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 grid-backdrop" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, oklch(0.54 0.15 245 / 0.10), transparent), radial-gradient(ellipse 60% 50% at 50% 110%, oklch(0.68 0.17 48 / 0.08), transparent)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px tech-divider" />

      {/* Siluet drone teknis */}
      <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center opacity-[0.14] animate-drift">
        <svg
          width="220"
          height="120"
          viewBox="0 0 220 120"
          fill="none"
          stroke="currentColor"
          className="text-tech"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="34" cy="34" r="26" />
          <circle cx="186" cy="34" r="26" />
          <circle cx="34" cy="92" r="26" />
          <circle cx="186" cy="92" r="26" />
          <path d="M52 52l40 24M168 52l-40 24M52 74l40-24M168 74l-40-24" />
          <rect x="90" y="48" width="40" height="28" rx="6" />
          <circle cx="110" cy="62" r="6" />
        </svg>
      </div>

      <div className="relative max-w-4xl animate-reveal-up">
        <p className="hud-label">Dokumentasi Kegiatan · Rec 01</p>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
          Gallery Program Guru Magang
        </h1>
        <div className="mx-auto mt-7 w-40 tech-divider" />
        <p className="mt-7 font-display text-lg font-medium text-foreground md:text-2xl">
          SMK Muhammadiyah 1 Paguyangan
        </p>
        <p className="mt-2 hud-label">bersama</p>
        <p className="mt-2 font-display text-lg font-medium text-tech md:text-2xl">
          PT Sekawan Global Komunika
        </p>
      </div>

      <a
        href="#unggah"
        className="absolute bottom-10 flex flex-col items-center gap-2 text-[0.68rem] font-mono uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-tech"
      >
        Gulir ke bawah
        <span className="inline-block h-8 w-px animate-pulse bg-tech" />
      </a>
    </header>
  );
}
