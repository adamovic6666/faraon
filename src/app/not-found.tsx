import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stranica nije pronađena | Faraon",
  description: "Tražena stranica ne postoji ili je premeštena.",
  robots: {
    index: false,
    follow: true,
  },
};

const NotFound = () => {
  return (
    <main className="relative isolate overflow-hidden bg-section px-4 pb-12 pt-24 md:pb-16 md:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_25%,rgba(255,183,0,0.2),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(179,18,18,0.18),transparent_36%),radial-gradient(circle_at_50%_90%,rgba(0,0,0,0.12),transparent_42%)]" />

      <section className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center rounded-[28px] border border-black/10 bg-white/90 px-6 py-12 text-center shadow-[0_14px_60px_rgba(0,0,0,0.08)] backdrop-blur md:px-10">
        <p className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
          Error 404
        </p>

        <h1 className="mt-4 text-7xl font-bold leading-none text-brand md:text-8xl">
          404
        </h1>
        <h2 className="mt-3 text-2xl font-semibold text-black/85 md:text-3xl">
          Stranica nije pronađena
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/65 md:text-base">
          Link koji ste otvorili možda više ne postoji, premešten je ili je
          adresa pogrešno uneta. Vratite se na početnu stranu ili nastavite ka
          online prodavnici.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black/80 transition hover:bg-primary/90"
          >
            Nazad na početnu
          </Link>
          <Link
            href="/webshop"
            className="rounded-full border border-black/20 bg-white px-6 py-3 text-sm font-semibold text-black/80 transition hover:bg-black/5"
          >
            Idi u webshop
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
