import { fetchPricingTerms } from "@/lib/api/faraon";
import SectionTitle from "@/components/common/SectionTitle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cenovnik dostave",
  description:
    "Pregledajte cene dostave za sva mesta u kojima Faraon diskonti vrši isporuku. Besplatna dostava za porudžbine iznad 12.000 RSD.",
};

export const revalidate = 300;

export default async function CenovnikDostavePage() {
  const result = await fetchPricingTerms();
  const terms = result.ok ? result.data : [];

  return (
    <main className="pt-20 pb-12 md:pt-24 md:pb-16">
      <div className="mx-auto max-w-frame px-4 xl:px-0">
        <SectionTitle title="Cenovnik dostave" noAnimation />

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-[20px] border border-black/15 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-brand text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Mesto
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Cena dostave
                  </th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term, i) => (
                  <tr
                    key={term.id}
                    className={i % 2 === 0 ? "bg-white" : "bg-section"}
                  >
                    <td className="px-6 py-3 text-sm text-black/80">
                      {term.name}
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold text-right text-black/80">
                      {Number(term.price).toLocaleString("sr-RS", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {term.currencyCode}
                    </td>
                  </tr>
                ))}
                {terms.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-8 text-center text-sm text-black/50"
                    >
                      Cenovnik trenutno nije dostupan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2 rounded-[16px] border border-black/10 bg-section px-6 py-4 text-sm text-black/70">
            <p>
              <strong>PDV:</strong> Sve cene dostave prikazane su sa uračunatim
              PDV-om.
            </p>
            <p>
              <strong>Osnovna cena:</strong> Pokriva pošiljke do 25 kg težine.
            </p>
            <p>
              <strong>Dodatna težina:</strong> Svakih sledećih 25 kg doplaćuje
              se sa 200 RSD.
            </p>
            <p>
              <strong>Besplatna dostava:</strong> Važi za sve porudžbine iznad
              12.000 RSD.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
