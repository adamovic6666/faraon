import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "@/types/category.types";
import SectionTitle from "../common/SectionTitle";
import PageLink from "../common/Link";

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
            <div className="md:flex md:flex-col items-center justify-center">
              <span>
                Najpovoljnije cene pića u Novom Sada, najbrža isporuka do tvog
                praga!
              </span>
              <span> Poruči svoje piće i Faraon dolazi do tebe.</span>
            </div>
          }
          className="mb-12"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.map((item) => (
            <Link
              key={item.id}
              href="/shop"
              className="group rounded-xl hover:shadow-sm transition-shadow pl-4 pt-4 bg-section border border-black/10 min-h-48"
            >
              <div className="flex items-start justify-between gap-8 h-full min-h-20 sm:min-h-24 relative">
                <div>
                  <h3 className="text-black text-xl sm:text-2xl font-semibold leading-snug max-w-28">
                    {item.title}
                  </h3>
                </div>

                <div className="flex absolute items-center justify-center sm:w-32 w-26 sm:h-32 h-26 mt-auto right-0 bottom-0">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-full h-full sm:w-full sm:h-full"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <PageLink href="/">Kupi odmah</PageLink>
        </div>
      </div>
    </section>
  );
};

export default OnlineStoreSection;
