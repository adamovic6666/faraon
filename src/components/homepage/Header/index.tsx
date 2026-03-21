import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import * as motion from "framer-motion/client";
import PageLink from "@/components/common/Link";
import Link from "next/link";

const heroLinks = [
  { id: 1, label: "Meni", href: "/" },
  { id: 2, label: "Akcije", href: "/", highlighted: true },
  { id: 3, label: "Bezalkoholna pića", href: "/" },
  {
    id: 4,
    label: "Žestoka alkoholna pića",
    href: "/",
  },
  { id: 5, label: "Piva", href: "/" },
  { id: 6, label: "Vina", href: "/" },
  { id: 7, label: "Vode", href: "/" },
  { id: 8, label: "Čajevi, kafe i napici", href: "/" },
  { id: 9, label: "Sirupi i likeri", href: "/" },
  { id: 10, label: "Led", href: "/" },
];

const Header = () => {
  return (
    <header className="relative bg-brand overflow-hidden">
      <div className="fixed inset-x-0 top-18 z-100 border-t border-black/10 bg-primary shadow-xs md:top-22">
        <div className="mx-auto flex h-12 max-w-frame items-center justify-between gap-1 overflow-x-auto px-4 text-xs font-semibold text-black/80 scrollbar-none md:h-15.5 md:gap-2 md:px-4 lg:px-0">
          {heroLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 transition-colors hover:text-brand md:px-4 text-lg text-black/80",
                item.highlighted && "bg-brand text-white hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 opacity-75 pointer-events-none">
        <div className="h-full w-full bg-[url('/images/hijeroglofi.svg')] bg-size-[300%_auto] bg-center bg-repeat-y md:bg-size-[150%_auto] lg:bg-cover lg:bg-no-repeat" />
      </div>

      <div className="relative z-10 mx-auto max-w-frame px-4 pt-12 md:pt-15.5 lg:px-0">
        <div className="relative z-10 flex min-h-105 gap-8 md:min-h-120 lg:h-132">
          <motion.section
            initial={{ y: "80px", opacity: 0, rotate: -6 }}
            whileInView={{ y: "0", opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative order-2 w-full max-w-120 md:order-1"
          >
            <Image
              src="/images/faraon.webp"
              alt="Faraon"
              fill
              priority
              sizes="(min-width: 1024px) 34vw, (min-width: 768px) 45vw, 80vw"
              className="object-contain object-center"
            />
          </motion.section>

          <section className="order-1 flex flex-col items-start justify-center md:order-2 lg:max-w-155 lg:justify-self-end">
            <motion.h2
              initial={{ y: "100px", opacity: 0, rotate: 10 }}
              whileInView={{ y: "0", opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn([
                integralCF.className,
                "mb-3 text-[12.5vw] font-bold uppercase leading-[0.95] text-white sm:text-6xl md:mb-2 md:text-5xl lg:mb-4 lg:text-[86px] lg:leading-[0.94]",
              ])}
            >
              SVE ŠTO PIJETE, <br />
              FARAON DONOSI!
            </motion.h2>
            <motion.p
              initial={{ y: "100px", opacity: 0 }}
              whileInView={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-6 max-w-136 text-sm font-light text-white md:mb-4 md:text-lg lg:mb-8 lg:text-2xl"
            >
              Najbrža dostava i najniže cene pića u Novom Sadu.
            </motion.p>
            <motion.div
              initial={{ y: "100px", opacity: 0 }}
              whileInView={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex gap-3 w-full"
            >
              <PageLink href="/">Poruči odmah</PageLink>
            </motion.div>
          </section>
        </div>
      </div>
    </header>
  );
};

export default Header;
