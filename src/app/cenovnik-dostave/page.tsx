import SectionTitle from "@/components/common/SectionTitle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cenovnik dostave",
  description:
    "Pregledajte cene dostave za sva mesta u kojima Faraon diskonti vrši isporuku. Najbrža dostava pića po diskontnim cenama u Novom Sadu! Pozovite!",
};

export const dynamic = "force-static";

const deliveryPrices = [
  { name: "Novi Sad centar", price: 380 },
  { name: "Sajlovo", price: 600 },
  { name: "Adice", price: 600 },
  { name: "Petrovaradin", price: 600 },
  { name: "Klisa", price: 600 },
  { name: "Karagača", price: 600 },
  { name: "Sremska Kamenica", price: 650 },
  { name: "Veternik", price: 650 },
  { name: "Kamenjar", price: 650 },
  { name: "Bangladeš", price: 650 },
  { name: "Ribarsko ostrvo", price: 650 },
  { name: "Veliki Rit", price: 800 },
  { name: "Šangaj", price: 800 },
  { name: "Alibegovac", price: 800 },
  { name: "Čardak", price: 800 },
  { name: "Gornje livade", price: 900 },
  { name: "Rimski šančevi", price: 900 },
  { name: "Rumenka", price: 1000 },
  { name: "Bukovac", price: 1000 },
  { name: "Popovica", price: 1000 },
  { name: "Nemanovci", price: 1200 },
  { name: "Ledinci", price: 1200 },
  { name: "Futog", price: 1200 },
  { name: "Pejićevi salaši", price: 1400 },
  { name: "Sremski Karlovci", price: 1400 },
  { name: "Stari Ledinci", price: 1400 },
  { name: "Kać", price: 1500 },
  { name: "Rakovac", price: 1500 },
  { name: "Kisač", price: 1600 },
  { name: "Čenej (centar)", price: 1600 },
  { name: "Beočin", price: 1800 },
  { name: "Bački Jarak", price: 2000 },
  { name: "Budisava", price: 2000 },
  { name: "Begeč", price: 2000 },
  { name: "Brazilija", price: 2200 },
  { name: "Irig", price: 2200 },
  { name: "Temerin", price: 2500 },
  { name: "Stepanovićevo", price: 2700 },
  { name: "Sirig", price: 2700 },
  { name: "Banoštor", price: 2800 },
  { name: "Bački Petrovac", price: 3000 },
];

export default function CenovnikDostavePage() {
  return (
    <main className="pt-20 pb-10 md:pt-24 md:pb-12">
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
                {deliveryPrices.map((item, i) => (
                  <tr
                    key={item.name}
                    className={i % 2 === 0 ? "bg-white" : "bg-section"}
                  >
                    <td className="px-6 py-3 text-sm text-black/80">
                      {item.name}
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold text-right text-black/80">
                      {item.price.toLocaleString("sr-RS", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      RSD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2 rounded-[16px] border border-black/10 bg-section px-6 py-4 text-sm text-black/70">
            <p>
              <strong>Napomena:</strong> Dostava se vrši samo na lokacijama
              navedenim u cenovniku dostave.
            </p>
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
          </div>
        </div>
      </div>
    </main>
  );
}
