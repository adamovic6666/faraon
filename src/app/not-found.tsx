import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stranica nije pronađena | Faraon diskonti",
  description: "Tražena stranica ne postoji ili je premeštena.",
  robots: {
    index: false,
    follow: true,
  },
};

const NotFound = () => {
  return (
    <main className="relative isolate overflow-hidden px-4 pb-12 pt-24 md:pb-16 md:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10" />

      <section className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center rounded-[28px] border border-black/10 bg-white/90 px-6 py-12 text-center backdrop-blur md:px-10">
        <h1 className="mt-4 text-7xl font-bold leading-none text-brand md:text-8xl">
          404
        </h1>
        <h2 className="mt-6 text-2xl font-semibold text-black/85 md:text-3xl">
          Stranica nije pronađena
        </h2>

        <p className="text-black/80 text-center text-md sm:text-lg max-w-lg mx-auto leading-relaxed mt-2 font-light">
          Link koji ste otvorili možda više ne postoji, premešten je ili je
          adresa pogrešno uneta. Vratite se na početnu stranu ili nastavite ka
          online prodavnici.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 w-full">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-primary px-10 py-4 text-center text-black/80 transition-all hover:bg-primary/85 md:w-60 md:px-10 md:text-lg"
          >
            Nazad na početnu
          </Link>
          <Link
            href="/prodavnica"
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-brand px-10 py-4 text-center text-white transition-all hover:bg-brand/90 md:w-60 md:px-10 md:text-lg"
          >
            Idi u webshop
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
