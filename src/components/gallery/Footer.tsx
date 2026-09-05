export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border bg-surface px-6 py-16 text-center">
      <div className="absolute inset-x-0 top-0 tech-divider" />
      <p className="hud-label">Terima kasih</p>
      <p className="mt-4 font-display text-xl font-medium text-foreground md:text-2xl">
        PT Sekawan Global Komunika
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        atas kesempatan dan bimbingan selama Program Guru Magang
        <br />
        SMK Muhammadiyah 1 Paguyangan
      </p>
      <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
        Dokumentasi Program Guru Magang
      </p>
    </footer>
  );
}
