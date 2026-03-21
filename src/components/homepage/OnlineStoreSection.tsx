import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "@/types/category.types";
import SectionTitle from "../common/SectionTitle";
import PageLink from "../common/Link";

const OnlineStoreSection = ({
  id,
  title,
  data,
}: {
  id?: string;
  title: string;
  data: CategoryItem[];
}) => {
  return (
    <section id={id} className="max-w-frame mx-auto px-4 xl:px-0">
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
          className="mb-10 sm:mb-12"
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {data.map((item) => (
            <Link
              key={item.id}
              href="/"
              className="group min-h-44 rounded-xl border border-[#e4a100] bg-primary pl-4 pt-4 shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)] sm:min-h-48"
            >
              <div className="relative flex h-full min-h-20 items-start justify-between gap-8 sm:min-h-24">
                <div>
                  <h3 className="max-w-28 text-xl font-semibold leading-snug text-black sm:text-2xl">
                    {item.title}
                  </h3>
                </div>

                <div className="absolute bottom-0 right-0 mt-auto flex h-26 items-center justify-center sm:h-32 sm:w-32 w-26">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="h-full w-full brightness-0 invert sm:h-full sm:w-full"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7 flex justify-center md:items-center">
          <PageLink inCenter href="/" variant="brand">
            Vidi sve
          </PageLink>
        </div>
      </div>
    </section>
  );
};

export default OnlineStoreSection;
