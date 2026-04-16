import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import * as motion from "framer-motion/client";
import PageLink from "@/components/common/Link";

const Header = () => {
  return (
    <header className="relative bg-brand overflow-hidden">
      <div className="absolute inset-0 opacity-75 pointer-events-none">
        <div className="h-full w-full bg-[url('/images/hijeroglofi.svg')] bg-size-[300%_auto] bg-center bg-repeat-y md:bg-size-[150%_auto] lg:bg-cover lg:bg-no-repeat" />
      </div>

      <div className="relative z-10 mx-auto max-w-frame px-4 pt-[12.5dvh] md:pt-14 lg:pt-15.5 lg:px-0">
        <div className="relative z-10 flex flex-col md:flex-row min-h-[calc(100dvh-184px)] md:min-h-110 lg:min-h-120 xl:h-132">
          <motion.section
            initial={{ y: "80px", opacity: 0, rotate: -6 }}
            whileInView={{ y: "0", opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            // className="relative order-2 mx-auto min-h-160 w-full max-w-120 md:order-1 md:min-h-0 md:mx-0"
            className="relative order-2 w-full max-w-120 min-h-112 md:order-1 md:min-h-96 md:max-w-94 lg:min-h-120 lg:max-w-120"
          >
            <Image
              src="/images/faraon.webp"
              alt="Faraon"
              fill
              priority
              className="object-cover md:object-contain lg:object-left"
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
                "mb-3 text-[12.5vw] font-bold uppercase leading-[1.1] text-white sm:text-6xl md:mb-2 md:text-4xl lg:mb-4 lg:text-6xl xl:text-[86px] lg:leading-[1.05]",
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
              className="mb-6 max-w-136 font-light text-white text-lg md:mb-4 md:text-base lg:mb-8 lg:text-2xl"
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
              <PageLink href="/prodavnica">Poruči odmah</PageLink>
            </motion.div>
          </section>
        </div>
      </div>
    </header>
  );
};

export default Header;
