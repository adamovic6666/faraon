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
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
      <section className="mx-auto max-w-frame px-4 xl:px-0">
        <div className="mx-auto max-w-2xl rounded-[24px] border border-black/15 bg-white p-6 text-center shadow-sm md:p-10">
          <p className="inline-flex rounded-full border border-black/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/70">
            Porudžbina uspešna
          </p>

          <h1 className="mt-4 text-2xl font-bold text-black md:text-3xl">
            Hvala na kupovini
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-black/70 md:text-base">
            Vaša porudžbina je evidentirana i uskoro ćemo Vas kontaktirati radi
            potvrde i isporuke.
          </p>

          {orderNumber ? (
            <p className="mt-4 text-base font-semibold text-brand md:text-lg">
              Broj porudžbine: #{orderNumber}
            </p>
          ) : (
            <p className="mt-4 text-sm text-black/65">
              Broj porudžbine nije dostupan u URL-u, ali je porudžbina uspešno
              poslata.
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/prodavnica"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black/80 transition hover:bg-primary/90"
            >
              Nazad u webshop
            </Link>
            <Link
              href="/"
              className="rounded-full border border-black/20 bg-white px-6 py-3 text-sm font-semibold text-black/80 transition hover:bg-black/5"
            >
              Početna strana
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessPage;
