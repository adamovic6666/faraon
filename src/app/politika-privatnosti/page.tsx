import SectionTitle from "@/components/common/SectionTitle";
import { Separator } from "@radix-ui/react-separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description:
    "Politika privatnosti i zaštita podataka o ličnosti u online prodavnici Faraon diskonti.",
};

export const dynamic = "force-static";

export default function PolitikaPrivatnostiPage() {
  return (
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <SectionTitle title="Politika privatnosti" noAnimation />

        <div className="mx-auto mt-10 max-w-3xl space-y-8 font-light text-sm leading-relaxed text-black/80 md:text-base">
          <p>
            STR Diskont pića Faraon PS obrađuje podatke o ličnosti u skladu sa
            Zakonom o zaštiti podataka o ličnosti Republike Srbije („Sl. glasnik
            RS", br. 87/2018).
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              1. Podaci koji se prikupljaju
            </h2>
            <p>Prodavac može prikupljati sledeće podatke:</p>
            <ul className="ml-8 list-disc space-y-1">
              <li>ime i prezime,</li>
              <li>adresu isporuke,</li>
              <li>broj telefona,</li>
              <li>e-mail adresu,</li>
              <li>IP adresu,</li>
              <li>podatke o uređaju i internet pregledaču,</li>
              <li>podatke o korišćenju sajta.</li>
            </ul>
            <p>Podaci se obrađuju radi:</p>
            <ul className="ml-8 list-disc space-y-1">
              <li>realizacije porudžbine,</li>
              <li>komunikacije sa Kupcem,</li>
              <li>izdavanja računa,</li>
              <li>organizacije dostave,</li>
              <li>unapređenja rada sajta,</li>
              <li>statističke i marketinške analize.</li>
            </ul>
          </section>
          <Separator className="my-8 h-px bg-black/10" />
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              2. Deljenje podataka sa trećim licima
            </h2>
            <p>
              Prodavac može deliti podatke isključivo sa partnerima koji
              učestvuju u realizaciji usluge i koji su obavezani da podatke
              obrađuju u skladu sa važećim propisima Republike Srbije.
            </p>
            <p>Podaci mogu biti dostavljeni:</p>
            <ul className="ml-8 list-disc space-y-1">
              <li>dostavnoj službi radi realizacije isporuke,</li>
              <li>
                knjigovodstvenoj agenciji radi ispunjavanja zakonskih obaveza,
              </li>
              <li>
                pružaocima analitičkih i marketinških alata kao što su Google
                Analytics i Meta Pixel.
              </li>
            </ul>
          </section>
          <Separator className="my-8 h-px bg-black/10" />

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              3. Zaštita podataka
            </h2>
            <p>
              Prodavac preduzima odgovarajuće tehničke i organizacione mere
              zaštite podataka o ličnosti od neovlašćenog pristupa, zloupotrebe,
              gubitka ili uništenja.
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              4. Prava korisnika
            </h2>
            <p>Korisnik ima pravo da:</p>
            <ul className="ml-8 list-disc space-y-1">
              <li>zatraži pristup svojim podacima,</li>
              <li>zahteva ispravku netačnih podataka,</li>
              <li>zahteva brisanje podataka,</li>
              <li>ograniči obradu podataka,</li>
              <li>podnese prigovor na obradu podataka.</li>
            </ul>
            <p>
              Zahtevi se mogu poslati na e-mail adresu:{" "}
              <a
                href="mailto:info@faraondiskonti.rs"
                className="font-semibold text-brand hover:underline"
              >
                info@faraondiskonti.rs
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
