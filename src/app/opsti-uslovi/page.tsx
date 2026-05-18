import SectionTitle from "@/components/common/SectionTitle";
import { Separator } from "@radix-ui/react-separator";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Opšti uslovi poslovanja",
  description:
    "Opšti uslovi poslovanja online prodavnice Faraon diskonti – prava i obaveze kupca i prodavca.",
};

export const dynamic = "force-static";

export default function OpstiUsloviPage() {
  return (
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <SectionTitle title="Opšti uslovi poslovanja" noAnimation />

        <div className="mx-auto mt-10 max-w-3xl space-y-8 font-light text-sm leading-relaxed text-black/80 md:text-base">
          <p>
            Dobrodošli na internet stranicu{" "}
            <Link
              href="https://www.faraondiskonti.rs"
              className="font-semibold text-brand hover:underline"
            >
              www.faraondiskonti.rs
            </Link>
            .
          </p>
          <p>
            Ovim Opštim uslovima poslovanja (u daljem tekstu: „Opšti uslovi")
            uređuju se uslovi korišćenja internet prodavnice i kupovine robe
            putem sajta{" "}
            <Link
              href="https://www.faraondiskonti.rs"
              className="font-semibold text-brand hover:underline"
            >
              www.faraondiskonti.rs
            </Link>
            .
          </p>

          <div className="rounded-2xl border border-black/10 bg-section px-6 py-5">
            <p className="font-semibold text-black">Prodavac je:</p>
            <p className="mt-2">STR Diskont pića Faraon PS</p>
            <p>Karlovački put 1, 21132 Petrovaradin</p>
            <p>Matični broj: 57102373</p>
            <p>PIB: 104032720</p>
            <p>Telefon: 062 801 7376</p>
            <p>E-mail: info@faraondiskonti.rs</p>
            <p className="mt-2 text-black/60">(u daljem tekstu: „Prodavac")</p>
          </div>

          <p>
            Kupac je svako punoletno fizičko ili pravno lice koje putem internet
            prodavnice izvrši porudžbinu robe (u daljem tekstu: „Kupac").
          </p>

          <Separator className="my-8 h-px bg-black/10" />

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              Član 1 – Primena Opštih uslova
            </h2>
            <p>
              Ovi Opšti uslovi obavezuju Prodavca i svakog Kupca koji pristupa
              sajtu i vrši poručivanje robe.
            </p>
            <p>
              Kupac je dužan da pre potvrde porudžbine pažljivo pročita Opšte
              uslove i potvrdi da je sa njima saglasan.
            </p>
            <p>
              Prodavac zadržava pravo izmene Opštih uslova u bilo kom trenutku.
              Izmene stupaju na snagu objavljivanjem na internet stranici.
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              Član 2 – Ograničenje punoletstva (Prodaja alkohola 18+)
            </h2>
            <p>Prodajni asortiman internet prodavnice sadrži alkoholna pića.</p>
            <p>
              Shodno važećim propisima Republike Srbije, zabranjena je prodaja i
              isporuka alkoholnih pića licima mlađim od 18 godina.
            </p>
            <p>Potvrdom porudžbine Kupac izjavljuje da je punoletno lice.</p>
            <p>
              Dostavljač zadržava pravo da prilikom uručenja robe zatraži važeći
              lični dokument radi provere punoletstva primaoca.
            </p>
            <p>
              Ukoliko primalac odbije identifikaciju ili se utvrdi da je
              maloletno lice, dostava neće biti izvršena.
            </p>
            <p>
              U slučaju neuspele isporuke iz navedenih razloga, Prodavac
              zadržava pravo obračuna stvarnih troškova dostave u skladu sa
              važećim{" "}
              <Link
                href="/cenovnik-dostave"
                className="font-semibold text-brand hover:underline"
              >
                cenovnikom dostave
              </Link>
              .
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              Član 3 – Teritorijalno ograničenje i cene
            </h2>
            <p>
              Prodaja i isporuka robe vrše se isključivo na teritoriji Grada
              Novog Sada i okolnih mesta obuhvaćenih zvaničnim{" "}
              <Link
                href="/cenovnik-dostave"
                className="font-semibold text-brand hover:underline"
              >
                cenovnikom dostave
              </Link>{" "}
              Prodavca.
            </p>
            <p>
              Porudžbine sa adresom isporuke van definisane teritorije mogu biti
              odbijene ili otkazane.
            </p>
            <p>
              Sve cene na sajtu iskazane su u dinarima (RSD) i uključuju porez
              na dodatu vrednost (PDV).
            </p>
            <p>
              Prodavac zadržava pravo izmene cena u bilo kom trenutku, ali se
              obavezuje da robu isporuči po cenama koje su važile u trenutku
              potvrde porudžbine.
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              Član 4 – Vansudsko rešavanje sporova
            </h2>
            <p>
              U skladu sa Zakonom o zaštiti potrošača, Kupac može pokrenuti
              postupak vansudskog rešavanja potrošačkog spora pred nadležnim
              telom.
            </p>
            <p>
              Preduslov za pokretanje postupka jeste da je Kupac prethodno
              izjavio reklamaciju Prodavcu.
            </p>
            <p>
              Prodavac je dužan da učestvuje u postupku vansudskog rešavanja
              potrošačkih sporova pred nadležnim telima.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
