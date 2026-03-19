import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import Link from "next/link";
import * as motion from "framer-motion/client";
import PageLink from "@/components/common/Link";

const Header = () => {
  return (
    <header className="relative bg-brand overflow-hidden">
      <div className="absolute inset-0 opacity-75 pointer-events-none">
        <div className="h-full w-full bg-[url('/images/hijeroglofi.svg')] bg-size-[300%_auto] bg-center bg-repeat-y md:bg-cover md:bg-no-repeat" />
      </div>

      <div className="relative z-10 max-w-frame mx-auto min-h-107.5 md:min-h-135 px-4">
        <div className="relative z-10 h-full grid md:grid-cols-12 items-center py-10 md:py-12 min-h-[calc(100dvh-72px)] md:min-h-auto">
          <section className="md:col-span-7 lg:col-span-6 flex flex-col justify-center items-start">
            <motion.h2
              initial={{ y: "100px", opacity: 0, rotate: 10 }}
              whileInView={{ y: "0", opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn([
                integralCF.className,
                "text-[12.5vw] font-bold leading-snug sm:text-6xl md:text-7xl lg:leading-19 mb-3 md:mb-4 text-white uppercase",
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
              className="text-white/80 text-md md:text-2xl mb-8 lg:mb-10 max-w-140 font-light"
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

          <motion.section
            initial={{ y: "80px", opacity: 0, rotate: 6 }}
            whileInView={{ y: "0", opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="md:col-span-5 lg:col-span-6 relative min-h-96 md:min-h-160"
          >
            <Image
              src="/images/faraon.webp"
              alt="Faraon"
              fill
              priority
              className="object-contain object-center md:object-right"
            />
          </motion.section>
        </div>
      </div>
    </header>
  );
};

export default Header;
