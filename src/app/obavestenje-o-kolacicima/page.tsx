import SectionTitle from "@/components/common/SectionTitle";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Obaveštenje o kolačićima",
  description:
    "Obaveštenje o kolačićima (Cookie Policy) sajta Faraon diskonti – kako i zašto koristimo kolačiće.",
};

export const dynamic = "force-static";

export default function ObavestenjeOKolacicimaPage() {
  return (
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <SectionTitle title="Obaveštenje o kolačićima" noAnimation />

        <div className="mx-auto mt-10 max-w-3xl space-y-8 font-light text-sm leading-relaxed text-black/80 md:text-base">
          <p>
            Internet stranica{" "}
            <a
              href="https://www.faraondiskonti.rs"
              className="font-semibold text-brand hover:underline"
            >
              www.faraondiskonti.rs
            </a>{" "}
            koristi kolačiće (eng. cookies) i slične tehnologije za praćenje
            kako bi obezbedila stabilan rad online prodavnice, pružila optimalno
            korisničko iskustvo i omogućila personalizovano oglašavanje.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              1. Šta je kolačić?
            </h2>
            <p>
              Kolačić je mala tekstualna datoteka koja se skladišti na Vašem
              računaru ili mobilnom uređaju kada posetite naš sajt. Oni
              omogućavaju sajtu da prepozna Vaše uređaje i zapamti Vaše akcije i
              podešavanja (npr. artikle u korpi).
            </p>
          </section>
          <Separator className="my-8 h-px bg-black/10" />
          <section className="space-y-4">
            <h2 className="text-base font-bold text-black md:text-lg">
              2. Kategorije kolačića koje koristimo
            </h2>
            <div className="overflow-hidden rounded-2xl border border-black/15">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-brand text-white">
                    <th className="px-5 py-3 text-left font-semibold">
                      Vrsta kolačića
                    </th>
                    <th className="px-5 py-3 text-left font-semibold">Svrha</th>
                    <th className="px-5 py-3 text-left font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="px-5 py-3 font-medium text-black">
                      Neophodni (Tehnički)
                    </td>
                    <td className="px-5 py-3">
                      Omogućavaju osnovne funkcije poput korpe, prijave i
                      bezbednog plaćanja.
                    </td>
                    <td className="px-5 py-3 font-semibold text-black">
                      Uvek aktivni
                    </td>
                  </tr>
                  <tr className="bg-section">
                    <td className="px-5 py-3 font-medium text-black">
                      Statistički / Analitički
                    </td>
                    <td className="px-5 py-3">
                      Prate broj poseta i izvore saobraćaja (Google Analytics) u
                      cilju poboljšanja performansi. Podaci su anonimni.
                    </td>
                    <td className="px-5 py-3 text-black/60">Opcioni</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-5 py-3 font-medium text-black">
                      Marketinški
                    </td>
                    <td className="px-5 py-3">
                      Prate navike pretraživanja (Meta Pixel, Google Ads Tag)
                      radi prikazivanja relevantnih oglasa i remarketinga.
                    </td>
                    <td className="px-5 py-3 text-black/60">Opcioni</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <Separator className="my-8 h-px bg-black/10" />

          <section className="space-y-3">
            <h2 className="text-base font-bold text-black md:text-lg">
              3. Upravljanje kolačićima (Cookie Baner)
            </h2>
            <p>
              Prilikom prve posete sajtu, aktivira se Cookie Baner koji Vam
              omogućava izbor kategorija kolačića koje prihvatate.
            </p>
            <p>
              U svakom trenutku možete promeniti podešavanja ili potpuno
              blokirati kolačiće u Vašem internet pretraživaču.
            </p>
            <p>
              Blokiranje neophodnih kolačića može onemogućiti kupovinu na sajtu.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
