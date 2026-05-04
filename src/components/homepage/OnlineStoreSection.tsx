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
  const splitIndex = Math.ceil(data.length / 2);
  const leftColumnItems = data.slice(0, splitIndex);
  const rightColumnItems = data.slice(splitIndex);

  const renderCategoryCard = (item: CategoryItem) => (
    <Link
      key={item.alias}
      href={item.alias}
      className="group min-h-44 rounded-xl border border-[#e4a100] bg-primary pl-4 pt-4  transition-shadow hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)] sm:min-h-48"
    >
      <div className="relative flex h-full min-h-20 items-start justify-between gap-8 sm:min-h-24">
        <div>
          <h3 className="max-w-28 text-xl font-semibold leading-snug text-black sm:text-2xl">
            {item.name}
          </h3>
        </div>

        <div className="absolute bottom-0 right-0 mt-auto flex h-26 items-center justify-center sm:h-32 sm:w-32 w-26">
          <Image
            src={
              process.env.NEXT_PUBLIC_API_URL +
              item.image
                .replace(
                  /\/sites\/default\/files\/styles\/[^/]+\/public\//,
                  "/sites/default/files/",
                )
                .replace(/\.webp$/, "")
            }
            alt={item.name}
            width={64}
            height={64}
            className="h-full w-full sm:h-full sm:w-full"
          />
        </div>
      </div>
    </Link>
  );

  return (
    <section id={id} className="max-w-frame mx-auto px-4 xl:px-0 w-full">
      <div>
        <SectionTitle
          title={title}
          description={
            <span className="md:flex md:flex-col items-center justify-center">
              <span>
                Najpovoljnije cene pića u Novom Sada, najbrža isporuka do tvog
                praga!
              </span>
              <span> Poruči svoje piće i Faraon dolazi do tebe.</span>
            </span>
          }
          className="mb-10 md:mb-12"
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
          <div className="flex flex-col gap-3 sm:gap-4">
            {leftColumnItems.map((item) => renderCategoryCard(item))}
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {rightColumnItems.map((item) => renderCategoryCard(item))}
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
          {data.map((item) => renderCategoryCard(item))}
        </div>

        <div className="mt-9 flex justify-center md:items-center">
          <PageLink inCenter href="/prodavnica" variant="brand">
            Vidi sve
          </PageLink>
        </div>
      </div>
    </section>
  );
};

export default OnlineStoreSection;
