import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "@/types/category.types";
import { Badge } from "../ui/badge";
import SectionTitle from "../common/SectionTitle";

const OnlineStoreSection = ({
  title,
  data,
}: {
  title: string;
  data: CategoryItem[];
}) => {
  return (
    <section className="max-w-frame mx-auto px-4 xl:px-0 mt-12 sm:mt-16">
      <div className="p-1 sm:p-2">
        <SectionTitle
          title={title}
          description={
            <>
              Najpovoljnije cene pića u Novom Sada, najbrža isporuka do tvog
              praga!
              <br />
              Poruči svoje piće i Faraon dolazi do tebe.
            </>
          }
          className="mb-12"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.map((item) => (
            <Link
              key={item.id}
              href="/shop"
              className="group rounded-xl px-3 sm:px-4 py-4 sm:py-5 hover:shadow-sm transition-shadow bg-section border border-black/10"
            >
              <div className="flex flex-col items-start justify-between gap-6 h-full min-h-20 sm:min-h-24">
                <div>
                  <h3 className="text-black text-lg sm:text-xl font-semibold leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-center sm:w-20 w-16 sm:h-20 h-16 mt-auto ml-auto">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={56}
                    height={56}
                    className="w-full h-full sm:w-full sm:h-full"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-2 font-semibold hover:brightness-95 transition-all"
          >
            Kupi odmah
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OnlineStoreSection;
