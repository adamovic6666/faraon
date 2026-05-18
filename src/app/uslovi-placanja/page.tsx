import SectionTitle from "@/components/common/SectionTitle";
import { Separator } from "@radix-ui/react-separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uslovi plaćanja",
  description:
    "Uslovi plaćanja u online prodavnici Faraon diskonti – platne kartice, plaćanje pouzećem i plaćanje preko računa.",
};

export const dynamic = "force-static";

export default function UsloviPlacanjaPage() {
  return (
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <SectionTitle title="Uslovi plaćanja" noAnimation />

        <div className="mx-auto mt-10 max-w-3xl space-y-8 font-light text-sm leading-relaxed text-black/80 md:text-base">
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              1. Online plaćanje platnim karticama
            </h2>
            <p>
              Plaćanje se vrši direktno na sajtu korišćenjem platnih kartica
              Visa, Mastercard, Maestro i DinaCard u saradnji sa sistemom
              UniCredit Banke.
            </p>
            <p>
              Sva plaćanja izvršavaju se u lokalnoj valuti Republike Srbije –
              dinar (RSD).
            </p>
            <p>
              Prilikom unosa podataka o platnoj kartici, poverljive informacije
              prenose se putem zaštićene SSL konekcije i 3D Secure sistema
              zaštite.
            </p>
            <p>Podaci o platnoj kartici nisu dostupni Prodavcu.</p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              2. Plaćanje pouzećem
            </h2>
            <p>
              Kupac vrši plaćanje u gotovini, u dinarima (RSD), direktno
              dostavljaču prilikom preuzimanja pošiljke.
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />
          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              3. Plaćanje preko računa (predračun)
            </h2>
            <p>
              Po potvrdi porudžbine Kupcu se dostavlja predračun sa podacima za
              uplatu.
            </p>
            <p>Rok važenja predračuna iznosi 48 sati.</p>
            <p>
              Ukoliko uplata ne bude evidentirana u navedenom roku, porudžbina
              može biti automatski otkazana.
            </p>
            <p>Roba se šalje nakon evidentiranja uplate.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
