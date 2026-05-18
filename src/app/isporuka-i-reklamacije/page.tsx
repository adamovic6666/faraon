import SectionTitle from "@/components/common/SectionTitle";
import { Separator } from "@radix-ui/react-separator";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Isporuka i reklamacije",
  description:
    "Uslovi isporuke i postupak reklamacije u online prodavnici Faraon diskonti.",
};

export const dynamic = "force-static";

export default function IsporukaIReklamacijePage() {
  return (
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <SectionTitle title="Isporuka i reklamacije" noAnimation />

        <div className="mx-auto mt-10 max-w-3xl space-y-8 font-light text-sm leading-relaxed text-black/80 md:text-base">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              I. Isporuka robe
            </h2>
            <p>
              Isporuka robe vrši se isključivo na teritoriji Grada Novog Sada i
              okolnih mesta obuhvaćenih{" "}
              <Link
                href="/cenovnik-dostave"
                className="font-semibold text-brand hover:underline"
              >
                cenovnikom dostave
              </Link>
              .
            </p>
            <p>Dostavu vrši logistički partner angažovan od strane Prodavca.</p>
            <p>
              Rokovi isporuke zavise od dostupnosti robe, vremena potvrde
              porudžbine i rasporeda dostave.
            </p>
            <p>
              Prodavac zadržava pravo da kontaktira Kupca radi potvrde
              porudžbine pre slanja robe.
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              II. Pravo na odustanak od ugovora
            </h2>
            <p>
              Shodno Zakonu o zaštiti potrošača Republike Srbije, pravo na
              odustanak od ugovora ne može se ostvariti za robu koja je zbog
              svoje prirode podložna kvarenju ili ne može biti vraćena nakon
              otvaranja iz higijenskih i bezbednosnih razloga.
            </p>
            <p>
              U slučaju proizvoda koji su neoštećeni, neotvoreni i podobni za
              dalje stavljanje u promet, Prodavac može, po sopstvenoj proceni i
              u skladu sa važećim propisima, odobriti povraćaj robe.
            </p>
            <p>
              Nakon izvršene isporuke, reklamacije se rešavaju isključivo u
              skladu sa pravilima o saobraznosti robe i postupkom reklamacije
              definisanim ovim Uslovima.
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              III. Reklamacije i saobraznost
            </h2>
            <p>Kupac ima pravo na reklamaciju u slučaju:</p>
            <ul className="ml-8 list-disc space-y-1">
              <li>oštećenja proizvoda tokom transporta,</li>
              <li>pogrešno isporučenog artikla,</li>
              <li>nepotpune isporuke,</li>
              <li>drugih nedostataka u saobraznosti robe.</li>
            </ul>
            <p>
              Kupac je dužan da prilikom preuzimanja pošiljke pregleda paket i
              odmah prijavi vidljiva oštećenja dostavljaču.
            </p>
            <p>
              Ukoliko postoje značajna oštećenja, kupac može odbiti prijem
              pošiljke.
            </p>
            <p>
              Ukoliko se nedostatak utvrdi nakon preuzimanja robe, reklamacija
              se podnosi:
              <ul className="ml-8 list-disc space-y-1 py-3 pb-0">
                <li>
                  popunjavanjem{" "}
                  <a
                    href="/zahtev-za-reklamacije.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand hover:underline"
                  >
                    Reklamacionog lista
                  </a>{" "}
                  ,
                </li>
                <li>
                  {" "}
                  slanjem na e-mail adresu:{" "}
                  <a
                    href="mailto:info@faraondiskonti.rs"
                    className="font-semibold text-brand hover:underline"
                  >
                    info@faraondiskonti.rs
                  </a>
                </li>
              </ul>
            </p>
            <p>
              Prodavac vodi evidenciju primljenih reklamacija i svakom zahtevu
              dodeljuje evidencioni broj.
            </p>
            <p>
              Prodavac će najkasnije u roku od 8 dana od prijema reklamacije
              dostaviti odgovor u pisanoj ili elektronskoj formi sa predlogom
              rešavanja reklamacije.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
