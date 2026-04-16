"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks/redux";
import { clearCart } from "@/lib/features/carts/cartsSlice";

const SuccessPage = () => {
  const [cleared, setCleared] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const orderNumber = useMemo(() => {
    const value = searchParams.get("order")?.trim();
    return value || null;
  }, [searchParams]);

  useEffect(() => {
    if (!cleared) {
      dispatch(clearCart());
      setCleared(true);
    }
  }, [cleared, dispatch]);

  return (
    <main className="relative isolate overflow-hidden px-4 pb-12 pt-24 md:pb-16 md:pt-28">
      <section className="mx-auto max-w-frame px-0">
        <div className="mx-auto flex min-h-[45vh] max-w-3xl flex-col items-center justify-center rounded-[28px] border border-black/10 bg-white/90 px-6 py-12 text-center md:px-10">
          <p className="inline-flex rounded-full border border-black/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/70">
            Porudžbina uspešna
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-none text-brand md:text-6xl">
            Hvala na kupovini
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-center text-base font-light leading-relaxed text-black/80 sm:text-lg">
            Vaša porudžbina je evidentirana i uskoro ćemo Vas kontaktirati radi
            potvrde i isporuke.
          </p>

          {orderNumber ? (
            <p className="mt-5 text-lg font-semibold text-brand md:text-2xl">
              Broj porudžbine: #{orderNumber}
            </p>
          ) : (
            <p className="mt-5 text-sm text-black/70 md:text-base">
              Broj porudžbine nije dostupan u URL-u, ali je porudžbina uspešno
              poslata.
            </p>
          )}

          <div className="mt-8 flex w-full flex-wrap justify-center gap-3">
            <Link
              href="/prodavnica"
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-brand px-10 py-4 text-center text-white transition-all hover:bg-brand/90 md:w-60 md:px-10 md:text-lg"
            >
              Idi u webshop
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-primary px-10 py-4 text-center text-black/80 transition-all hover:bg-primary/85 md:w-60 md:px-10 md:text-lg"
            >
              Nazad na početnu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessPage;
